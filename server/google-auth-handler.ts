import { Router } from "express";
import GoogleAuthController from "@/controllers/GoogleAuthController";
import googleClient from "@/lib/google-auth-client";
import prismaClient from "@/lib/prisma-client";
import { COOKIE_NAME, getCookieOptions } from "@/lib/auth-utils";

export default function googleAuthHandler() {
  const router = Router();
  const getController = (_req: any, _res: any) =>
    new GoogleAuthController({ client: prismaClient, googleClient });

  router.get("/google", async (req, res) => {
    const { url, state } = await getController(req, res).prepareAuth();
    res.cookie("oauth_state", state, { httpOnly: true, maxAge: 600000 }); // 10 min
    res.redirect(url);
  });

  router.get("/callback", async (req, res) => {
    try {
      const { token, session } = await getController(req, res).verifyCallback(
        req.query.code as string,
        req.query.state as string,
        req.cookies.oauth_state
      );

      res.cookie(COOKIE_NAME, token, getCookieOptions(true));
      res.clearCookie("oauth_state");

      // Script de fermeture propre
      res.send(`
        <script>
          window.opener.postMessage({ session: ${JSON.stringify(session)} }, window.location.origin);
          window.close();
        </script>
      `);
    } catch (_err) {
      res.status(400).send("Authentication failed");
    }
  });

  return router;
}
