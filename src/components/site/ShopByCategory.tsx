import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sprout,
  Flower2,
  TreePine,
  FlowerIcon,
  Sparkles,
  Sun,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { title: "Indoor Plants", subtitle: "Air-purifying greens", href: "/shop", Icon: Leaf },
  { title: "Outdoor Plants", subtitle: "Garden & balcony blooms", href: "/shop", Icon: Sprout },
  { title: "Pots & Planters", subtitle: "Handcrafted vessels", href: "/shop", Icon: Flower2 },
  { title: "Bonsai", subtitle: "Living sculptures", href: "/shop", Icon: TreePine },
  { title: "Flowering", subtitle: "Bright & blooming", href: "/shop", Icon: FlowerIcon },
  { title: "Low Maintenance", subtitle: "Easy-care favourites", href: "/shop", Icon: Sparkles },
  { title: "Sun Lovers", subtitle: "Bright light beauties", href: "/shop", Icon: Sun },
  { title: "Hydroponic", subtitle: "Soil-free serenity", href: "/shop", Icon: Droplets },
];

export function ShopByCategory() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
            Browse the collection
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
            Shop by category
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => scrollBy("left")}
            className="rounded-full hidden sm:inline-flex"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => scrollBy("right")}
            className="rounded-full hidden sm:inline-flex"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary-deep transition-colors whitespace-nowrap ml-2"
          >
            All collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {categories.map(({ title, subtitle, href, Icon }) => (
          <Link
            key={title}
            to={href}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft px-6 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40 snap-start shrink-0 w-[260px] sm:w-[300px]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "var(--gradient-hero)" }}
            />
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
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              </div>
            </div>

            <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep w-fit">
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
