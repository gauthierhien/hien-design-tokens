---
version: "alpha"
name: Hien
description: Brand identity for Gauthier Hien — Design Engineer / Product Designer, Paris.
colors:
  background: "oklch(98.5% 0 0)"
  background-muted: "oklch(96% 0 0)"
  foreground: "oklch(20.5% 0 0)"
  foreground-muted: "oklch(70.8% 0 0)"
  accent: "oklch(0.9402 0.205 113.88)"
  accent-hover: "oklch(0.5541 0.1539 40.04)"
  border: "oklch(92.2% 0 0)"
  status: "oklch(0.7227 0.192 149.58)"
  dark-background: "oklch(14.5% 0 0)"
  dark-background-muted: "oklch(20.5% 0 0)"
  dark-foreground: "oklch(97% 0 0)"
  dark-foreground-muted: "oklch(43.9% 0 0)"
  dark-border: "oklch(26.9% 0 0)"
  page-dark-background: "oklch(0% 0 0)"
  page-dark-background-muted: "oklch(14.5% 0 0)"
typography:
  sans:
    fontFamily: Geist Variable
  mono:
    fontFamily: Geist Mono Variable
  h1:
    fontFamily: Geist Variable
    fontSize: 2.25rem
    fontSizeMd: 3rem
    fontSizeLg: 3.75rem
    fontSizeXl: 4.5rem
    fontSize2xl: 6rem
    fontWeight: 500
    letterSpacing: -0.05em
  h2:
    fontFamily: Geist Variable
    fontSize: 1.875rem
    fontSizeMd: 2.25rem
    fontSizeLg: 3rem
    fontSizeXl: 3.75rem
    fontSize2xl: 4.5rem
    fontWeight: 500
    letterSpacing: -0.05em
  h3:
    fontFamily: Geist Variable
    fontSize: 1.25rem
    fontSizeMd: 1.5rem
    fontSizeLg: 1.875rem
    fontSize2xl: 2.25rem
    fontWeight: 500
    letterSpacing: -0.05em
  h4:
    fontFamily: Geist Variable
    fontSize: 1.125rem
    fontSizeMd: 1.25rem
    fontSizeLg: 1.5rem
    fontSizeXl: 1.875rem
    fontSize2xl: 2.25rem
    fontWeight: 400
    letterSpacing: -0.025em
  lead:
    fontFamily: Geist Variable
    fontSize: 1.125rem
    fontSizeMd: 1.25rem
    fontSizeLg: 1.5rem
    fontWeight: 400
  body:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
    letterSpacing: -0.025em
    lineHeight: 1.5rem
  body-prose:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontSizeMd: 1.125rem
    fontSizeLg: 1.25rem
    fontWeight: 400
    letterSpacing: -0.025em
  label:
    fontFamily: Geist Mono Variable
    fontSize: 0.75rem
    fontWeight: 300
  strong:
    fontFamily: Geist Variable
    fontSize: 0.875rem
    fontWeight: 600
rounded:
  full: 9999px
  none: 0px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "{colors.background-muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    borderColorHover: "{colors.foreground}"
    rounded: "{rounded.full}"
  tag:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.label}"
---

## Overview

Minimal, technical, precise — the visual identity of a Paris-based Design Engineer.
Surfaces stay cool and neutral (never warm cream, never purple/indigo gradients).
A vivid lime/chartreuse accent pairs with a terracotta/orange hover. All colors are
expressed exclusively in `oklch`. A full dark mode exists but is opt-in (`data-theme`); sites are light by
default and `.theme-dark` stays a local inverted surface (footer band).

This package ships **runtime tokens** (`theme.css`): colors, font *names*, the
type scale (portfolio breakpoint ladder) and the page grid utilities, plus the **shared Header and
Footer** Astro components of the hien.design sites (`components/`). Their
content comes from each site's Keystatic. Spacing and radii stay in each app and are documented here as guidance.

## Colors

Neutral light surfaces with a high-contrast foreground. The accent is the only
chromatic signal for interactive emphasis; status green is reserved for
availability LEDs. Muted foreground handles captions and secondary copy.

- **background** — Near-white canvas.
- **background-muted** — Subtle alternate surface (secondary buttons, soft bands).
- **foreground** — Primary ink for text and solid CTAs.
- **foreground-muted** — Secondary copy, captions.
- **accent** — Lime/chartreuse for emphasis, selection, interactive highlights.
- **accent-hover** — Terracotta/orange for hover/active on accent moments.
- **border** — Fine hairline separation; prefer borders over shadows.
- **status** — Availability LED / success green (`bg-status`). Same in `.theme-dark`.
- **dark-***: Local inverted surfaces (`.theme-dark`, e.g. the footer band).
- **Dark mode**: opt-in for the whole page: `<html data-theme="dark">`, or
  `data-theme="auto"` to follow the system. Same palette as `.theme-dark`,
  but the page background is pure black (`oklch(0% 0 0)`) and
  `background-muted` is `oklch(14.5% 0 0)`. Tailwind's `dark:` variant follows
  the same attribute. Sites stay light until they set it.

