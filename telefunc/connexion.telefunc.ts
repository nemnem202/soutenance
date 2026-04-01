import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import type { LoginData, RegisterData } from "@/types/auth";
import { getContext } from "telefunc";

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
