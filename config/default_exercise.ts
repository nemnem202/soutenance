import { Exercise } from "@/types/entities";

const DEFAULT_EXERCISE: Exercise = {
  id: 0,
  title: "new exercise",
  author: null,
  composer: "Unknown composer",

  defaultConfig: {
    bpm: 120,
    groove: "BossaNova",
    key: "C",
    timeSignatureBottom: 4,
    timeSignatureTop: 4,
  },
};

export default DEFAULT_EXERCISE;
