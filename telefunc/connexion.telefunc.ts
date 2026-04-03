import { getContext } from "telefunc";
import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import type { LoginData, RegisterData } from "@/types/auth";
import { handleAction } from "@/lib/response-handler";

export function onLogin(props: LoginData) {
  const context = getContext();
  const controller = new ConnexionController({ client: prismaClient, context });
  return handleAction("User Login", () => controller.login(props));
}

export function onRegister({ ...props }: RegisterData) {
  const context = getContext();
  return new ConnexionController({ client: prismaClient, context }).register({
    ...props,
  });
}

export function onLogout() {
  const context = getContext();
  return new ConnexionController({ client: prismaClient, context }).logout();
}

export function onRemoveAccount() {
  const context = getContext();
  return new ConnexionController({
    client: prismaClient,
    context,
  }).removeAccount();
}
