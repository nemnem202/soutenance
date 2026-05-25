import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger";

const filePath = path.join(process.cwd(), "all_grooves.txt");

try {
  const content = fs.readFileSync(filePath, "utf-8");

  const grooves = content.split("\n").filter((line) => line.trim() !== "");

  fs.writeFileSync("config/grooves.json", JSON.stringify(grooves), { encoding: "utf-8" });
} catch (error) {
  logger.error("Impossible de lire le fichier de grooves", error);
}
