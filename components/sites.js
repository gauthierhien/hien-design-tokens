// Les sites de la galaxie hien.design. Chaque dépôt n'en sert qu'un :
// les liens vers les autres pointent sur leur domaine de production.

/** @typedef {"home" | "playground" | "apps" | "cv"} SiteKey */

export const SITES = /** @type {const} */ ({
  home: "https://hien.design",
  playground: "https://playground.hien.design",
  apps: "https://apps.hien.design",
  cv: "https://cv.hien.design",
});

/** @type {{ label: string; site: SiteKey }[]} */
export const siteNav = [
  { label: "Portfolio", site: "home" },
  { label: "Playground", site: "playground" },
  { label: "Indie Apps", site: "apps" },
  { label: "CV", site: "cv" },
];

/**
 * @param {SiteKey} site
 * @param {SiteKey} [current]
 */
export const siteHref = (site, current) =>
  site === current ? "/" : SITES[site];
