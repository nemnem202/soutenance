import { loginSchema, playlistSchema } from "@/schemas/frontend";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData } from "@/types/session";
import { faker } from "@faker-js/faker";
import { PlaylistSchema } from "@/types/project";

export function useNewPlaylistForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PlaylistSchema>({
    resolver: zodResolver(playlistSchema) as Resolver<PlaylistSchema>,
    defaultValues: {
      image: {
        alt: "The cover of the playlist",
      },
      accountId: faker.string.uuid(),
    },
  });

  const handleSubmit = (form: PlaylistSchema) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}

export function useLoginForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginData>,
    defaultValues: {
      remember: true,
    },
  });

  const handleSubmit = (form: LoginData) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}

export function useRegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginData>,
    defaultValues: {
      remember: true,
    },
  });

  const handleSubmit = (form: LoginData) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}
