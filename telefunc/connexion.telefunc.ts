import { getContext, shield } from "telefunc";
import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import type { LoginData, RegisterData } from "@/types/auth";

export async function onLogin(props: LoginData) {
  const context = getContext();
  const controller = new ConnexionController({ client: prismaClient, user: context.user, context });
  return handleAction("Login", () => controller.login(props));
}

export async function onRegister(props: RegisterData) {
  const context = getContext();
  const controller = new ConnexionController({ client: prismaClient, user: context.user, context });
  return handleAction("Registration", () => controller.register(props));
}

export async function onLogout() {
  const context = getContext();
  const controller = new ConnexionController({ client: prismaClient, user: context.user, context });
  return handleAction("Logout", () => controller.logout());
}

export function onRemoveAccount() {
  const context = getContext();
  const controller = new ConnexionController({ client: prismaClient, user: context.user, context });
  return handleAction("Remove Account", () => controller.removeAccount());
}

shield(onRegister, [shield.type.any], {});
