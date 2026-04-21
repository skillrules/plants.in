import { Link } from "@tanstack/react-router";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryNav() {
  const { links, loading } = useQuickLinks();

  return (
    <section className="container mx-auto px-4 py-6">
      <div 
        className="flex w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-3 pb-4 snap-x snap-mandatory"
        style={{ justifyContent: "safe center" }}
      >
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex shrink-0 snap-start flex-col items-center gap-2 w-[88px]">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : links.length === 0 ? (
          null // Optionally render nothing if no links are configured yet
        ) : (
          links.map((cat) => (
            <Link
              key={cat.id}
              to={cat.url as any} // Cast to any to bypass strict router type checks for dynamic URLs
              className="group flex shrink-0 snap-start flex-col items-center gap-2 transition-smooth w-[88px]"
            >
              <div
                className="flex h-20 w-20 overflow-hidden items-center justify-center rounded-full bg-secondary/50 shadow-soft ring-2 ring-transparent transition-smooth group-hover:ring-primary/30 group-hover:scale-105 group-hover:shadow-elegant"
              >
                <img src={cat.image_url} alt={cat.title} className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-primary-deep text-center leading-tight">
                {cat.title}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
