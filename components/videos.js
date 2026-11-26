// Garde légères les vidéos en boucle déposées via Keystatic (public/videos).
//
// Chaque MP4 est réencodé une fois : H.264, sans piste audio, 1920 px de large
// au plus, « faststart » pour démarrer avant la fin du téléchargement. Un
// marqueur dans les métadonnées évite de réencoder deux fois. Au-delà de
// MAX_VIDEO_BYTES, le build échoue.
//
// - Intégration Astro (astro.config.ts) : `integrations: [videos()]`,
//   compression automatique en dev, contrôle de poids au build.
// - À la main : `node node_modules/@hien/design-tokens/components/videos.js`
//   (script `pnpm run videos` dans chaque site).
// ffmpeg vient de `ffmpeg-static`, installé par le site (devDependency).
// Même logique que scripts/videos.mjs d'apps.hien.design.
import { spawn } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { readdir, readFile, rename, rm, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VIDEO_DIR = "public/videos";
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024;
const MARKER = "hien-design-video-optimized";
// Fichiers déjà passés par le script d'apps.hien.design.
const KNOWN_MARKERS = [MARKER, "apps-2026-optimized"];

function ffmpegPath(root) {
  try {
    const require = createRequire(path.join(root, "package.json"));
    const p = require("ffmpeg-static");
    return p && existsSync(p) ? p : null;
  } catch {
    return null;
  }
}

export const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export async function listVideos(root = process.cwd()) {
  const dir = path.join(root, VIDEO_DIR);
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.mp4$/i.test(e.name) && !e.name.endsWith(".tmp.mp4"))
    .map((e) => path.join(e.parentPath ?? e.path, e.name));
}

export async function isOptimized(file) {
  const content = await readFile(file);
  return KNOWN_MARKERS.some((marker) => content.includes(marker));
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr = (stderr + d).slice(-4000)));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(stderr.trim()))));
  });
}

/** Réencode un fichier sur place. null quand il n'y avait rien à faire. */
export async function optimizeVideo(file, root = process.cwd()) {
  if (await isOptimized(file)) return null;
  const ffmpeg = ffmpegPath(root);
  if (!ffmpeg) throw new Error("ffmpeg-static is not installed (pnpm add -D ffmpeg-static)");

  const before = (await stat(file)).size;
  const tmp = `${file}.tmp.mp4`;
  const common = ["-an", "-movflags", "+faststart", "-metadata", `comment=${MARKER}`];
  try {
    await run(ffmpeg, [
      "-y", "-i", file, "-map", "0:v:0",
      "-c:v", "libx264", "-preset", "slow", "-crf", "28",
      "-vf", "scale='min(1920,iw)':-2", "-pix_fmt", "yuv420p",
      ...common, tmp,
    ]);
    // Déjà bien compressée : on garde le flux d'origine, on ajoute le marqueur.
    if ((await stat(tmp)).size >= before) {
      await run(ffmpeg, ["-y", "-i", file, "-map", "0:v:0", "-c:v", "copy", ...common, tmp]);
    }
    await rename(tmp, file);
  } catch (error) {
    await rm(tmp, { force: true });
    throw error;
  }
  return { before, after: (await stat(file)).size };
}

/** Fichiers au-dessus du budget, pour le contrôle au build. */
export async function oversizedVideos(root = process.cwd()) {
  const out = [];
  for (const file of await listVideos(root)) {
    const { size } = await stat(file);
    if (size > MAX_VIDEO_BYTES) out.push({ file: path.relative(root, file), size });
  }
  return out;
}

/**
 * Intégration Astro. Dev : chaque MP4 enregistré sous public/videos (par
 * Keystatic ou à la main) est compressé juste après son arrivée. Build :
 * échoue si une vidéo dépasse le budget, pour qu'un fichier lourd n'arrive
 * pas en production.
 */
export default function videos() {
  let root = process.cwd();
  return {
    name: "hien-loop-videos",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = fileURLToPath(config.root);
      },
      "astro:server:setup": ({ server, logger }) => {
        const queue = new Map();
        let chain = Promise.resolve();

        const handle = (file) => {
          chain = chain.then(async () => {
            const rel = path.relative(root, file);
            try {
              const result = await optimizeVideo(file, root);
              if (result) {
                logger.info(`${rel}: ${formatMB(result.before)} -> ${formatMB(result.after)}`);
                if (result.after > MAX_VIDEO_BYTES) {
                  logger.warn(
                    `${rel} is still over ${formatMB(MAX_VIDEO_BYTES)}: the build will refuse it. Use a shorter clip.`,
                  );
                }
              }
            } catch (error) {
              logger.error(`${rel}: ${error.message}`);
            }
          });
        };

        // Avec délai : Keystatic écrit le fichier, on attend qu'il soit complet.
        const schedule = (file) => {
          if (!/\.mp4$/i.test(file) || file.endsWith(".tmp.mp4")) return;
          if (!file.startsWith(path.join(root, VIDEO_DIR))) return;
          clearTimeout(queue.get(file));
          queue.set(
            file,
            setTimeout(() => {
              queue.delete(file);
              handle(file);
            }, 1000),
          );
        };

        server.watcher.add(path.join(root, VIDEO_DIR));
        server.watcher.on("add", schedule);
        server.watcher.on("change", schedule);
        listVideos(root).then((files) => files.forEach(schedule));
      },
      "astro:build:start": async ({ logger }) => {
        const big = await oversizedVideos(root);
        if (big.length === 0) return;
        const list = big.map((v) => `  ${v.file} (${formatMB(v.size)})`).join("\n");
        logger.error(`Videos over ${formatMB(MAX_VIDEO_BYTES)}:\n${list}`);
        throw new Error("Video too heavy. Run `pnpm run videos`, or use a shorter clip.");
      },
    },
  };
}

// `pnpm run videos` (lancé depuis la racine du site)
const self = fileURLToPath(import.meta.url);
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(self)) {
  const root = process.cwd();
  const files = await listVideos(root);
  if (files.length === 0) console.log(`No MP4 in ${VIDEO_DIR}.`);
  for (const file of files) {
    const rel = path.relative(root, file);
    const result = await optimizeVideo(file, root);
    console.log(
      result ? `${rel}: ${formatMB(result.before)} -> ${formatMB(result.after)}` : `${rel}: already optimized`,
    );
  }
  const big = await oversizedVideos(root);
  for (const { file, size } of big) {
    console.error(`${file} is ${formatMB(size)}, over the ${formatMB(MAX_VIDEO_BYTES)} limit. Use a shorter clip.`);
  }
  if (big.length) process.exit(1);
}
