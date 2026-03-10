import { apply, serve } from "@photonjs/express";
import express from "express";
import { generatePlaceholders } from "./placeholders";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default startApp() as unknown;

function startApp() {
  const app = express();

  const { accounts, exercices, playlists } = generatePlaceholders();

  app.get("/placeholders", (req, res) => {
    console.log("Placeholder asked");
    return res.send({
      accounts,
      exercices,
      playlists,
    });
  });

  apply(app, []);

  return serve(app, {
    port,
  });
}
