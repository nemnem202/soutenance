import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { telefunc } from "telefunc";
import getCurrentUserFromCookie from "../middlewares/getCurrentUser";

export const telefuncHandler: UniversalHandler = enhance(
  async (request, context, runtime) => {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const user = await getCurrentUserFromCookie(cookieHeader);
    const cookiesToSet: string[] = [];

    const httpResponse = await telefunc({
      request,
      context: {
        ...context,
        ...runtime,
        user,
        request,
        setCookie: (name: string, value: string, options: Record<string, unknown>) => {
          const parts = [`${name}=${value}`];
          if (options.httpOnly) parts.push("HttpOnly");
          if (options.secure) parts.push("Secure");
          if (options.path) parts.push(`Path=${options.path}`);
          if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
          if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
          cookiesToSet.push(parts.join("; "));
        },
      },
    });

    const { body, statusCode, contentType } = httpResponse;

    const headers = new Headers({ "content-type": contentType });
    for (const cookie of cookiesToSet) {
      headers.append("set-cookie", cookie);
    }

    return new Response(body, { status: statusCode, headers });
  },
  {
    name: "desinvolts:telefunc-handler",
    path: `/_telefunc`,
    method: ["GET", "POST"],
    immutable: false,
  }
);
