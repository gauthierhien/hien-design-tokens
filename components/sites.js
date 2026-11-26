// Les sites de la galaxie hien.design. Chaque dépôt n'en sert qu'un :
// les liens vers les autres pointent sur leur domaine de production.

/** @typedef {"home" | "feed" | "apps" | "cv"} SiteKey */

export const SITES = /** @type {const} */ ({
  home: "https://hien.design",
  feed: "https://feed.hien.design",
  apps: "https://apps.hien.design",
  cv: "https://cv.hien.design",
});

/** @type {{ label: string; site: SiteKey }[]} */
export const siteNav = [
  { label: "Portfolio", site: "home" },
  { label: "Playground", site: "feed" },
  { label: "Indie Apps", site: "apps" },
  { label: "CV", site: "cv" },
];

/**
 * @param {SiteKey} site
 * @param {SiteKey} [current]
 */
export const siteHref = (site, current) =>
  site === current ? "/" : SITES[site];
