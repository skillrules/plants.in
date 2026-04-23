import { Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Sprout, Flower2 } from "lucide-react";

const categories = [
  {
    title: "Indoor Plants",
    subtitle: "Air-purifying greens",
    href: "/shop",
    Icon: Leaf,
  },
  {
    title: "Outdoor Plants",
    subtitle: "Garden & balcony blooms",
    href: "/shop",
    Icon: Sprout,
  },
  {
    title: "Pots & Planters",
    subtitle: "Handcrafted vessels",
    href: "/shop",
    Icon: Flower2,
  },
];

export function ShopByCategory() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-end justify-between mb-8 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
          Shop by category
        </h2>
        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary-deep transition-colors whitespace-nowrap"
        >
          All collections
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {categories.map(({ title, subtitle, href, Icon }) => (
          <Link
            key={title}
            to={href}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft px-6 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40"
          >
            {/* Decorative gradient wash on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "var(--gradient-hero)" }}
            />
            {/* Glow blob */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/70 ring-1 ring-border/50 transition-all duration-500 group-hover:bg-primary group-hover:ring-primary group-hover:scale-110 group-hover:rotate-6">
                <Icon className="h-6 w-6 text-primary-deep transition-colors duration-500 group-hover:text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold font-display text-foreground leading-tight transition-colors duration-300 group-hover:text-primary-deep">
                  {title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {subtitle}
                </span>
              </div>
            </div>

            <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep">
              Shop {title}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-primary-deep transition-all duration-300 group-hover:w-[calc(100%-1.25rem)]"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
