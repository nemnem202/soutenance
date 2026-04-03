import { type ExternalToast, toast } from "sonner";

const TOAST_CONFIG: ExternalToast = {
  richColors: true,
  position: "top-center",
};
export const errorToast = (title: string, description?: string) =>
  toast.error(title, { ...TOAST_CONFIG, description });

export const successToast = (title: string, description?: string) =>
  toast.success(title, { ...TOAST_CONFIG, description });

interface BaseResponse {
  success: boolean;
  title?: string;
  description?: string;
}

interface LoadingToastOptions<T> {
  loading?: string;
  success?: {
    title?: string | ((data: T) => string);
    description?: string | ((data: T) => string);
  };
  error?: {
    title?: string | ((err: any) => string);
    description?: string | ((err: any) => string);
  };
}

export const loadingToast = <T extends BaseResponse>(
  promise: Promise<T>,
  options: LoadingToastOptions<T> = {}
) => {
  const interceptedPromise = promise.then((data) => {
    if (!data.success) {
      throw data;
    }
    return data;
  });

  return toast.promise(interceptedPromise, {
    ...TOAST_CONFIG,
    loading: options.loading ?? "Chargement...",

    success: (data) => {
      return (
        (typeof options.success?.title === "function"
          ? options.success.title(data)
          : options.success?.title) ??
        data.title ??
        "Succès"
      );
    },

    error: (data) => {
      if (data && typeof data === "object" && "success" in data) {
        return (
          (typeof options.error?.title === "function"
            ? options.error.title(data)
            : options.error?.title) ??
          data.title ??
          "Erreur"
        );
      }

      return (
        (typeof options.error?.title === "function"
          ? options.error.title(data)
          : options.error?.title) ?? "Erreur système"
      );
    },

    description: (data: any) => {
      if (data && data.success === true) {
        return (
          (typeof options.success?.description === "function"
            ? options.success.description(data)
            : options.success?.description) ?? data.description
        );
      }

      return (
        (typeof options.error?.description === "function"
          ? options.error.description(data)
          : options.error?.description) ??
        (data.description || data.message)
      );
    },
  });
};
