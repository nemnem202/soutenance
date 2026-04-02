import cookieParser from "cookie-parser";
import type { Express } from "express";

export default function googleAuthHandler(app: Express) {
  app.use(cookieParser());

  app.get("/google", async (_req, res) => {
    res.send("Coucou");
  });

  app.get("/callback", async (req, res) => {});
}
