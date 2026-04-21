import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/hooks/useProducts";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { formatINR } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const badgeStyles: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  sale: "bg-destructive text-destructive-foreground",
  bestseller: "bg-accent text-accent-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  const { hasItem, toggleItem } = useWishlist();
  const liked = hasItem(product.id);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();
  
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:shadow-elegant hover:-translate-y-1">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative aspect-square overflow-hidden bg-secondary/40 block"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeStyles[product.badge]}`}>
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-deep shadow-soft">
          {product.category}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewOpen(true);
          }}
          className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-card/90 py-3 text-xs font-bold uppercase tracking-widest text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" /> Quick View
        </button>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product);
        }}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur shadow-soft transition-smooth hover:scale-110"
      >
        <Heart
          className={`h-4 w-4 transition-smooth ${liked ? "fill-destructive text-destructive" : "text-foreground/60"}`}
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>· {product.tag}</span>
        </div>
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="mt-1.5 text-base font-semibold text-foreground line-clamp-1 hover:text-primary-deep transition-smooth"
        >
          {product.name}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-primary-deep">
            {formatINR(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.oldPrice)}
            </span>
          )}
        </div>

        <Button
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              image: product.image,
              unitPrice: product.price,
              qty: 1,
            })
          }
          className="mt-3 w-full h-10 rounded-full bg-gradient-primary text-sm font-semibold shadow-glow hover:opacity-95"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="sm:max-w-2xl overflow-hidden p-0 rounded-3xl border-border/60">
          <div className="grid md:grid-cols-2 h-full">
            <div className="aspect-square md:aspect-auto bg-secondary/40 relative">
              <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <DialogHeader className="text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-deep">{product.tag}</span>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground mt-1">{product.name}</DialogTitle>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-deep">{formatINR(product.price)}</span>
                  {product.oldPrice && <span className="text-base text-muted-foreground line-through">{formatINR(product.oldPrice)}</span>}
                </div>
              </DialogHeader>
              
              <DialogDescription className="mt-5 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {product.description}
              </DialogDescription>
              
              <div className="mt-8 flex flex-col gap-3 mt-auto">
                <Button
                  onClick={() => {
                    addItem({ productId: product.id, name: product.name, image: product.image, unitPrice: product.price, qty: 1 });
                    setQuickViewOpen(false);
                  }}
                  className="w-full h-12 rounded-full bg-gradient-primary text-base font-semibold shadow-glow hover:opacity-95"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
                </Button>
                <Button asChild variant="outline" className="h-12 w-full rounded-full">
                  <Link to="/products/$id" params={{ id: product.id }}>View Full Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
