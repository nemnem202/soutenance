import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faker } from "@faker-js/faker";
import { PlaylistSchema } from "@/types/entities";
import { LoginData, RegisterData } from "@/types/auth";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { playlistSchema } from "@/schemas/entities.schema";

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

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterData>,
    defaultValues: {
      image: {
        alt: "The profile picture of the user",
      },
      agree_terms_of_service: false,
    },
  });

  const handleSubmit = (form: RegisterData) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}
