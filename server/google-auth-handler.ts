import GoogleAuthController from "@/controllers/GoogleAuthController";
import googleClient from "@/lib/google-auth-client";
import prismaClient from "@/lib/prisma-client";
import cookieParser from "cookie-parser";
import { Router } from "express";
// /api/auth

export default function googleAuthHandler() {
  const router = Router();

  router.use(cookieParser());

  router.get("/google", async (req, res) => {
    new GoogleAuthController({
      req,
      res,
      client: prismaClient,
      googleClient,
    }).getAuth();
  });

  router.get("/callback", async (req, res) => {
    new GoogleAuthController({
      req,
      res,
      client: prismaClient,
      googleClient,
    }).getCallback();
  });

  return router;
}
