import { ConnexionController } from "@/controllers/ConnexionController";
import { env } from "@/lib/env";
import googleClient from "@/lib/google-auth-client";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import type { Session } from "@/types/auth";
import { faker } from "@faker-js/faker";
import cookieParser from "cookie-parser";
import { Router } from "express";
import { nanoid } from "nanoid";
// /api/auth

function generateRandomUsername(username: string): string {
  return `${username.split(" ").join("_")}_${nanoid(8)}`;
}

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

      const user = {
        id: payload?.sub,
        email: payload?.email,
        name: payload.name ?? faker.person.firstName(),
        picture: payload.picture,
      };

      if (!user.email || !user.id)
        throw new Error("Payload do not have email or id");

      logger.info("Google user authentified !");
      logger.table(user);

      let dbUser = await prismaClient.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!dbUser) {
        dbUser = await prismaClient.user.create({
          data: {
            email: user.email,
            profilePicture: user.picture ?? faker.image.avatar(),
            username: generateRandomUsername(user.name),
            authMethods: {
              create: {
                provider: "Google",
                providerId: user.id,
              },
            },
          },
        });
      } else if (user.picture) {
        await prismaClient.user.update({
          select: {
            id: true,
          },
          where: {
            id: dbUser.id,
          },
          data: {
            profilePicture: user.picture,
          },
        });
      }

      const session: Session = {
        id: dbUser.id,
        profilePictureSource: dbUser.profilePicture,
        username: dbUser.username,
      };

      const jwt = await ConnexionController.generateJwt(dbUser.id, true);

      res.cookie("token", jwt, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 365 * 24 * 3600 * 1000,
        sameSite: "lax",
      });

      res.clearCookie("oauth_state", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

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
