import { enhance, type UniversalHandler } from "@universal-middleware/core";
import getCurrentUserFromCookie from "../middlewares/getCurrentUser";
import { telefunc } from "telefunc";

export const telefuncHandler: UniversalHandler = enhance(
  async (request, context, runtime) => {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const user = await getCurrentUserFromCookie(cookieHeader);

    const httpResponse = await telefunc({
      url: new URL(request.url.toString()).pathname,
      method: request.method,
      body: await request.text(),
      context: {
        ...context,
        ...runtime,
        user,
        request,
      },
    });
    const { body, statusCode, contentType } = httpResponse;
    return new Response(body, {
      status: statusCode,
      headers: {
        "content-type": contentType,
      },
    });
  },
  {
    name: "desinvolts:telefunc-handler",
    path: `/_telefunc`,
    method: ["GET", "POST"],
    immutable: false,
  },
);
