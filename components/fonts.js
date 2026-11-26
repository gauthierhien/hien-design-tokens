import { fontProviders } from "astro/config";

/**
 * Geist et Geist Mono pour l'API Fonts d'Astro (`fonts` dans astro.config).
 * Les fichiers viennent de @fontsource-variable/* installés dans le site
 * (sous-ensemble latin, variable 100 à 900). Astro les sert depuis le site,
 * les précharge via <Fonts /> et génère une police de secours aux mêmes
 * métriques (Arial / Courier New ajustées) : plus de saut au chargement.
 */
const variant = (file) => ({
  src: [file],
  weight: "100 900",
  style: "normal",
});

export const geistFonts = () => [
  {
    provider: fontProviders.local(),
    name: "Geist Variable",
    cssVariable: "--font-geist",
    fallbacks: ["sans-serif"],
    options: {
      variants: [
        variant("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"),
      ],
    },
  },
  {
    provider: fontProviders.local(),
    name: "Geist Mono Variable",
    cssVariable: "--font-geist-mono",
    fallbacks: ["monospace"],
    options: {
      variants: [
        variant(
          "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
        ),
      ],
    },
  },
];
