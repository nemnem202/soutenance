import { ConnexionController } from "@/controllers/ConnexionController";
import prismaClient from "@/lib/prisma-client";
import type { LoginData, RegisterData } from "@/types/auth";
import { getContext } from "telefunc";

export function onLogin({ ...props }: LoginData) {
  const { request } = getContext();
  return new ConnexionController({ client: prismaClient, request }).login({
    ...props,
  });
}

export function onRegister({ ...props }: RegisterData) {
  const { request } = getContext();
  return new ConnexionController({ client: prismaClient, request }).register({
    ...props,
  });
}
