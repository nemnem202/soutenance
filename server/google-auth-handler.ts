import { env } from "@/lib/env";
import googleClient from "@/lib/google-auth-client";
import { logger } from "@/lib/logger";
import { Session } from "@/types/auth";
import { faker } from "@faker-js/faker";
import cookieParser from "cookie-parser";
import { Router } from "express";

// /api/auth

export default function googleAuthHandler() {
  const router = Router();

  router.use(cookieParser());

  router.get("/google", async (_, res) => {
    const state = crypto.randomUUID();

    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      state,
      prompt: "consent",
    });

    res.redirect(url);
  });

  router.get("/callback", async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;
    if (!state || state !== storedState) {
      return res.status(400).send("Invalid state");
    }
    try {
      const { tokens } = await googleClient.getToken(code as string);

      googleClient.setCredentials(tokens);

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) throw new Error("No payload");

      // 👉 user Google
      const user = {
        id: payload?.sub,
        email: payload?.email,
        name: payload.name ?? faker.person.firstName(),
        picture: payload.picture ?? faker.image.avatar(),
      };

      logger.info("Google user authentified !");
      logger.table(user);

      // TODO: créer / retrouver user en DB

      // res.status(200);

      const session: Session = {
        id: 10,
        profilePictureSource: user.picture,
        username: user.name,
      };

      res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { session: ${JSON.stringify(session)} },
            );
            window.close();
          </script>
        </body>
      </html>
    `);
    } catch (err) {
      logger.error("Google auth error", err);
      res.status(500).send("Auth error");
    }
  });

  return router;
}
