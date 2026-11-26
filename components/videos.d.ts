import type { AstroIntegration } from "astro";

export declare const VIDEO_DIR: string;
export declare const MAX_VIDEO_BYTES: number;
export declare function formatMB(bytes: number): string;
export declare function listVideos(root?: string): Promise<string[]>;
export declare function isOptimized(file: string): Promise<boolean>;
export declare function optimizeVideo(
  file: string,
  root?: string,
): Promise<{ before: number; after: number } | null>;
export declare function oversizedVideos(root?: string): Promise<{ file: string; size: number }[]>;
export default function videos(): AstroIntegration;
