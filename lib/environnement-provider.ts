import { logger } from "./logger";

export default class EnvironnementProvider {
  private static _instance: EnvironnementProvider | null = null;

  // Variables d'environnement en lecture seule
  public readonly POSTGRES_USER: string;
  public readonly POSTGRES_PASSWORD: string;
  public readonly POSTGRES_DB: string;
  public readonly DATABASE_URL: string;
  public readonly APP_PORT: number;

  private constructor() {
    const {
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
      DATABASE_URL,
      APP_PORT,
    } = process.env;

    if (
      !POSTGRES_USER ||
      !POSTGRES_PASSWORD ||
      !POSTGRES_DB ||
      !DATABASE_URL ||
      !APP_PORT
    ) {
      if (!POSTGRES_USER)
        logger.error("Missing environment variable: POSTGRES_USER");
      if (!POSTGRES_PASSWORD)
        logger.error("Missing environment variable: POSTGRES_PASSWORD");
      if (!POSTGRES_DB)
        logger.error("Missing environment variable: POSTGRES_DB");
      if (!DATABASE_URL)
        logger.error("Missing environment variable: DATABASE_URL");
      if (!APP_PORT) logger.error("Missing environment variable: APP_PORT");
      throw new Error("Environment variables are not set");
    }

    // Initialisation en lecture seule
    this.POSTGRES_USER = POSTGRES_USER;
    this.POSTGRES_PASSWORD = POSTGRES_PASSWORD;
    this.POSTGRES_DB = POSTGRES_DB;
    this.DATABASE_URL = DATABASE_URL;
    this.APP_PORT = parseInt(APP_PORT, 10);
  }

  // Méthode pour récupérer l'instance singleton
  public static get(): EnvironnementProvider {
    if (!EnvironnementProvider._instance) {
      EnvironnementProvider._instance = new EnvironnementProvider();
    }
    return EnvironnementProvider._instance;
  }
}
