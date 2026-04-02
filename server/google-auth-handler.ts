import cookieParser from "cookie-parser";
import { Router } from "express";

export default function googleAuthHandler() {
  const router = Router();

  router.use(cookieParser());

  router.get("/google", async (_req, res) => {
    return res.send("Coucou");
  });

  router.get("/callback", async (req, res) => {});

  return router;
}
