import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Star, Truck, Shield, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { fromDb, type DbProduct, type Product } from "@/hooks/useProducts";
import { getProductById, products as localProducts } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
    const query = supabase.from("products").select("*").eq("is_active", true);
    if (isUuid) {
      query.eq("id", params.id);
    } else {
      query.eq("slug", params.id);
    }
    const { data, error } = await query.maybeSingle();
      
    if (error) throw new Error(error.message);
    
    if (data) {
      return { product: fromDb(data as DbProduct) };
    }
    
    const local = getProductById(params.id);
    if (local) {
      return { product: local };
    }
    
    throw notFound();
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — Plantsin" }] };
    return {
      meta: [
        { title: `${p.name} — Plantsin` },
        { name: "description", content: p.description.slice(0, 160) },
        { property: "og:title", content: `${p.name} — Plantsin` },
        { property: "og:description", content: p.description.slice(0, 160) },
        { property: "og:image", content: p.image },
        { property: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-3xl">Plant not found</h1>
      <p className="text-muted-foreground">We couldn't find that plant in our greenhouse.</p>
      <Link to="/" className="text-primary-deep underline underline-offset-4">Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Link to="/" className="text-primary-deep underline underline-offset-4">Back to shop</Link>
    </div>
  ),
});





function ProductDetail() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const { addItem, close: closeCart } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const liked = hasItem(product.id);
  const [related, setRelated] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    setActiveIdx(0);
  }, [product.id]);

  useEffect(() => {
    setLoadingRelated(true);
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .neq("id", product.id)
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setRelated((data as DbProduct[]).map(fromDb));
        } else {
          // Fallback to local products
          const fallback = localProducts.filter(p => p.id !== product.id).slice(0, 6);
          setRelated(fallback);
        }
        setLoadingRelated(false);
      });
  }, [product.id]);

  const unitPrice = product.price;
  const total = unitPrice * qty;

  // Gallery consists of the main image and any additional gallery images from the database
  const gallery = [product.image, ...(product.gallery || [])];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-border/40">
              <div className="aspect-square md:aspect-[4/3] overflow-hidden">
                <div 
                  className="flex h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                >
                  {gallery.map((img, idx) => (
                    <div key={idx} className="h-full w-full shrink-0">
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggleItem(product)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card/90 backdrop-blur shadow-soft transition-smooth hover:scale-110"
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : "text-foreground/60"}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`aspect-square overflow-hidden rounded-2xl border-2 transition-smooth bg-white ${
                    activeIdx === idx 
                      ? "border-primary shadow-soft" 
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-border"
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                {product.category}
              </span>
              {product.tag && (
                <>
                  <span className="text-muted-foreground/40 text-xs">•</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.tag}</span>
                </>
              )}
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">· 248 reviews</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary-deep">{formatINR(unitPrice)}</span>
              {product.oldPrice && (
                <span className="text-base text-muted-foreground line-through">{formatINR(product.oldPrice)}</span>
              )}
            </div>

            <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>



            <div className="mt-7 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="inline-flex items-center rounded-full border-2 border-border h-12 px-1 shrink-0">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-base font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      name: product.name,
                      image: product.image,
                      unitPrice,
                      qty,
                    })
                  }
                  variant="outline"
                  className="flex-1 h-12 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary-deep text-base font-semibold transition-all"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <Button
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    image: product.image,
                    unitPrice,
                    qty,
                  });
                  closeCart();
                  navigate({ to: "/checkout" });
                }}
                className="w-full h-12 rounded-full bg-gradient-primary text-base font-semibold shadow-glow hover:opacity-95 transition-all"
              >
                Buy Now · {formatINR(total)}
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: "Light", value: product.care.light },
                { label: "Water", value: product.care.water },
                { label: "Pets", value: product.care.petSafe },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-border bg-card p-3 text-center">
                  <Leaf className="mx-auto h-4 w-4 text-primary" />
                  <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="text-xs font-semibold text-foreground">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-secondary/40 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary-deep" />
                <span className="text-foreground">Free delivery on orders over {formatINR(500)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary-deep" />
                <span className="text-foreground">30-day plant health guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.additional_info && (
        <section className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm">
            <div 
              className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap [&>p]:mb-4 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>b]:font-semibold [&>b]:text-foreground [&>strong]:font-semibold [&>strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: product.additional_info }}
            />
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {loadingRelated
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-3xl" />)
            : related.map((p) => (
                <Link
                  key={p.id}
                  to="/products/$id"
                  params={{ id: p.id }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:shadow-elegant hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-secondary/40">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</h3>
                    <p className="mt-1 text-base font-semibold text-primary-deep">{formatINR(p.price)}</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
