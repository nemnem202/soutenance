import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { logger } from "@/lib/logger";
import { errorToast, loadingToast, successToast } from "@/lib/toaster";
import { loginSchema, playlistRegisterSchema, registerSchema } from "@/schemas/auth.schema";
import { onLogin, onRegister } from "@/telefunc/connexion.telefunc";
import type { LoginData, RegisterData } from "@/types/auth";
import { Status } from "@/types/server-response";
import useSession from "./use-session";
import type { PlaylistRegisterData } from "@/types/playlist";
import { onPlaylistCreation } from "@/telefunc/playlist.telefunc";
import { reload } from "vike/client/router";

export function useNewPlaylistForm({ onSubmit }: { onSubmit?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PlaylistRegisterData>({
    resolver: zodResolver(playlistRegisterSchema) as Resolver<PlaylistRegisterData>,
    defaultValues: {
      cover: {
        alt: "The cover of the playlist",
      },
      visibility: "public",
    },
  });

  const handleSubmit = async (playlistRegisterForm: PlaylistRegisterData) => {
    const responsePromise = onPlaylistCreation(playlistRegisterForm);
    loadingToast(responsePromise, {
      loading: "Upload de la playlist en cours...",
      success: {
        title: "Playlist enregistrée !",
      },
      error: {
        title: "Échec de l'envoi",
        description: "Vérifiez votre connexion internet.",
      },
    });
    await responsePromise;
    logger.info("reload");
    reload();
    form.reset();
    onSubmit?.();
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
        const session = response.data;
        setSession(session);
        reload();
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
        const session = response.data;
        setSession(session);
        reload();
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
