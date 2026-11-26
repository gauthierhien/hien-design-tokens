// Singletons Keystatic partagés par les sites de la galaxie hien.design.
// Chaque site les ajoute à son keystatic.config.ts :
//   singletons: { header: headerSingleton, footer: footerSingleton }
// Les fichiers restent dans chaque site (src/content/header-data et footer-data).
import { fields, singleton } from "@keystatic/core";

export const headerSingleton = singleton({
  label: "Header",
  path: "src/content/header-data/index",
  schema: {
    logo: fields.image({
      label: "Logo",
      directory: "src/assets/header",
      publicPath: "../../assets/header/",
    }),
    logoAlt: fields.text({
      label: "Logo Alt Text (for accessibility and SEO)",
    }),
    tagline: fields.text({
      label: "Tagline (replaces the navigation)",
      defaultValue: "Design Engineer",
    }),
  },
});

export const footerSingleton = singleton({
  label: "Footer",
  path: "src/content/footer-data/index",
  schema: {
    availabilityLabel: fields.text({
      label: "Availability Label",
      defaultValue: "Available for freelance work",
    }),
    isAvailable: fields.checkbox({
      label: "Available (green LED; if unchecked, the availability line is hidden)",
      defaultValue: true,
    }),
    heading: fields.text({
      label: "Heading (H2)",
      description: 'A "?" splits it: the rest goes grey on a second line.',
    }),
    ctaLabel: fields.text({ label: "CTA Button Label" }),
    ctaEmail: fields.text({ label: "CTA Button Email" }),
    credit: fields.text({
      label: "Credit line (optional)",
      description: "Defaults to: Designed & built by Gauthier Hien in Paris, France",
    }),
    navLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Link Label" }),
        href: fields.text({ label: "Link URL" }),
      }),
      {
        label: "Navigation Links",
        itemLabel: (props) => props.fields.label.value || "Link",
      },
    ),
  },
});

// Champ MP4 pour une vidéo en boucle (LoopVideo, Thumbnail, sections).
// Servi tel quel depuis public/videos/<folder> (Astro n'optimise pas les
// vidéos) ; l'intégration `@hien/design-tokens/videos` le compresse en dev.
export const loopVideoField = (label = "Video (MP4)", { folder = "media", description } = {}) =>
  fields.file({
    label,
    directory: `public/videos/${folder}`,
    publicPath: `/videos/${folder}/`,
    description:
      description ??
      "Optional. Plays muted, in a loop, instead of the image, which becomes its poster. Compressed automatically; keep it short (a few seconds).",
  });
