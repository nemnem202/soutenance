import { Router } from "express";
import googleAuthHandler from "./google-auth-handler";

const router = Router();

router.use("/auth", googleAuthHandler());

export default router;
