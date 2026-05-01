import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "Music Sandbox",
  description: "A musical training app made for both beginner and advanced players.",
  reactStrictMode: false,
  extends: [vikeReact, vikePhoton],

  // https://vike.dev/vike-photon
  photon: {
    server: "../server/entry.ts",
  },

  headHtmlBegin: `
  <script>
    (function() {
      try {
        const savedTheme = localStorage.getItem('colortheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } catch(e) {
        document.documentElement.classList.remove('dark');
      }
    })();
  </script>
  `,
} satisfies Config;
