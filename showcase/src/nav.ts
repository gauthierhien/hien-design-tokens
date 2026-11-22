export type NavItem = { href: string; label: string; description: string };

export const nav: { title: string; items: NavItem[] }[] = [
  {
    title: "Foundations",
    items: [
      { href: "/", label: "Introduction", description: "What the design system contains and how to use it." },
      { href: "/colors", label: "Colors", description: "oklch tokens, light and dark mode." },
      { href: "/typography", label: "Typography", description: "Geist and Geist Mono, responsive scale." },
      { href: "/grid", label: "Grid", description: "8 columns, centered content, responsive variants." },
      { href: "/animated-background", label: "Animated background", description: "Dark and light mesh, colored state on hover." },
    ],
  },
  {
    title: "Components",
    items: [
      { href: "/header-footer", label: "Header and Footer", description: "Shared skeleton, content from Keystatic." },
      { href: "/buttons", label: "Buttons", description: "Full-width pill, overlay, compact." },
      { href: "/badges", label: "Badges", description: "Uppercase mono tag." },
      { href: "/images", label: "Images", description: "Wide image, square image, caption, link, lightbox." },
      { href: "/sections", label: "Sections", description: "Header, wide image, image grid." },
      { href: "/carousel", label: "Carousel", description: "Slides that bleed past the grid." },
    ],
  },
];

export const pages = nav.flatMap((group) => group.items);
