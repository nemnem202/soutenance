import { apply, serve } from "@photonjs/express";
import cookieParser from "cookie-parser";
import express from "express";
import router from "./router";
import { telefuncHandler } from "./telefunc-handler";
import { createDevMiddleware } from "vike/server";

const port = 3000;
export const app = express();
export default startApp() as unknown;

function startApp() {
  app.use(cookieParser());

  app.use("/api", router);

  apply(app, [telefuncHandler]);

  return serve(app, {
    port,
  });
}
