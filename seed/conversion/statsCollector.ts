import _ from "lodash";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import type { SongIreal } from "./chart_decoder";

interface ModifierEntry {
  count: number;
  firstLink: string;
}

export default class StatsCollector {
  private readonly top_count = 20;

  totalLinks = 0;
  successCount = 0;
  errorCount = 0;
  totalSongs = 0;
  totalChords = 0;
  defaultTitleCount = 0;
  defaultTitleSingleSongCount = 0;
  totalSongsWithInvalidModifier = 0;

  styles: Record<string, number> = {};
  composers: Record<string, number> = {};
  keys: Record<string, number> = {};
  songTitles: Record<string, number> = {};

  private songsByTitle = new Map<string, { song: SongIreal; index: number }[]>();

  totalAbsoluteSongDuplicates = 0;

  private defaultTitleIndexes: number[] = [];
  private customTitleIndexes: number[] = [];

  private annotStats: Record<string, number> = {};
  private barStats: Record<string, number> = {};

  private modifiertats = new Map<string, ModifierEntry>();

  constructor(private links: string[]) {}

  incrementStyle(style: string) {
    this.styles[style] = (this.styles[style] || 0) + 1;
  }

  incrementComposer(name: string) {
    this.composers[name] = (this.composers[name] || 0) + 1;
  }

  incrementKey(key: string) {
    this.keys[key] = (this.keys[key] || 0) + 1;
  }

  registerAnnotsBarsmodifier(song: SongIreal, sourceLink: string) {
    let songHasInvalidMod = false;

    song.cells.forEach((cell) => {
      cell.annots.forEach((annot) => {
        this.annotStats[annot] = (this.annotStats[annot] || 0) + 1;
      });

      if (cell.chord) {
        const mod = cell.chord.modifier;

        const existing = this.modifiertats.get(mod);
        if (existing) {
          existing.count++;
        } else {
          this.modifiertats.set(mod, { count: 1, firstLink: sourceLink });
        }

        if (!this.isChordInDictionary(mod)) {
          songHasInvalidMod = true;
        }
      }
      const barKey = cell.bars || "vide";
      this.barStats[barKey] = (this.barStats[barKey] || 0) + 1;
    });

    if (songHasInvalidMod) {
      this.totalSongsWithInvalidModifier++;
    }
  }

  registerSongTitle(title: string) {
    this.songTitles[title] = (this.songTitles[title] || 0) + 1;
  }

  registerIndex(index: number, isDefault: boolean) {
    if (isDefault) {
      this.defaultTitleIndexes.push(index);
    } else {
      this.customTitleIndexes.push(index);
    }
  }

  registerSongAndCheckDuplicate(song: SongIreal, currentIndex: number) {
    const title = song.title;

    if (!this.songsByTitle.has(title)) {
      this.songsByTitle.set(title, [{ song, index: currentIndex }]);
      return false;
    }

    const existingVersions = this.songsByTitle.get(title)!;

    const absoluteDuplicate = existingVersions.find((v) => _.isEqual(v.song, song));

    if (absoluteDuplicate) {
      this.totalAbsoluteSongDuplicates++;
      return true;
    } else {
      existingVersions.push({ song, index: currentIndex });
      return false;
    }
  }

