import request from "supertest";
import { app } from "@/server/entry";

export async function triggerTelefuncCall(args: any, filePath: string, funcName: string) {
  return await request(app)
    .post("/_telefunc")
    .set("Content-Type", "application/json")
    .send({
      file: filePath,
      name: funcName,
      args: [args],
    });
}
