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
            className="group flex items-center justify-between gap-4 rounded-3xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-300 px-6 py-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 ring-1 ring-border/40 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-6 w-6 text-primary-deep" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold font-display text-foreground leading-tight">
                  {title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {subtitle}
                </span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground/70 group-hover:text-primary-deep group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