  private normalizeIrealModifier(mod: string): string {
    if (!mod || mod === "") return "M";

    let normalized = mod.replace(/[XyQLZ]/g, "");

    if (normalized === "/") return "M";

    normalized = normalized.replace(/[A-G][b#]?$/, "");

    if (normalized === "") return "M";

    return normalized;
  }
  private isChordInDictionary(mod: string): boolean {
    const norm = this.normalizeIrealModifier(mod);
    if (CHORDS_DICTIONNARY[norm]) return true;
    return Object.values(CHORDS_DICTIONNARY).some((harm) => harm?.labels.includes(norm));
  }

  logFinalReport() {
    const duplicateSongs = Object.entries(this.songTitles).filter(([_, count]) => count > 1);
    const _totalDuplicates = duplicateSongs.reduce((acc, [_, count]) => acc + (count - 1), 0);
    let _uniqueCount = 0;
    this.songsByTitle.forEach((versions) => {
      _uniqueCount += versions.length;
    });

    const modifier = Array.from(this.modifiertats.entries());
    const valid = modifier.filter(([mod]) => this.isChordInDictionary(mod));
    const invalid = modifier.filter(([mod]) => !this.isChordInDictionary(mod));

    console.log(`\n${"=".repeat(50)}`);
    console.log("📊 RAPPORT GLOBAL DE DÉCODAGE");
    console.log("=".repeat(50));

    console.table({
      "Liens traités": this.totalLinks,
      "Succès ✅": this.successCount,
      "Échecs ❌": this.errorCount,
      "Total chansons (toutes)": this.totalSongs,
      "Chansons avec modifieurs INCONNUS ⚠️": this.totalSongsWithInvalidModifier,
      "Impact (% chansons)": `${((this.totalSongsWithInvalidModifier / this.totalSongs) * 100).toFixed(1)}%`,
      "Total accords analysés": this.totalChords,
      "Modifieurs bruts uniques": this.modifiertats.size,
      "Reconnus ✅": valid.length,
      "Inconnus ❌": invalid.length,
      "Couverture modifieurs": `${((valid.length / this.modifiertats.size) * 100).toFixed(1)}%`,
    });

    console.log("\n🎲 ÉCHANTILLONS ALÉATOIRES (Extraits du JSON) :");

    if (duplicateSongs.length > 0) {
      console.log(`\n🔍 TOP 10 DES CHANSONS LES PLUS RÉPÉTÉES :`);
      this.logTop(this.songTitles, 10);
    }

    console.log(`\n🔝 TOP ${this.top_count} STYLES :`);
    this.logTop(this.styles, this.top_count);

    console.log(`\n🔝 TOP ${this.top_count} COMPOSITEURS :`);
    this.logTop(this.composers);

    console.log(`\n🎹 RÉPARTITION DES TONALITÉS :`);
    console.table(this.keys);
    console.log("=".repeat(50));

    if (Object.keys(this.annotStats).length > 0) {
      console.log(`\n🏷️  OCCURRENCES DES ANNOTATIONS :`);
      const sortedAnnots = Object.entries(this.annotStats).sort((a, b) => b[1] - a[1]);

      console.table(
        sortedAnnots.map(([symbol, count]) => ({
          "Symbole/Annotation": symbol,
          Occurrences: count,
        }))
      );
    }

    if (Object.keys(this.barStats).length > 0) {
      console.log(`\n🏷️  OCCURRENCES DES BARS :`);
      const sortedBars = Object.entries(this.barStats).sort((a, b) => b[1] - a[1]);

      console.table(
        sortedBars.map(([symbol, count]) => ({
          "Symbole/Bars": symbol,
          Occurrences: count,
        }))
      );
    }
    if (invalid.length > 0) {
      console.log(`\n❌ TOP 250 DES MODIFIEURS INCONNUS (Triés par occurrences) :`);

      const sortedInvalid = invalid.sort((a, b) => b[1].count - a[1].count).slice(0, 250);

      console.table(
        sortedInvalid.map(([mod, stats]) => ({
          Occurrences: stats.count,
          Brut: mod,
          Normalisé: this.normalizeIrealModifier(mod),
        }))
      );
    }
  }

  private logTop(obj: Record<string, number>, limit: number = this.top_count) {
    const top = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    console.table(top.map(([name, count]) => ({ Nom: name, Occurrences: count })));
  }

  private logRandomFromJSON(indexes: number[], count: number) {
    if (indexes.length === 0) {
      console.log("   (Aucun index disponible)");
      return;
    }
    const shuffled = [...indexes].sort(() => 0.5 - Math.random());
    shuffled.slice(0, count).forEach((linkIndex, i) => {
      console.log(`   ${i + 1}. [Index ${linkIndex}] ${this.links[linkIndex]}`);
    });
  }
}
