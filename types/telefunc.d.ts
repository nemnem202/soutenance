import "telefunc";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      user: null | { id: string };
      request: Request;
    }
  }
}
