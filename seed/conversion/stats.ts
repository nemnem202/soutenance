import { IrealChartDecoder } from "./chart_decoder";
import links from "../links.json";
import StatsCollector from "./statsCollector";

const stats = new StatsCollector(links as string[]);
const allLinks = links as string[];
stats.totalLinks = allLinks.length;

allLinks.forEach((link, index) => {
  try {
    const decoder = new IrealChartDecoder(link);
    if (decoder.songs.length === 0) throw new Error("No songs found in link");

    stats.successCount++;
    stats.totalSongs += decoder.songs.length;

    const isDefaultTitle = decoder.title === IrealChartDecoder.default_title;

    if (isDefaultTitle) {
      stats.defaultTitleCount++;
      if (decoder.songs.length === 1) {
        stats.defaultTitleSingleSongCount++;
      }
    }

    stats.registerIndex(index, isDefaultTitle);

    decoder.songs.forEach((song) => {
      stats.registerSongTitle(song.title);
      stats.incrementStyle(song.style);
      stats.incrementComposer(song.composer);
      stats.incrementKey(song.key);
      stats.registerAnnotsBarsmodifier(song, link);
      stats.registerSongAndCheckDuplicate(song, index);
      const chordCount = song.cells.filter((c) => c.chord !== null).length;
      stats.totalChords += chordCount;
    });

    console.info(
      `[OK] Index ${index.toString().padStart(3, "0")} | ` +
        `${decoder.title.padEnd(25)} | ` +
        `${decoder.songs.length} chansons`
    );
  } catch (err) {
    stats.errorCount++;
    console.error(`[ERR] Index ${index} : ${(err as Error).message}`);
  }
});

stats.logFinalReport();
