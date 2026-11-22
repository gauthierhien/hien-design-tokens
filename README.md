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
<Header currentSite="feed" tagline={header?.data?.tagline} />
<Footer currentSite="feed" {...footer?.data} />
```

- `currentSite` (`home`, `feed`, `cv`) : le logo et la navigation entre sites pointent en relatif vers le site courant, en absolu vers les autres (`@hien/design-tokens/sites`).
- Header : `tagline`, `logo` (image du CMS) ou `logoSrc` (défaut `/gauthier-hien-logo.svg`), `logoAlt`, `logoHref`.
- Footer : `availabilityLabel`, `isAvailable` (décoché : ligne masquée), `heading` (un « ? » coupe le titre, la suite passe en gris), `ctaLabel`, `ctaEmail` ou `ctaHref`, `navLinks`, `credit`. Options de structure : `showSiteNav` (navigation News, Work, About), `homeLink` (lien Home en tête), `externalInNewTab`, `showTime` (heure de Paris), `meshFixed` (fond fixé au viewport). Les liens relatifs vers la page courante sont masqués.
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
| `SectionImageGrid.astro` | Section grille d'images (1 image : large ; sinon carrés), visionneuse, pilule « + » (Modules B et D, médias du feed) | `items` (images ou `{ image, caption, href }`), `columns`, `lightbox`, `cta`, `tag`, `heading`, `body`, `link` |
| `Lightbox.astro` | Visionneuse plein écran | `id`, `images` |
| `Thumbnail.astro` | Vignette d'image sur fond muted (brique de base) | `image`, `alt`, `aspect` (`square`, `video`, `wide`), `padding` (`15%`, `3rem`, `none`), `href` |
| `Carousel.astro` | Section carrousel Swiper : SectionHeader + flèches, slides en ImageWide | `items` (`image`, `title`, `link`), `tag`, `heading`, `body`, `link` |
| `MeshBackground.astro` | Fond animé (shader mesh, grain), sombre ou clair | `tone` (`dark`, `light`), `pose` (0 à 2), `fixed`, `blackGrain` ; parent `[data-mesh-root]`, déclencheurs `[data-mesh-trigger]` (la racine peut l'être elle-même) |

Le Footer utilise `MeshBackground` et `Button` ; `meshFixed` fixe son fond au viewport (apps.hien.design).
- `theme.css` déclare `@source "./components"` : Tailwind génère les classes des composants sans config.

## Vitrine

`showcase/` est un site Astro statique (https://tokens.hien.design, non référencé), organisé comme une doc : navigation à gauche (Fondations : couleurs, typographie, grille, fond animé ; Composants : Header et Footer, boutons, badges, images, sections, carrousel), une page par sujet avec exemples et code d'usage, sélecteur Clair / Sombre / Système. Pour ajouter une page : un fichier dans `showcase/src/pages/` et une entrée dans `showcase/src/nav.ts`.

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
