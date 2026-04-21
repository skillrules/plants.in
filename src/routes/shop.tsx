import { useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useProducts, type Category } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/site/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SlidersHorizontal, Leaf, X } from "lucide-react";
import { Header } from "@/components/site/Header";

const CATEGORIES: Category[] = ["Indoor", "Succulent", "Flowering", "Trailing"];

const LIGHT_OPTIONS = [
  { id: "low", label: "Low light", match: (l: string) => /low/i.test(l) },
  { id: "medium", label: "Medium light", match: (l: string) => /medium/i.test(l) },
  { id: "bright", label: "Bright light", match: (l: string) => /bright/i.test(l) },
] as const;

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
  name: "Name A–Z",
} as const;

type SortKey = keyof typeof SORTS;

const PAGE_SIZES = [8, 12, 24, 48] as const;
type PageSize = (typeof PAGE_SIZES)[number];
const DEFAULT_PAGE_SIZE: PageSize = 12;

const MAX_PRICE = 5000;
const MIN_PRICE = 0;

const SORT_KEYS = Object.keys(SORTS) as [SortKey, ...SortKey[]];
const LIGHT_IDS = LIGHT_OPTIONS.map((o) => o.id) as unknown as [string, ...string[]];

const shopSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  categories: fallback(z.array(z.enum(CATEGORIES as [Category, ...Category[]])), []).default([]),
  light: fallback(z.array(z.enum(LIGHT_IDS)), []).default([]),
  petSafe: fallback(z.boolean(), false).default(false),
  min: fallback(z.number(), MIN_PRICE).default(MIN_PRICE),
  max: fallback(z.number(), MAX_PRICE).default(MAX_PRICE),
  sort: fallback(z.enum(SORT_KEYS), "featured").default("featured"),
  page: fallback(z.number().int().min(1), 1).default(1),
  pageSize: fallback(z.union([z.literal(8), z.literal(12), z.literal(24), z.literal(48)]), DEFAULT_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [
      { title: "Shop All Plants — Plantsin" },
      { name: "description", content: "Browse the full Plantsin collection. Filter by light, pet-safety, and price to find your perfect plant." },
      { property: "og:title", content: "Shop All Plants — Plantsin" },
      { property: "og:description", content: "Browse the full Plantsin collection. Filter by light, pet-safety, and price." },
    ],
  }),
  component: ShopPage,
});

