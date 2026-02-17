import { enhance, type UniversalHandler } from "@universal-middleware/core";

export const createHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (request, _context, _runtime) => {
    const newTodo = (await request.json()) as { text: string };
    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
  { name: "my-app:handler", path: `/api/`, method: ["GET", "POST"], immutable: false },
);
