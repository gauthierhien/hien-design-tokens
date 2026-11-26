// Breakpoints de la galaxie hien.design, alignés sur Tailwind (sm à 2xl),
// pour les scripts (Swiper, matchMedia). Les classes CSS gardent md:, xl:...

export const BREAKPOINTS = /** @type {const} */ ({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
});

/**
 * Media query « à partir de », ex. mediaUp("md") → "(min-width: 768px)".
 * @param {keyof typeof BREAKPOINTS} bp
 */
export const mediaUp = (bp) => `(min-width: ${BREAKPOINTS[bp]}px)`;
