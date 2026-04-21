import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/site/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Your Wishlist — Plantsin" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
          <h1 className="font-display text-3xl font-semibold text-foreground">Your Wishlist</h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-3xl bg-secondary/20 border-dashed">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground mb-6">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-display font-medium text-foreground mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Looks like you haven't saved any plants yet. Browse our collection and click the heart icon to save your favorites!
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop">Discover Plants</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
