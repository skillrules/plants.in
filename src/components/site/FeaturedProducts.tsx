import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const { products, loading } = useProducts();

  return (
    <section className="container mx-auto px-4 pt-8 pb-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
            Hand-picked this week
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-foreground">
            Featured Plants
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="hidden sm:inline-flex rounded-full text-primary-deep hover:text-primary-deep hover:bg-primary/10"
        >
          <Link to="/shop">View all →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
