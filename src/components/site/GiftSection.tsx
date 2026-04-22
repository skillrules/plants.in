import { Link } from "@tanstack/react-router";
import imgMinimalist from "@/assets/product-zz.jpg";
import imgRelaxed from "@/assets/product-snake.jpg";
import imgExtrovert from "@/assets/product-anthurium.jpg";
import imgNurturer from "@/assets/product-jade.jpg";
import imgHappy from "@/assets/product-calathea.jpg";
import imgFlexible from "@/assets/product-pothos.jpg";

const giftColumns = [
  [
    { name: "Minimalist", image: imgMinimalist, height: "h-[280px]" },
    { name: "Relaxed", image: imgRelaxed, height: "h-[180px]" },
  ],
  [
    { name: "Extrovert", image: imgExtrovert, height: "h-[180px]" },
    { name: "Nurturer", image: imgNurturer, height: "h-[340px]" },
  ],
  [
    { name: "Happy-Go-Lucky", image: imgHappy, height: "h-[300px]" },
    { name: "Flexible", image: imgFlexible, height: "h-[180px]" },
  ]
];

export function GiftSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-10 text-left md:text-left max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
          We deliver gifts to your loved ones.
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          <span className="font-semibold text-foreground/80">Gift by Personality</span> — Small details that matter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {giftColumns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-5 lg:gap-6">
            {col.map((gift, index) => (
              <Link 
                key={index} 
                to="/shop" 
                className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-elegant transition-all duration-300"
              >
                <div className={`w-full relative overflow-hidden bg-secondary/30 ${gift.height}`}>
                  <img 
                    src={gift.image} 
                    alt={gift.name} 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                </div>
                <div className="py-3.5 text-center font-bold text-[15px] text-foreground group-hover:text-primary-deep transition-colors border-t border-border/40">
                  {gift.name}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
