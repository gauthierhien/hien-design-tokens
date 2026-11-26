export type SiteKey = "home" | "playground" | "apps" | "cv";
export const SITES: {
  readonly home: string;
  readonly playground: string;
  readonly apps: string;
  readonly cv: string;
};
export const siteNav: { label: string; site: SiteKey }[];
export function siteHref(site: SiteKey, current?: SiteKey): string;