## Typography

Geist Variable for body and headings. Geist Mono Variable for labels, metadata,
tags, and times. Headings use `font-medium` and tight tracking (`tracking-tighter`);
`h4` is `font-normal` + `tracking-tight`.

Shipped as `--text-h1` … `--text-h4`, `--text-body`, `--text-body-prose`,
`--text-lead`, `--text-label`, `--text-strong` (Tailwind utilities `text-h1`, etc.).
Sizes follow the portfolio ladder at `md` / `lg` / `xl` / `2xl` (e.g. `h1` is
2.25rem → 6rem). Use `text-body` on UI copy and `text-body-prose` on article
bodies (steps up at `md`/`lg`). Hero `.display` in apps maps to `text-h1`.

Element selectors (`h1`, `span` = mono label, `@layer base`) live in each app —
consume the tokens there, do not re-declare the rem ladder. Consuming apps must
load fonts themselves (`@fontsource-variable/geist` and the mono package).

## Layout

Utility-first Tailwind, one page grid shared by every site and shipped in
`theme.css`:

- `page-grid`: block below `md`, then 8 equal columns, no gutter. Pages keep
  a 16px side margin (`px-4`).
- `page-grid-content`: columns 2 to 7 (6 of 8) from `md` to `xl`, columns 3
  to 6 (4 of 8) from `2xl` (1536px).
- Modules that need a different span (homepage modules, footer, `xl:`
  heroes) keep inline variants on the same 8 columns (`2xl:col-start-3
  2xl:col-span-4` for the footer CTA, `md:grid-cols-6 2xl:grid-cols-8` for
  carousel headers).

Major sections get generous vertical air. No decorative cards: no
multi-layer shadows, no pill clusters, no glow effects.

## Elevation & Depth

Nearly flat. Separate elements with fine `border` / outline, not drop shadows.
CSS selection: background `accent`, text `foreground`.

## Shapes

CTAs and buttons: `rounded-full`. Editorial content and grids: square corners or
minimal radius. Lucide icons: `stroke-width={1}`, colors via CSS vars
(`foreground` / `background`).

## Components

Header and Footer ship as Astro components (skeleton here, content via props
from each site's Keystatic). The rest is guidance: component CSS lives in each app.

- **Primary button** — `foreground` fill on `background` text; hover via opacity.
- **Secondary button** — `background-muted` fill.
- **Outline button** (large pill CTA: Full resume, Get in touch, Download): transparent fill, `border` hairline at rest; hover or keyboard focus strengthens the border to `foreground`. The opacity never changes. Over an image or a dark surface, text and border use `background`, the border at 40% at rest and 100% on hover. Implemented in plain CSS so it also works on touch-first devices (iPad).
- **Tag** — Mono uppercase; `foreground` on `background`.
- **Header**: tagline (mono, top left) and logo (top right). No navigation.
- **Footer**: `.theme-dark` band on a mesh shader, availability LED line (hidden when unavailable), H2, rounded CTA, credit with Paris time, links between sites.
- **Button / Tag / ImageWide / ImageSquare / Section* / Carousel / Lightbox / MeshBackground**: shared Astro components (see README). Sections compose a SectionHeader (tag, heading, body, all optional, plus an optional underlined "Learn more" link to a detail page right after the body, as on apps.hien.design) with images; images carry an optional caption (mono) and link (↗). The mesh background is the brand's motion signature, in two tones: dark (black, low-opacity light shapes, grain) and light (page background and accent greyed by a saturation veil, grain). Both turn rainbow only while their trigger is hovered or focused. Alternative, in both tones: `effect="spotlight"`, the same resting mesh and the same rainbow, but the rainbow shows only in a halo that follows the pointer (no trigger; off on mobile and with reduced motion).
- **Loop videos**: any image slot (Thumbnail, ImageWide, ImageSquare, sections, carousel, lightbox) can take a short MP4 instead. It plays muted, in a loop, inline, in the same frame as the image, which becomes its poster. Loaded near the viewport, paused off-screen; with reduced motion it doesn't autoplay (poster + controls). Keep clips short (a few seconds, under 8 MB).
- Do not bake page modules (homepage Modules, Skills) into the brand: those stay app patterns.

## Do's and Don'ts

**Do**

- Consume tokens via Tailwind classes (`bg-background`, `text-accent`, `border-border`, `bg-status`, `text-h1`, `text-body`, `font-sans`, `font-mono`).
- Keep `oklch` values; do not convert to hex “for simplicity.”
- Version this package (semver + git tags) and bump the dependency in each app.

**Don't**

- Invent a purple/indigo palette, generic cream + terracotta look, or dense broadsheet layout.
- Turn dark mode on for a site without asking; ship glows, multi-shadows, or UI emojis.
- Put content images, font files, layout utilities, or page-specific component CSS in this package.
- Hardcode duplicate tokens in apps once this package is wired (including LED green as `#22c55e`).
