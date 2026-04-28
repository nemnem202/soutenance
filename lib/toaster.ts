import { type ExternalToast, toast } from "sonner";
import type { ServerResponse } from "@/types/server-response";

const TOAST_CONFIG: ExternalToast = {
  richColors: true,
  position: "top-center",
};

export const errorToast = (title: string, description?: string) =>
  toast.error(title, { ...TOAST_CONFIG, description });

export const successToast = (title: string, description?: string) =>
  toast.success(title, { ...TOAST_CONFIG, description });

interface LoadingToastOptions<T> {
  loading?: string;
  success?: (data: T) => { title: string; description?: string };
  error?: (err: any) => { title: string; description?: string };
}

export const loadingToast = <T>(
  promise: Promise<ServerResponse<T>>,
  options: LoadingToastOptions<T> = {}
) => {
  const handledPromise = promise.then((res) => {
    if (!res.success) throw res;
    return res.data;
  });

  return toast.promise(handledPromise, {
    ...TOAST_CONFIG,
    loading: options.loading ?? "Traitement en cours...",
    success: (data) => {
      const info = options.success?.(data);
      return info?.title ?? "Action réussie";
    },
    error: (err: any) => {
      const info = options.error?.(err);
      return info?.title ?? err.title ?? "Une erreur est survenue";
    },
    description: (data: any) => {
      if (typeof options.success === "function") return options.success(data).description;
      if (data && data.description) return data.description;
      return undefined;
    },
  });
};
