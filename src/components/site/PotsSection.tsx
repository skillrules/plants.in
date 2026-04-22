import { Link } from "@tanstack/react-router";
import imgTerracotta from "@/assets/pot-terracotta.png";
import imgCeramic from "@/assets/pot-ceramic.png";
import imgConcrete from "@/assets/pot-concrete.png";
import imgBasket from "@/assets/pot-basket.png";
import imgMetal from "@/assets/pot-metal.png";
import imgGlass from "@/assets/pot-glass.png";

const pots = [
  { name: "Terracotta Classics", image: imgTerracotta, desc: "Breathable & natural" },
  { name: "Glossy Ceramic", image: imgCeramic, desc: "Elegant & modern" },
  { name: "Concrete Planters", image: imgConcrete, desc: "Minimalist & industrial" },
  { name: "Woven Baskets", image: imgBasket, desc: "Warm & bohemian" },
  { name: "Galvanized Metal", image: imgMetal, desc: "Rustic charm" },
  { name: "Glass Terrariums", image: imgGlass, desc: "Modern & clear" },
];

export function PotsSection() {
  return (
    <section className="container mx-auto px-4 pb-12 pt-6 md:pb-20 md:pt-10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 border-t pt-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Premium Pots & Planters
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl text-lg">
            Give your plants the home they deserve. Discover our curated collection of handcrafted pots, perfect for any interior style.
          </p>
        </div>
        <Link 
          to="/shop" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary-deep hover:text-primary transition-colors border-b-2 border-primary-deep pb-1 hover:border-primary"
        >
          View all pots
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {pots.map((pot) => (
          <Link 
            key={pot.name} 
            to="/shop" 
            className="group flex flex-col gap-4"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#f6f6f6] shadow-soft transition-smooth group-hover:shadow-elegant relative">
              <img 
                src={pot.image} 
                alt={pot.name} 
                loading="lazy" 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply" 
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary-deep transition-colors">
                {pot.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {pot.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
