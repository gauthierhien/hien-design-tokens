import {
  ShaderFitOptions,
  ShaderMount,
  meshGradientFragmentShader,
  type PaperShaderElement,
} from "@paper-design/shaders";

type Rgba = [number, number, number, number];

const SPEED = 0.45;
const FADE_MS = 1100;
const DESKTOP = "(min-width: 768px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const STATE_KEY = "__hienMesh";

const BLACK: Rgba = [0, 0, 0, 1];
const WHITE: Rgba = [1, 1, 1, 1];

type MeshState = {
  abort: AbortController;
  onChange: () => void;
  desktop: MediaQueryList;
  reduced: MediaQueryList;
  cancelFade: () => void;
};

function cssColor(value: string): Rgba {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return WHITE;
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, a / 255];
}

function mixColor(a: Rgba, b: Rgba, t: number): Rgba {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    1,
  ];
}

type Tone = "dark" | "light";

function readToken(name: string): Rgba {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw ? cssColor(raw) : WHITE;
}

// Clair : fond de page et formes grises, sans accent, pour qu'aucun jaune
// n'apparaisse pendant la transition vers l'arc-en-ciel.
function lightRest(background = readToken("--background")): Rgba[] {
  const shape = cssColor("oklch(0.86 0 0)");
  return [
    background,
    background,
    mixColor(background, shape, 0.35),
    shape,
    background,
    mixColor(background, shape, 0.62),
    background,
  ];
}

function lightRainbow(background = readToken("--background")): Rgba[] {
  const hue = (h: number) => cssColor(`oklch(0.84 0.14 ${h})`);
  // Pas de teinte entre 80 et 130 : elle tire au jaune en clair.
  return [background, background, hue(28), hue(155), background, hue(230), hue(320)];
}

// Trois départs décalés, pour que des cartes voisines ne pulsent pas ensemble.
const POSES = [
  { frame: 900, distortion: 0.62, swirl: 0.18, grainMixer: 0.42, offsetX: -0.06, offsetY: 0.04 },
  { frame: 4800, distortion: 0.4, swirl: 0.28, grainMixer: 0.5, offsetX: 0.08, offsetY: -0.05 },
  { frame: 9200, distortion: 0.28, swirl: 0.1, grainMixer: 0.34, offsetX: 0.02, offsetY: 0.1 },
] as const;

function restColors(): Rgba[] {
  return [
    BLACK,
    BLACK,
    mixColor(BLACK, WHITE, 0.35),
    WHITE,
    BLACK,
    mixColor(BLACK, WHITE, 0.62),
    BLACK,
  ];
}

function rainbowColors(): Rgba[] {
  const hue = (h: number) => cssColor(`oklch(0.62 0.18 ${h})`);
  return [BLACK, hue(28), BLACK, hue(125), BLACK, hue(210), hue(320)];
}

// Rayon du halo, proportionnel au bloc.
function spotRadius(host: HTMLElement) {
  return Math.max(360, 0.9 * Math.min(host.offsetWidth, host.offsetHeight));
}

// Position du pointeur dans le calque, même si la racine est inclinée (cartes).
function spotPoint(host: HTMLElement, root: HTMLElement | null, event: PointerEvent) {
  const rect = host.getBoundingClientRect();
  const matrix = new DOMMatrix(root ? getComputedStyle(root).transform : "none");
  matrix.e = 0;
  matrix.f = 0;
  const local = matrix
    .inverse()
    .transformPoint(
      new DOMPoint(
        event.clientX - rect.left - rect.width / 2,
        event.clientY - rect.top - rect.height / 2,
      ),
    );
  return { x: local.x + host.offsetWidth / 2, y: local.y + host.offsetHeight / 2 };
}

const REVEAL_FADE_MS = 500;

