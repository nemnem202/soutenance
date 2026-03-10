import { LanguagePack } from "@/types/i18n";

export const availableLanguages = ["french", "english", "spanish", "german", "chinese_simplified"] as const;

const pagesLP: LanguagePack<typeof availableLanguages> = {
  homepageDefaultTitle: {
    french: "Bienvenue sur MusicSandbox !",
  },
  homepageSessionTitle: {
    french: "Bon retour parmi nous",
  },
  explorePageTitle: {
    french: "Explorer",
  },
  favoritesPageTitle: {
    french: "Favoris",
  },
  dashboardPageTitle: {
    french: "Vos playlists",
  },
};

const sectionsLP: LanguagePack<typeof availableLanguages> = {
  recentlyPlayed: {
    french: "Joués récemment",
  },
  moreOfThem: {
    french: "Vous les avez aimé",
  },
  popularExercices: {
    french: "Exercices populaires",
  },
  discover: {
    french: "Découvrir",
  },
  accounts: {
    french: "Utilisateurs",
  },
  playlists: {
    french: "Playlists",
  },
  general: {
    french: "Général",
  },
  backing_track: {
    french: "Accompagnement",
  },
  appearance: {
    french: "Apparence",
  },
  midi: {
    french: "Midi",
  },
};

const componentsLP: LanguagePack<typeof availableLanguages> = {
  seeAll: {
    french: "voir tout",
  },
  profile: {
    french: "Profil",
  },
  settings: {
    french: "Paramètres",
  },
  theme: {
    french: "Thème",
  },
  language: {
    french: "Langage",
  },
  log_out: {
    french: "Déconnexion",
  },
  overview: {
    french: "Aperçu",
  },
  liked: {
    french: "Aimés",
  },
  playlists: {
    french: "Playlists",
  },
  users: {
    french: "Utilisateurs",
  },
  user: {
    french: "Utilisateur",
  },
  bpm: {
    french: "Bpm",
  },
  pop: {
    french: "Pop", // popularité
  },
  all: {
    french: "Tous",
  },
  browse_exercices: {
    french: "Parcourir les exercices",
  },
  search_in_playlist: {
    french: "Chercher dans la playlist",
  },
};

const gameLP: LanguagePack<typeof availableLanguages> = {
  piano_roll: {
    french: "piano",
  },
  chords: {
    french: "accords",
  },
  sheet: {
    french: "partition",
  },
  guitar: {
    french: "guitare",
  },
  save_settings: {
    french: "Enregistrer les paramètres",
  },
  default: {
    french: "Défaut",
  },
  presets: {
    french: "préréglages",
  },
  count_before_play: {
    french: "Décompte",
  },
  transpose: {
    french: "Transposition",
  },
  practice: {
    french: "Pratique",
  },
  repeats: {
    french: "Répétitions",
  },
  bpm_practice: {
    french: "Pratique bpm",
  },
  active: {
    french: "Actif",
  },
  melody: {
    french: "Mélodie",
  },
  piano: {
    french: "Piano",
  },
  bass: {
    french: "Basse",
  },
  drums: {
    french: "Batterie",
  },
  style: {
    french: "Style",
  },
  show_chords: {
    french: "Afficher les accords",
  },
  highlight_current_measure: {
    french: "Souligner la mesure actuelle",
  },
  chords_diagrams: {
    french: "Diagrammes d'accords",
  },
  midi_inputs: {
    french: "Entrées midi",
  },
  sound_preset: {
    french: "Préréglage de sortie",
  },
  highlight_wrong_notes: {
    french: "Souligner les erreurs",
  },
  highlight_correct_notes: {
    french: "Souligner les réussites",
  },
  highlight_missed_notes: {
    french: "Souligner les manquements",
  },
};

export const languagePack: LanguagePack<typeof availableLanguages> = {
  ...pagesLP,
  ...sectionsLP,
  ...componentsLP,
  ...gameLP,
} as const;
