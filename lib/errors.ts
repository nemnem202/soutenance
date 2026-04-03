import type { Status } from "@/types/server-response";

export class AppError extends Error {
  constructor(
    public readonly status: Status,
    public readonly title: string,
    public readonly description?: string,
    public readonly statusCode: number = 400
  ) {
    super(title);
    this.name = "AppError";
  }
}
