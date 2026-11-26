/**
 * Schémas Zod des singletons Header et Footer, jumeaux de headerSingleton et
 * footerSingleton (./keystatic). Un champ ajouté d'un côté s'ajoute ici aussi.
 * Tout est nullable : un contenu incomplet saisi dans Keystatic doit rendre.
 *
 *   import { headerDataSchema, footerDataSchema } from "@hien/design-tokens/content";
 *   defineCollection({ loader: glob(...), schema: ({ image }) => headerDataSchema(image) })
 *   defineCollection({ loader: glob(...), schema: () => footerDataSchema() })
 */
import { z } from "astro/zod";

type ImageHelper = () => z.ZodTypeAny;

export const headerDataSchema = (image: ImageHelper) =>
  z.object({
    logo: image().nullable().optional(),
    logoAlt: z.string().nullable().optional(),
    tagline: z.string().nullable().optional(),
  });

export const footerDataSchema = () =>
  z.object({
    availabilityLabel: z.string().nullable().optional(),
    isAvailable: z.boolean().nullable().optional(),
    heading: z.string().nullable().optional(),
    ctaLabel: z.string().nullable().optional(),
    ctaEmail: z.string().nullable().optional(),
    credit: z.string().nullable().optional(),
    navLinks: z
      .array(
        z.object({
          label: z.string().nullable().optional(),
          href: z.string().nullable().optional(),
        }),
      )
      .nullable()
      .optional(),
  });