// reveal : calque arc-en-ciel découpé par le halo. rest : calque de repos, du
// même shader. Hors survol le calque révélé est arrêté ; à l'entrée il reprend
// l'instant du repos, pour que les formes coïncident.
function bindSpotlight(
  host: HTMLElement,
  root: HTMLElement | null,
  target: HTMLElement,
  reveal: ShaderMount,
  signal: AbortSignal,
) {
  const mask = host.closest<HTMLElement>(".mesh-reveal");
  const rest = mask?.parentElement?.querySelector<PaperShaderElement>(
    ":scope > .mesh-layer",
  );
  if (!mask) return;
  let stopTimer = 0;
  let on = false;

  const off = () => {
    if (!on) return;
    on = false;
    mask.classList.remove("is-spot");
    stopTimer = window.setTimeout(() => reveal.setSpeed(0), REVEAL_FADE_MS);
  };
  const move = (event: PointerEvent) => {
    const speed = desiredSpeed();
    if (speed === 0) return off();
    const { x, y } = spotPoint(host, root, event);
    mask.style.setProperty("--spot-x", `${x}px`);
    mask.style.setProperty("--spot-y", `${y}px`);
    if (on && mask.classList.contains("is-spot")) return;
    on = true;
    window.clearTimeout(stopTimer);
    mask.style.setProperty("--spot-r", `${spotRadius(host)}px`);
    const frame = rest?.paperShaderMount?.getCurrentFrame();
    if (frame !== undefined) reveal.setFrame(frame);
    reveal.setSpeed(speed);
    mask.classList.add("is-spot");
  };
  const opts = { signal, passive: true };
  target.addEventListener("pointermove", move, opts);
  target.addEventListener("pointerdown", move, opts);
  target.addEventListener("pointerleave", off, opts);
  target.addEventListener("pointercancel", off, opts);
  signal.addEventListener("abort", () => {
    off();
    window.clearTimeout(stopTimer);
  });
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function desiredSpeed() {
  if (window.matchMedia(REDUCED).matches) return 0;
  if (!window.matchMedia(DESKTOP).matches) return 0;
  return SPEED;
}

/** Monte (ou remonte) chaque calque .mesh-layer de la page. */
export function mountMesh() {
  document.querySelectorAll<HTMLElement>(".mesh-layer").forEach(mountOne);
}

function mountOne(host: HTMLElement) {
  const holder = host as HTMLElement & { [STATE_KEY]?: MeshState };
  const prev = holder[STATE_KEY];
  if (prev) {
    prev.cancelFade();
    prev.abort.abort();
    prev.desktop.removeEventListener("change", prev.onChange);
    prev.reduced.removeEventListener("change", prev.onChange);
  }

  (host as PaperShaderElement).paperShaderMount?.dispose();

  const bg = host.closest<HTMLElement>(".mesh-bg");
  const tone: Tone = bg?.dataset.tone === "light" ? "light" : "dark";
  const spotlight = bg?.dataset.effect === "spotlight";
  const pose = POSES[Number(bg?.dataset.pose ?? 0) % POSES.length] ?? POSES[0];
  const reveal = host.closest(".mesh-reveal") !== null;
  // Le halo clair reste clair, quel que soit le thème de la page.
  const paper = spotlight ? cssColor("oklch(98.5% 0 0)") : undefined;
  const rainbow = tone === "light" ? lightRainbow(paper) : rainbowColors();
  const rest = reveal
    ? rainbow
    : tone === "light"
      ? lightRest(paper)
      : restColors();
  let mount: ShaderMount;
  try {
    mount = new ShaderMount(
      host,
      meshGradientFragmentShader,
      {
        u_fit: ShaderFitOptions.cover,
        u_scale: 0.85,
        u_rotation: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_offsetX: pose.offsetX,
        u_offsetY: pose.offsetY,
        u_worldWidth: 0,
        u_worldHeight: 0,
        u_colors: rest,
        u_colorsCount: rest.length,
        u_distortion: pose.distortion,
        u_swirl: pose.swirl,
        u_grainMixer: pose.grainMixer,
        u_grainOverlay: 0,
      },
      { alpha: false, antialias: false, powerPreference: "low-power" },
      reveal ? 0 : desiredSpeed(),
      pose.frame,
      2,
      720 * 1000,
    );
  } catch (error) {
    host.querySelector(":scope > canvas")?.remove();
    console.warn("Mesh WebGL indisponible", error);
    return;
  }

  mount.canvasElement.setAttribute("aria-hidden", "true");

  // Le calque réagit aux éléments [data-mesh-trigger] de sa racine
  // [data-mesh-root] (le footer), ou de toute la page s'il est fixé au
  // viewport (un bouton du hero peut alors le déclencher aussi).
  const root = host.closest<HTMLElement>("[data-mesh-root]");
  const fixed = host.closest(".mesh-bg.is-fixed") !== null;
  const scope: ParentNode = fixed ? document : (root ?? document);
  const abort = new AbortController();

  // Le halo suit le pointeur sur toute la racine : les triggers ne jouent pas.
  const triggers = spotlight
    ? []
    : Array.from(scope.querySelectorAll<HTMLElement>("[data-mesh-trigger]"));
  // La racine peut être son propre déclencheur (une carte entière).
  if (!spotlight && root?.matches("[data-mesh-trigger]")) triggers.push(root);

  if (reveal) {
    const target = fixed ? document.documentElement : (root ?? host.parentElement);
    if (target) {
      bindSpotlight(host, fixed ? null : root, target, mount, abort.signal);
    }
  }

  const active = new Set<HTMLElement>();
  let blend = 0;
  let fadeFrame = 0;

  const paint = (t: number) => {
    mount.setUniforms({
      u_colors: rest.map((color, index) =>
        mixColor(color, rainbow[index] ?? color, t),
      ),
      u_colorsCount: rest.length,
    });
  };

  const go = (on: boolean) => {
    root?.classList.toggle("is-mesh-active", on);
    const target = on ? 1 : 0;
    cancelAnimationFrame(fadeFrame);
    if (window.matchMedia(REDUCED).matches) {
      blend = target;
      paint(blend);
      return;
    }
    const origin = blend;
    const started = performance.now();
    const step = (now: number) => {
      const raw = Math.min(1, (now - started) / FADE_MS);
      blend = origin + (target - origin) * easeInOut(raw);
      paint(blend);
      if (raw < 1) fadeFrame = requestAnimationFrame(step);
    };
    fadeFrame = requestAnimationFrame(step);
  };

  let wasActive = false;
  const set = (el: HTMLElement, on: boolean) => {
    if (on) active.add(el);
    else active.delete(el);
    const now = active.size > 0;
    if (now !== wasActive) {
      wasActive = now;
      go(now);
    }
  };

  for (const el of triggers) {
    const opts = { signal: abort.signal };
    el.addEventListener("pointerenter", () => set(el, true), opts);
    el.addEventListener("pointerleave", () => set(el, false), opts);
    el.addEventListener(
      "focus",
      () => set(el, el.matches(":focus-visible")),
      opts,
    );
    el.addEventListener("blur", () => set(el, false), opts);
  }

  const desktop = window.matchMedia(DESKTOP);
  const reduced = window.matchMedia(REDUCED);
  const onChange = () => {
    // Le calque révélé repart au prochain mouvement du pointeur.
    mount.setSpeed(reveal ? 0 : desiredSpeed());
    if (reveal) host.closest(".mesh-reveal")?.classList.remove("is-spot");
  };
  desktop.addEventListener("change", onChange);
  reduced.addEventListener("change", onChange);
  holder[STATE_KEY] = {
    abort,
    onChange,
    desktop,
    reduced,
    cancelFade: () => cancelAnimationFrame(fadeFrame),
  };
}
