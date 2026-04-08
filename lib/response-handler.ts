import { type ServerResponse, Status } from "@/types/server-response";
import { AppError } from "./errors";
import { logger } from "./logger";

export async function handleAction<T>(
  actionName: string,
  fn: () => Promise<ServerResponse<T>>
): Promise<ServerResponse<T>> {
  try {
    const result = await fn();
    logger.success(`${actionName} executed successfully`);
    return result;
  } catch (err) {
    if (err instanceof AppError) {
      logger.warn(`${actionName} failed: ${err.title} - ${err.description ?? ""}`);
      return {
        success: false,
        status: err.status,
        title: err.title,
        description: err.description,
      };
    }

    logger.error(`CRITICAL ERROR in ${actionName}:`, err);
    return {
      success: false,
      status: Status.UnknownError,
      title: "Internal Server Error",
      description: "An unexpected error occurred. Please try again later.",
    };
  }
}
