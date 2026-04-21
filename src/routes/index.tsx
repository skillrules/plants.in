import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { CategoryNav } from "@/components/site/CategoryNav";
import { HeroSlider } from "@/components/site/HeroSlider";
import { PromoBanner } from "@/components/site/PromoBanner";
import { Marquee } from "@/components/site/Marquee";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import promoSucculents from "@/assets/promo-succulents.jpg";
import promoOrchids from "@/assets/promo-orchids.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plantsin — Beautiful Plants Delivered to Your Door" },
      { name: "description", content: "Shop hand-picked indoor plants, succulents, and statement greenery. Free delivery from ₹500, 30-day plant health guarantee." },
      { property: "og:title", content: "Plantsin — Beautiful Plants Delivered to Your Door" },
      { property: "og:description", content: "Hand-picked indoor plants, succulents, and statement greenery — delivered fresh." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryNav />

      <section className="container mx-auto px-4 pb-2">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:h-[480px]">
          <div className="lg:col-span-2 h-[420px] lg:h-full">
            <HeroSlider />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            <PromoBanner
              image={promoSucculents}
              eyebrow="Mini Garden"
              title="Succulents from ₹149"
              cta="Shop now"
              variant="warm"
            />
            <PromoBanner
              image={promoOrchids}
              eyebrow="Limited Edition"
              title="Orchid Bouquets"
              cta="Discover"
              variant="cool"
            />
          </div>
        </div>
      </section>

      <Marquee />

      <FeaturedProducts />

      <footer className="container mx-auto px-4 py-12 mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Plantsin. Grown with care.</p>
      </footer>
    </div>
  );
}
