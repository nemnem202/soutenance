import { Router } from "express";
import GoogleAuthController from "@/controllers/GoogleAuthController";
import googleClient from "@/lib/google-auth-client";
import prismaClient from "@/lib/prisma-client";

export default function googleAuthHandler() {
  const router = Router();

  router.get("/google", async (req, res) => {
    const controller = new GoogleAuthController({
      client: prismaClient,
      user: null,
      googleClient,
    });
    return controller.getAuth(res);
  });

  router.get("/callback", async (req, res) => {
    const controller = new GoogleAuthController({
      client: prismaClient,
      user: null,
      googleClient,
    });

    try {
      await controller.handleCallback(req, res);
    } catch (err) {
      // En cas d'erreur dans la popup, on ferme proprement
      res.status(400).send(`
        <html><body><script>
          window.opener.postMessage({ error: "Auth failed" }, window.location.origin);
          window.close();
        </script></body></html>
      `);
    }
  });

  return router;
}
