import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { errorToast, loadingToast } from "@/lib/toaster";
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

  const handleSubmit = async (data: PlaylistRegisterData) => {
    await loadingToast(onPlaylistCreation(data), {
      loading: "Création de la playlist...",
      success: () => ({ title: "Playlist créée !" }),
    });
    reload();
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

  const handleSubmit = async (data: LoginData) => {
    loadingToast(onLogin(data), {
      loading: "Connexion...",
      success: (user) => {
        setSession(user);
        onSuccess();
        reload();
        return { title: `Ravi de vous revoir, ${user.username} !` };
      },
    });
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
    const promise = onRegister(submitted);
    loadingToast(promise, {
      loading: "Création du compte...",
      success: (user) => {
        setSession(user);
        reload();
        onSuccess();
        return { title: `Bienvenue, ${user.username} !` };
      },
    });
    const response = await promise;
    if (!response.success) {
      if (response.status === Status.ExistingEmail || response.status === Status.IncorrectEmail) {
        form.setError("email", { message: response.title });
      } else if (response.status === Status.ExistingUsername) {
        form.setError("username", { message: response.title });
      } else {
        errorToast(response.title, response.description);
      }
    }
    setSubmitLoading(true);
  };

  return { formRef, form, handleSubmit, submitLoading };
}
