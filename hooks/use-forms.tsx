import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { logger } from "@/lib/logger";
import { errorToast, successToast } from "@/lib/toaster";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { playlistSchema } from "@/schemas/entities.schema";
import { onLogin, onRegister } from "@/telefunc/connexion.telefunc";
import type { LoginData, RegisterData } from "@/types/auth";
import type { PlaylistSchema } from "@/types/entities";
import { Status } from "@/types/server-response";
import useSession from "./use-session";

export function useNewPlaylistForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PlaylistSchema>({
    resolver: zodResolver(playlistSchema) as Resolver<PlaylistSchema>,
    defaultValues: {
      image: {
        alt: "The cover of the playlist",
      },
      accountId: faker.number.int(),
      visibility: "public",
    },
  });

  const handleSubmit = (form: PlaylistSchema) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}

export function useLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { setSession } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginData>,
    defaultValues: { remember: true },
  });

  const handleSubmit = async (submitted: LoginData) => {
    setSubmitLoading(true);
    try {
      const response = await onLogin(submitted);

      if (!response.success) {
        if (response.status === Status.IncorrectPassword) {
          form.setError("password", { message: response.title });
        } else if (response.status === Status.IncorrectEmail) {
          form.setError("email", { message: response.title });
        } else {
          errorToast(response.title, response.description);
        }
      } else {
        const session = (response as any).session;
        setSession(session);
        successToast(`Welcome back, ${session.username} !`);
        onSuccess();
      }
    } catch (err) {
      logger.error("Client-side error during login:", err);
      errorToast("A client error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  return { formRef, form, handleSubmit, submitLoading };
}

export function useRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { setSession } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterData>,
    defaultValues: {
      image: { alt: "The profile picture" },
      agree_terms_of_service: false,
    },
  });

  const handleSubmit = async (submitted: RegisterData) => {
    setSubmitLoading(true);
    try {
      const response = await onRegister(submitted);

      if (!response.success) {
        if (response.status === Status.ExistingEmail || response.status === Status.IncorrectEmail) {
          form.setError("email", { message: response.title });
        } else if (response.status === Status.ExistingUsername) {
          form.setError("username", { message: response.title });
        } else {
          errorToast(response.title, response.description);
        }
      } else {
        const session = (response as any).session;
        setSession(session);
        successToast(`Welcome, ${session.username} !`);
        onSuccess();
      }
    } catch (err) {
      logger.error("Client-side error during register:", err);
      errorToast("An unexpected error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  return { formRef, form, handleSubmit, submitLoading };
}
