import { apply, serve } from "@photonjs/express";
import cookieParser from "cookie-parser";
import express from "express";
import router from "./router";
import { telefuncHandler } from "./telefunc-handler";

const port = 3000;

export default startApp() as unknown;

function startApp() {
  const app = express();

  app.use(cookieParser());

  app.use("/api", router);

  apply(app, [telefuncHandler]);

  return serve(app, {
    port,
  });
}
