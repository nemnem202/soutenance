export type MMAGrooveFamily =
  | "Jazz"
  | "Rock"
  | "Ballad"
  | "Country"
  | "Hip-hop"
  | "Latin"
  | "Tech"
  | "Fusion"
  | "Afro"
  | "Metal"
  | "Shuffle";

export type MMAGrooveTitle =
  | "JazzBasie"
  | "JazzWaltz"
  | "BossaNova"
  | "Ballad"
  | "Metal"
  | "Shuffle"
  | "Bebop"
  | "8Beat"
  | "16Beat"
  | "50sRock"
  | "Mambo"
  | "Salsa"
  | "Techno"
  | "04JAZZ01"
  | "AFRO01"
  | "FUS01";

export type MMAGrooveName = string;

export type MMAGroove = {
  family: MMAGrooveFamily;
  sections: {
    default: MMAGrooveName | null;
    plus: MMAGrooveName | null;
    A: MMAGrooveName | null;
    B: MMAGrooveName | null;
    C: MMAGrooveName | null;
    D: MMAGrooveName | null;
  };
  fills: {
    default: MMAGrooveName | null;
    A: MMAGrooveName | null;
    B: MMAGrooveName | null;
    C: MMAGrooveName | null;
    D: MMAGrooveName | null;
  };
  intros: {
    default: MMAGrooveName | null;
    A: MMAGrooveName | null;
    B: MMAGrooveName | null;
    C: MMAGrooveName | null;
  };
  endings: {
    default: MMAGrooveName | null;
    A: MMAGrooveName | null;
    B: MMAGrooveName | null;
    C: MMAGrooveName | null;
  };
};
