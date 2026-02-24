import { loginSchema, projectSchema } from "@/schemas/frontend";
import { Project } from "@/types/project";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData } from "@/types/session";

export function useNewProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema) as Resolver<Project>,
    defaultValues: {
      image: {
        alt: "The cover of the project",
      },
    },
  });

  const handleSubmit = (form: Project) => {
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