function FiltersPanel({
  categories, setCategories, light, setLight, petSafe, setPetSafe, price, setPrice, onReset,
}: {
  categories: Category[];
  setCategories: (v: Category[]) => void;
  light: string[];
  setLight: (v: string[]) => void;
  petSafe: boolean;
  setPetSafe: (v: boolean) => void;
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  onReset: () => void;
}) {
  const toggleLight = (id: string) => {
    setLight(light.includes(id) ? light.filter((x) => x !== id) : [...light, id]);
  };
  const toggleCategory = (c: Category) => {
    setCategories(categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c]);
  };
  return (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${c}`}
                checked={categories.includes(c)}
                onCheckedChange={() => toggleCategory(c)}
              />
              <Label htmlFor={`cat-${c}`} className="text-sm font-normal cursor-pointer">
                {c}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Light</h3>
        <div className="flex flex-col gap-2.5">
          {LIGHT_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`light-${opt.id}`}
                checked={light.includes(opt.id)}
                onCheckedChange={() => toggleLight(opt.id)}
              />
              <Label htmlFor={`light-${opt.id}`} className="text-sm font-normal cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Pet friendly</h3>
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="pet-safe"
            checked={petSafe}
            onCheckedChange={(v) => setPetSafe(Boolean(v))}
          />
          <Label htmlFor="pet-safe" className="text-sm font-normal cursor-pointer">
            Pet safe only
          </Label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Price range</h3>
          <span className="text-xs text-muted-foreground">
            ₹{price[0]} – ₹{price[1]}
          </span>
        </div>
        <Slider
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={50}
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          className="mt-2"
        />
      </div>

      <Button variant="outline" onClick={onReset} className="rounded-full">
        Reset filters
      </Button>
    </div>
  );
}

type ShopSearch = z.infer<typeof shopSearchSchema>;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { products, loading } = useProducts();

  const q = search.q;
  const categories = search.categories as Category[];
  const light = search.light;
  const petSafe = search.petSafe;
  const price: [number, number] = [search.min, search.max];
  const sort = search.sort;
  const page = search.page;
  const pageSize = search.pageSize as PageSize;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Reset to page 1 whenever filters/sort change
  const setCategories = (v: Category[]) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, categories: v, page: 1 }), replace: true, resetScroll: false });
  const setLight = (v: string[]) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, light: v, page: 1 }), replace: true, resetScroll: false });
  const setPetSafe = (v: boolean) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, petSafe: v, page: 1 }), replace: true, resetScroll: false });
  const setPrice = (v: [number, number]) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, min: v[0], max: v[1], page: 1 }), replace: true, resetScroll: false });
  const setSort = (v: SortKey) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, sort: v, page: 1 }), replace: true, resetScroll: false });
  const setPage = (v: number) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, page: v }), replace: true, resetScroll: false });
  const setPageSize = (v: PageSize) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, pageSize: v, page: 1 }), replace: true, resetScroll: false });

  const reset = () =>
    navigate({
      search: { q: "", categories: [], light: [], petSafe: false, min: MIN_PRICE, max: MAX_PRICE, sort: "featured", page: 1, pageSize: DEFAULT_PAGE_SIZE },
      replace: true,
      resetScroll: false,
    });

  const activeFilters: { id: string; label: string; onRemove: () => void }[] = [];

  if (q) {
    activeFilters.push({
      id: "q",
      label: `Search: "${q}"`,
      onRemove: () => navigate({ search: (prev: ShopSearch) => ({ ...prev, q: "", page: 1 }), replace: true, resetScroll: false })
    });
  }

  categories.forEach(c => {
    activeFilters.push({
      id: `cat-${c}`,
      label: c,
      onRemove: () => setCategories(categories.filter(x => x !== c))
    });
  });

  light.forEach(l => {
    const opt = LIGHT_OPTIONS.find(o => o.id === l);
    if (opt) {
      activeFilters.push({
        id: `light-${l}`,
        label: opt.label,
        onRemove: () => setLight(light.filter(x => x !== l))
      });
    }
  });

  if (petSafe) {
    activeFilters.push({
      id: "petSafe",
      label: "Pet safe",
      onRemove: () => setPetSafe(false)
    });
  }

  if (price[0] > MIN_PRICE || price[1] < MAX_PRICE) {
    activeFilters.push({
      id: "price",
      label: `₹${price[0]} – ₹${price[1]}`,
      onRemove: () => setPrice([MIN_PRICE, MAX_PRICE])
    });
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.tag && p.tag.toLowerCase().includes(q.toLowerCase()))) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (petSafe && !/^pet safe/i.test(p.care.petSafe)) return false;
      if (categories.length > 0 && !categories.includes(p.category)) return false;
      if (light.length > 0) {
        const matches = LIGHT_OPTIONS.some(
          (opt) => light.includes(opt.id) && opt.match(p.care.light),
        );
        if (!matches) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "name": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, q, categories, light, petSafe, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  const pageNumbers: (number | "ellipsis")[] = (() => {
    const out: (number | "ellipsis")[] = [];
    const w = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - w && i <= currentPage + w)) {
        out.push(i);
      } else if (out[out.length - 1] !== "ellipsis") {
        out.push("ellipsis");
      }
    }
    return out;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <nav className="text-xs text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary-deep">Home</Link> · Shop
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary-deep" />
            Shop all plants
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : startIdx + 1}–{startIdx + pageItems.length} of {filtered.length} plants
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-5">Filters</h2>
              <FiltersPanel
                categories={categories} setCategories={setCategories}
                light={light} setLight={setLight}
                petSafe={petSafe} setPetSafe={setPetSafe}
                price={price} setPrice={setPrice}
                onReset={reset}
              />
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-full gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FiltersPanel
                    categories={categories} setCategories={setCategories}
                    light={light} setLight={setLight}
                    petSafe={petSafe} setPetSafe={setPetSafe}
                    price={price} setPrice={setPrice}
                    onReset={reset}
                  />
                </SheetContent>
              </Sheet>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Sort by</span>
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-10 w-[180px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORTS) as SortKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{SORTS[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={filter.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-smooth hover:bg-secondary/60 hover:text-foreground"
                  >
                    {filter.label}
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
                <button
                  onClick={reset}
                  className="ml-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <p className="font-semibold text-foreground">No plants match your filters</p>
                <p className="mt-1 text-sm text-muted-foreground">Try widening the price range or clearing filters.</p>
                <Button onClick={reset} className="mt-4 rounded-full">Reset filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {pageItems.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Show</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(v) => setPageSize(Number(v) as PageSize)}
                    >
                      <SelectTrigger className="h-9 w-[88px] rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZES.map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">per page</span>
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto justify-end">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            aria-disabled={currentPage <= 1}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setPage(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                        {pageNumbers.map((n, i) =>
                          n === "ellipsis" ? (
                            <PaginationItem key={`e-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={n}>
                              <PaginationLink
                                href="#"
                                isActive={n === currentPage}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(n);
                                }}
                              >
                                {n}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            aria-disabled={currentPage >= totalPages}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setPage(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
