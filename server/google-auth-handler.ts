import cookieParser from "cookie-parser";
import { Router } from "express";
import GoogleAuthController from "@/controllers/GoogleAuthController";
import googleClient from "@/lib/google-auth-client";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export default function googleAuthHandler() {
  const router = Router();

  router.use(cookieParser());

  router.get("/google", async (req, res) => {
    const controller = new GoogleAuthController({
      req,
      res,
      client: prismaClient,
      googleClient,
    });
    return handleAction("Google Auth", () => controller.getAuth());
  });

  router.get("/callback", async (req, res) => {
    const controller = new GoogleAuthController({
      req,
      res,
      client: prismaClient,
      googleClient,
    });
    return handleAction("Google Auth", () => controller.getCallback());
  });

  return router;
}
