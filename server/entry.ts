import { apply, serve } from "@photonjs/express";
import express from "express";
import { generatePlaceholders } from "./placeholders";
import { telefuncHandler } from "./telefunc-handler";
import { env } from "@/lib/env";
import GooogleController from "@/controllers/GoogleController";
import prismaClient from "@/lib/prisma-client";

const port = 3000;

export default startApp() as unknown;

function startApp() {
  const app = express();

  const { accounts, exercises, playlists } = generatePlaceholders();

  app.get("/placeholders", (_, res) => {
    console.log("Placeholder asked");
    return res.send({
      accounts,
      exercises,
      playlists,
    });
  });

  app.get(env.GOOGLE_REDIRECT_PATH, (req, res) =>
    new GooogleController({ client: prismaClient, req, res }).getCallback(),
  );

  apply(app, [telefuncHandler]);

  return serve(app, {
    port,
  });
}
