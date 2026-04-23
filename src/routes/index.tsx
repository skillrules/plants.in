import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { CategoryNav } from "@/components/site/CategoryNav";
import { HeroBento } from "@/components/site/HeroBento";

import { Marquee } from "@/components/site/Marquee";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { ShopByCategory } from "@/components/site/ShopByCategory";
import { SaleBanners } from "@/components/site/SaleBanners";
import { LocationDecor } from "@/components/site/LocationDecor";
import { PotsSection } from "@/components/site/PotsSection";
import { BeginnersGuide } from "@/components/site/BeginnersGuide";
import { CustomerReviews } from "@/components/site/CustomerReviews";
import { FAQSection } from "@/components/site/FAQSection";
import { BlogSection } from "@/components/site/BlogSection";
import { GiftSection } from "@/components/site/GiftSection";
import { Footer } from "@/components/site/Footer";


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
      <HeroBento />
      <Marquee />

      <FeaturedProducts />

      <ShopByCategory />

      <SaleBanners />

      <LocationDecor />

      <PotsSection />

      <GiftSection />

      <BeginnersGuide />

      <CustomerReviews />

      <BlogSection />

      <FAQSection />

      <Footer />
    </div>
  );
}
