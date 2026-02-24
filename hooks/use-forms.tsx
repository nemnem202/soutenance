import { projectSchema } from "@/schemas/frontend";
import { Project } from "@/types/frontend/project";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useNewProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema) as Resolver<Project>,
    defaultValues: {
      config: {
        defaultBpm: 120,
        activeTracks: {
          piano: true,
          guitar: true,
          bass: true,
          drums: true,
        },
      },
    },
  });

  const handleSubmit = (form: Project) => {
    console.log(form);
  };

  return { formRef, form, handleSubmit };
}
