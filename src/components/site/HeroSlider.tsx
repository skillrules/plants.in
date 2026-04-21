import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useHeroSlides } from "@/hooks/useHeroSlides";

import slide1 from "@/assets/hero-plants.jpg";
import slide2 from "@/assets/hero-snake.jpg";
import slide3 from "@/assets/hero-fiddle.jpg";

const slides = [
  {
    image: slide1,
    eyebrow: "Spring Collection",
    title: "Bring the outside in",
    subtitle: "Hand-picked houseplants delivered to your door, root-ready and thriving.",
    cta: "Shop Plants",
  },
  {
    image: slide2,
    eyebrow: "Bestseller",
    title: "Snake Plants from ₹299",
    subtitle: "Low maintenance, high impact. Perfect for first-time plant parents.",
    cta: "Discover",
  },
  {
    image: slide3,
    eyebrow: "Statement Pieces",
    title: "Fiddle Leaf Figs",
    subtitle: "Turn any room into a sun-drenched sanctuary with our signature large plants.",
    cta: "Explore",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const { slides: dbSlides, loading } = useHeroSlides(true);

  // Fallback to hardcoded slides if none exist in the database yet
  const displaySlides = dbSlides.length > 0 ? dbSlides.map(s => ({
    image: s.image_url,
    eyebrow: s.eyebrow,
    title: s.title,
    subtitle: s.subtitle,
    cta: s.cta_text,
    link: s.cta_link
  })) : slides.map(s => ({ ...s, link: "/shop" }));

  useEffect(() => {
    if (displaySlides.length === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % displaySlides.length), 6000);
    return () => clearInterval(t);
  }, [displaySlides.length]);

  const go = (dir: number) => setIndex((i) => (i + dir + displaySlides.length) % displaySlides.length);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl bg-secondary/20 border">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-3xl shadow-elegant bg-secondary/10">
      {displaySlides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="absolute inset-0 h-full w-full object-cover"
            width={1600}
            height={900}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-center px-8 md:px-14 max-w-2xl">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-deep">
              {s.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-foreground">
              {s.title}
            </h2>
            <p className="mt-4 max-w-md text-base md:text-lg text-muted-foreground">
              {s.subtitle}
            </p>
            <div className="mt-7">
              <Button asChild size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-7">
                <Link to={s.link}>{s.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(-1)}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur text-primary-deep shadow-soft transition-smooth hover:bg-card hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur text-primary-deep shadow-soft transition-smooth hover:bg-card hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-smooth ${i === index ? "w-8 bg-primary" : "w-2 bg-foreground/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
