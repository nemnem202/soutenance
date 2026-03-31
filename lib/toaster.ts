import { toast } from "sonner";

export const errorToast = (title: string, description?: string) =>
  toast.error(title, {
    description,
    richColors: true,
    position: "top-center",
  });

export const successToast = (title: string, description?: string) =>
  toast.success(title, {
    description,
    richColors: true,
    position: "top-center",
  });
