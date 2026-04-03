import { getContext } from "telefunc";
import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import type { LoginData, RegisterData } from "@/types/auth";
import { handleAction } from "@/lib/response-handler";

export async function onLogin(props: LoginData) {
  const controller = new ConnexionController({ client: prismaClient, context: getContext() });
  return handleAction("Login", () => controller.login(props));
}

export async function onRegister(props: RegisterData) {
  const controller = new ConnexionController({ client: prismaClient, context: getContext() });
  return handleAction("Registration", () => controller.register(props));
}

export async function onLogout() {
  const controller = new ConnexionController({ client: prismaClient, context: getContext() });
  return handleAction("Logout", () => controller.logout());
}
export function onRemoveAccount() {
  const context = getContext();
  const controller = new ConnexionController({
    client: prismaClient,
    context,
  });

  return handleAction("Remove Account", () => controller.removeAccount());
}
