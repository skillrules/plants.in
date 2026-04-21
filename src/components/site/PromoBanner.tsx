import { ArrowRight } from "lucide-react";

interface Props {
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
  variant?: "warm" | "cool";
}

export function PromoBanner({ image, eyebrow, title, cta, variant = "warm" }: Props) {
  const gradient = variant === "warm" ? "bg-gradient-promo-warm" : "bg-gradient-promo-cool";
  return (
    <a
      href="#"
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl ${gradient} p-6 shadow-soft transition-smooth hover:shadow-elegant`}
    >
      <div className="relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          {eyebrow}
        </span>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-foreground max-w-[60%]">
          {title}
        </h3>
      </div>
      <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
      <img
        src={image}
        alt={title}
        loading="lazy"
        width={800}
        height={1200}
        className="absolute -right-6 -bottom-6 h-[80%] w-auto object-contain transition-transform duration-700 group-hover:scale-110"
      />
    </a>
  );
}
