import { apply, serve } from "@photonjs/express";
import express from "express";
import { generatePlaceholders } from "./placeholders";
import router from "./router";
import { telefuncHandler } from "./telefunc-handler";

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

  app.use("/api", router);

  apply(app, [telefuncHandler]);

  return serve(app, {
    port,
  });
}
