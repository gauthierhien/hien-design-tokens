import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { geistFonts } from "@hien/design-tokens/fonts";

// Vitrine statique du design system : `pnpm dev` en local, `dist/` sur Vercel.
export default defineConfig({
  fonts: geistFonts(),
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
