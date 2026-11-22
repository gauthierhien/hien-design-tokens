import themeCss from "@hien/design-tokens/theme.css?raw";

export const colors = [
  { token: "background", utility: "bg-background", note: "Canvas" },
  { token: "background-muted", utility: "bg-background-muted", note: "Soft surface, secondary button" },
  { token: "foreground", utility: "bg-foreground", note: "Ink, solid CTA" },
  { token: "foreground-muted", utility: "bg-muted", note: "Captions, secondary text" },
  { token: "accent", utility: "bg-accent", note: "Emphasis, selection" },
  { token: "accent-hover", utility: "bg-accent-hover", note: "Hover on accent moments" },
  { token: "border", utility: "bg-border", note: "Hairlines, separation" },
  { token: "status", utility: "bg-status", note: "Availability LED" },
];

// Values read from theme.css, so the showcase cannot drift from the package.
const block = (selector: string) => {
  const start = themeCss.indexOf(selector);
  const body = themeCss.slice(themeCss.indexOf("{", start) + 1, themeCss.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  ) as Record<string, string>;
};
export const light = block(":root {");
export const dark = block(':root[data-theme="dark"] {');

export const type = [
  { name: "h1", sample: "Design Engineer", el: "h1" },
  { name: "h2", sample: "What will we ship together?", el: "h2" },
  { name: "h3", sample: "Selected work", el: "h3" },
  { name: "h4", sample: "Get in touch", el: "h4" },
  { name: "lead", sample: "Precise interfaces, from Figma to code.", el: "p", cls: "text-lead" },
  { name: "body", sample: "Freelance Design Engineer based in Paris, I design and build digital products.", el: "p" },
  { name: "label", sample: "Available for freelance work", el: "span" },
];
