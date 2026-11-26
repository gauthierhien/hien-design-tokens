export type SiteKey = "home" | "feed" | "apps" | "cv";
export const SITES: {
  readonly home: string;
  readonly feed: string;
  readonly apps: string;
  readonly cv: string;
};
export const siteNav: { label: string; site: SiteKey }[];
export function siteHref(site: SiteKey, current?: SiteKey): string;
