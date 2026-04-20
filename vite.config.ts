import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import telefunc from "telefunc/vite";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vike(), react(), tailwindcss(), telefunc()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["192-168-38-64.nip.io"],
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
    },
  },
});
