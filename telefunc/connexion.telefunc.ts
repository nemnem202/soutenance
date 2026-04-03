import { getContext } from "telefunc";
import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import type { LoginData, RegisterData } from "@/types/auth";

export function onLogin({ ...props }: LoginData) {
  const context = getContext();
  return new ConnexionController({ client: prismaClient, context }).login({
    ...props,
  });
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
