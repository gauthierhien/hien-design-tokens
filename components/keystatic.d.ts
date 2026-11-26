export const headerSingleton: ReturnType<typeof import("@keystatic/core").singleton>;
export const footerSingleton: ReturnType<typeof import("@keystatic/core").singleton>;
export function loopVideoField(
  label?: string,
  options?: { folder?: string; description?: string },
): ReturnType<typeof import("@keystatic/core").fields.file>;
