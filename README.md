# hien-design-tokens (`@hien/design-tokens`)

Brand design tokens for [Gauthier Hien](https://github.com/gauthierhien) projects. Shared visual source of truth for the hien.design sites: runtime tokens for Tailwind v4, plus the shared Astro Header and Footer. No build step.

## Install

Via Git tag (recommended until npm publish):

```bash
pnpm add github:gauthierhien/hien-design-tokens#v1.3.0
```

## Usage (Tailwind v4)

```css
@import "@hien/design-tokens/theme.css";
@import "tailwindcss";
```

Load **Geist** and **Geist Mono** in the consuming app (e.g. `@fontsource-variable/geist` + mono). Fonts are not bundled here.

Then use token-backed utilities: `bg-background`, `text-foreground`, `text-accent`, `border-border`, `bg-status`, `font-sans`, `font-mono`, plus the type scale (`text-h1` … `text-h4`, `text-body`, `text-body-prose`, `text-lead`, `text-label`) and the page grid (`page-grid`, `page-grid-content`, see DESIGN.md > Layout). For local inverted surfaces, wrap with `.theme-dark`.

Dark mode (opt-in) : `<html data-theme="dark">` force le mode sombre, `data-theme="auto"` suit le système. Fond de page noir pur, variante Tailwind `dark:` disponible. Sans attribut, le site reste en clair.

## Composants partagés (Astro)

Le squelette vit ici, le contenu vit dans le Keystatic de chaque site.

```ts
// keystatic.config.ts
import { footerSingleton, headerSingleton } from "@hien/design-tokens/keystatic";
// singletons: { header: headerSingleton, footer: footerSingleton, ... }
```

```astro
---
import { getEntry } from "astro:content";
import Header from "@hien/design-tokens/Header.astro";
import Footer from "@hien/design-tokens/Footer.astro";
const header = await getEntry("header-data", "index");
const footer = await getEntry("footer-data", "index");
---
<Header currentSite="playground" tagline={header?.data?.tagline} />
<Footer currentSite="playground" {...footer?.data} />
```

- `currentSite` (`home`, `playground`, `apps`, `cv`) : le logo et la navigation entre sites pointent en relatif vers le site courant, en absolu vers les autres (`@hien/design-tokens/sites`).
- Header : `tagline`, `logo` (image du CMS) ou `logoSrc` (défaut `/gauthier-hien-logo.svg`), `logoAlt`, `logoHref`.
- Footer : `availabilityLabel`, `isAvailable` (décoché : ligne masquée), `heading` (un « ? » coupe le titre, la suite passe en gris), `ctaLabel`, `ctaEmail` ou `ctaHref`, `navLinks`, `credit`. Options de structure : `showSiteNav` (navigation Portfolio, Playground, Indie Apps, CV ; les `navLinks` du CMS, LinkedIn et Mail par défaut, forment un second groupe en dessous, sans doublon vers l'accueil d'un site), `homeLink` (lien Home en tête des liens du CMS), `externalInNewTab`, `showTime` (heure de Paris), `meshFixed` (fond fixé au viewport). Slot `background` : remplace le mesh par un autre calque, sur le même fond noir. Les liens relatifs vers la page courante sont masqués.
- Peer dependencies côté site : `astro`, `@keystatic/core`, `@lucide/astro`, `@paper-design/shaders`, `swiper` (pour le Carousel).

Autres composants (v1.4.0) :

| Import | Rôle | Props principales |
| --- | --- | --- |
| `Button.astro` | Bouton pilule pleine largeur, pastille flèche | `href`, `label`, `hoverLabel`, `variant` (`outline`, `overlay`, `compact`), `icon` (`arrow`, `plus`), `size` (`md`, `lg`), `target`, `meshTrigger` |
| `Tag.astro` | Badge mono en capitales | slot, `class` (défaut `mb-4`) |
| `ImageWide.astro` | Image large (carrée sur mobile, 16:9 dès md), légende et lien optionnels, ou Lightbox | `image`, `alt`, `caption`, `href`, `target`, `fit` (`contain`, `cover`), `padding`, `responsive`, `lightbox` |
| `ImageSquare.astro` | Image carrée, légende et lien optionnels, ou Lightbox | mêmes props qu'ImageWide |
| `SectionHeader.astro` | En-tête de section : badge, titre, texte (tous optionnels), lien « Learn more » vers une page détail, slot `aside` | `tag`, `heading`, `body`, `link` (`href`, `label`, `ariaLabel`, `target`), `bleed` |
| `SectionImageWide.astro` | Section image large + en-tête dessus ou dessous (Module A) | `image`, `fit`, `caption`, `href`, `tag`, `heading`, `body`, `link`, `headerPosition` |
| `SectionImageGrid.astro` | Section grille d'images (1 image : large ; sinon carrés), visionneuse, pilule « + » (Modules B et D, médias du playground) | `items` (images ou `{ image, caption, href }`), `columns`, `lightbox`, `cta`, `tag`, `heading`, `body`, `link` |
| `Lightbox.astro` | Visionneuse plein écran | `id`, `images` |
| `Thumbnail.astro` | Vignette d'image sur fond muted (brique de base) | `image`, `alt`, `aspect` (`square`, `video`, `wide`), `padding` (`15%`, `3rem`, `none`), `href` |
| `Carousel.astro` | Section carrousel Swiper : SectionHeader + flèches, slides en ImageWide | `items` (`image`, `title`, `link`), `tag`, `heading`, `body`, `link` |
| `LoopVideo.astro` | MP4 muet en boucle à la place d'une image (poster = l'image), chargé à l'approche du viewport, en pause hors écran, sans autoplay avec `prefers-reduced-motion` (poster + contrôles) | `src`, `poster`, `label`, `eager`, `class` |
| `MeshBackground.astro` | Fond animé (shader mesh, grain), sombre ou clair, effet arc-en-ciel ou halo (`spotlight` : mêmes couleurs, révélées autour du pointeur, sans déclencheur) | `tone` (`dark`, `light`), `effect` (`rainbow`, `spotlight`), `pose` (0 à 2), `fixed`, `blackGrain` ; parent `[data-mesh-root]`, déclencheurs `[data-mesh-trigger]` (la racine peut l'être elle-même) |

### Vidéos en boucle (v1.9.0)

`Thumbnail`, `ImageWide`, `ImageSquare`, `SectionImageWide`, `SectionImageGrid` (items), `Carousel` (items) et `Lightbox` (images) acceptent une prop `video` optionnelle : le chemin public d'un MP4. Il remplace l'image, qui devient son poster, dans le même cadre (fit, padding, ratio). Sans `video`, rien ne change. Même comportement que sur apps.hien.design.

```ts
// keystatic.config.ts : MP4 rangé dans public/videos/<folder>
import { loopVideoField } from "@hien/design-tokens/keystatic";
video: loopVideoField("Video (MP4)", { folder: "projects" }),

// src/content.config.ts
video: z.string().nullable().optional(),

// astro.config.ts : compression en dev, build refusé au-delà de 8 Mo
import videos from "@hien/design-tokens/videos";
integrations: [/* ... */, videos()],
```

Côté site : `pnpm add -D ffmpeg-static`, `ffmpeg-static: true` dans `allowBuilds` (`pnpm-workspace.yaml`), et le script `"videos": "node node_modules/@hien/design-tokens/components/videos.js"` pour tout recompresser à la main. Chaque MP4 est réencodé une fois (H.264, sans son, 1920 px max, faststart).

### Socle partagé (v1.12.0)

```css
/* src/styles/global.css */
@import "@hien/design-tokens/theme.css";
@import "tailwindcss";
@plugin "@tailwindcss/typography";          /* si prose.css */
@import "@hien/design-tokens/base.css";    /* h1 à h4, p, li, strong, span mono, ::selection */
@import "@hien/design-tokens/prose.css";   /* prose-custom (corps MDX) */
```

```ts
// src/content.config.ts : jumeaux Zod des singletons Header et Footer
import { headerDataSchema, footerDataSchema } from "@hien/design-tokens/content";
const headerData = defineCollection({ loader: glob({ pattern: "index.yaml", base: "./src/content/header-data" }), schema: ({ image }) => headerDataSchema(image) });
const footerData = defineCollection({ loader: glob({ pattern: "index.yaml", base: "./src/content/footer-data" }), schema: () => footerDataSchema() });
```

```astro
<!-- Layout.astro : contenu au-dessus, footer révélé derrière, sans script -->
<body class="min-h-screen flex flex-col">
  <PageShell>
    <Header slot="header" />
    <slot />
    <Footer slot="footer" />
  </PageShell>
</body>

<!-- 404.astro : même contenu partout -->
<Layout title="Page not found · Gauthier Hien"><NotFound /></Layout>
```

- Utilities (`theme.css`) : rythme des sections `section-pt`, `section-pb`, `section-py`, `section-mt`, `section-gap` (24 / 48 / 56 / 64 / 72) ; `page-title` ; apparition `motion-fade-up`, `motion-fade-in`, `motion-stagger`, `motion-delay-1`, `motion-delay-2` (rien avec `prefers-reduced-motion`).
- Tokens de mouvement : `--ease-out-expo` (classe `ease-out-expo`), `--duration-hover`, `--duration-enter`, `--duration-enter-slow`, `--duration-enter-item`, `--distance-enter`.
- `@hien/design-tokens/breakpoints` : `BREAKPOINTS`, `mediaUp("md")` pour les scripts.
- `PageShell.astro` : slots `header`, défaut, `footer`, `background`. Ids `#content-wrapper`, `#footer-track`, `#footer-container` ; `--footer-track-overlap` réglable.
- `NotFound.astro` : `title`, `body`, `ctaLabel`, `ctaHref`.
- `CarouselArrows.astro` (`name` → classes `name-prev` / `name-next`) et `SectionText.astro` (paragraphe + « Learn more ») pour les carrousels propres à un site.

Le Footer utilise `MeshBackground` et `Button` ; `meshFixed` fixe son fond au viewport (apps.hien.design).
- `theme.css` déclare `@source "./components"` : Tailwind génère les classes des composants sans config.

## Vitrine

`showcase/` est un site Astro statique en anglais (US) (https://tokens.hien.design, non référencé), organisé comme une doc : navigation à gauche (Foundations : colors, typography, grid, animated background ; Components : Header and Footer, buttons, badges, images, sections, carousel), une page par sujet avec exemples et code d’usage, sélecteur System / Light / Dark. Les anciennes adresses en français redirigent vers les nouvelles. Pour ajouter une page : un fichier dans `showcase/src/pages/` et une entrée dans `showcase/src/nav.ts`.

```bash
cd showcase && pnpm install && pnpm dev   # http://localhost:4330
```

## Agents

See [DESIGN.md](./DESIGN.md) for machine-readable tokens and brand rationale ([design.md format](https://github.com/google-labs-code/design.md)).

## Versioning

1. Bump `version` in `package.json`.
2. Commit, push `main`.
3. Tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`
4. Point apps at the new tag: `pnpm add github:gauthierhien/hien-design-tokens#vX.Y.Z`

## Polices (v1.13.0)

Geist et Geist Mono passent par l'API Fonts d'Astro : `fonts: geistFonts()` (`@hien/design-tokens/fonts`) dans `astro.config`, puis `<Fonts />` (`@hien/design-tokens/Fonts.astro`) en haut du `<head>`. Les fichiers restent dans le site (`@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, sous-ensemble latin). Résultat : préchargement, et une police de secours aux mêmes métriques (Arial, Courier New ajustées), donc plus de saut de la police système vers Geist au chargement. `--font-sans` / `--font-mono` pointent sur `--font-geist` / `--font-geist-mono`. N'importe plus `@fontsource-variable/*` en CSS.
