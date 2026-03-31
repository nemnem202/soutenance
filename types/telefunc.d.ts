import "telefunc";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      user: null | { id: string };
      request: Request;
      setCookie: (
        name: string,
        value: string,
        options: Record<string, unknown>,
      ) => void;
    }
  }
}
