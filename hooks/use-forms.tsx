import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { playlistSchema } from "@/schemas/entities.schema";
import type { LoginData, RegisterData } from "@/types/auth";
import type { PlaylistSchema } from "@/types/entities";
import { onLogin, onRegister } from "@/telefunc/connexion.telefunc";
import { logger } from "@/lib/logger";
import { Status } from "@/types/server-response";
import { errorToast, successToast } from "@/lib/toaster";

export function useNewPlaylistForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PlaylistSchema>({
    resolver: zodResolver(playlistSchema) as Resolver<PlaylistSchema>,
    defaultValues: {
      image: {
        alt: "The cover of the playlist",
      },
      accountId: faker.string.uuid(),
      visibility: "public",
    },
  });

  const handleSubmit = (form: PlaylistSchema) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}

export function useLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginData>,
    defaultValues: {
      remember: true,
    },
  });

  const handleSubmit = async (submitted: LoginData) => {
    const response = await onLogin(submitted);
    logger.info("Login: ", response);
    if (!response.success) {
      switch (response.status) {
        case Status.IncorrectPassword:
          form.setError("password", { message: response.title });
          break;
        case Status.IncorrectEmail:
          form.setError("email", { message: response.title });
          break;
        default:
          errorToast(response.title, response.description);
      }
    } else {
      successToast("Welcome back !");
      onSuccess();
    }
  };

  return { formRef, form, handleSubmit };
}

export function useRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterData>,
    defaultValues: {
      image: {
        alt: "The profile picture of the user",
      },
      agree_terms_of_service: false,
    },
  });

  const handleSubmit = async (submitted: RegisterData) => {
    const response = await onRegister(submitted);
    logger.info("Register: ", response);
    if (!response.success) {
      switch (response.status) {
        case Status.ExistingEmail:
        case Status.IncorrectEmail:
          form.setError("email", { message: response.title });
          break;
        case Status.IncorrectPassword:
          form.setError("password", { message: response.title });
          break;
        case Status.ExistingUsername:
          form.setError("username", { message: response.title });
          break;
        default:
          errorToast(response.title, response.description);
      }
    } else {
      successToast("Welcome !");
      onSuccess();
    }
  };

  return { formRef, form, handleSubmit };
}
