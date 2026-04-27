import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger";

// On récupère le chemin absolu du fichier
const filePath = path.join(process.cwd(), "all_grooves.txt");

try {
  // Lecture du contenu
  const content = fs.readFileSync(filePath, "utf-8");

  // Transformation en tableau (un item par ligne, on retire les vides)
  const grooves = content.split("\n").filter((line) => line.trim() !== "");

  logger.info("Grooves chargés", { count: grooves.length });

  fs.writeFileSync("config/grooves.json", JSON.stringify(grooves), { encoding: "utf-8" });
} catch (error) {
  logger.error("Impossible de lire le fichier de grooves", error);
}
