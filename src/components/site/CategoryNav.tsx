import { Link } from "@tanstack/react-router";
import { useQuickLinks } from "@/hooks/useQuickLinks";

export function CategoryNav() {
  const { links, loading } = useQuickLinks();

  if (loading || links.length === 0) return null;

  return (
    <section className="bg-background overflow-hidden">
      <div className="container mx-auto px-4 pt-6 pb-2">
        <div className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-2 items-center lg:justify-center md:px-8">
          {links.map((link) => (
            <Link
              key={link.id}
              to={link.url}
              className="flex flex-col items-center gap-2 md:gap-3 min-w-[64px] md:min-w-[80px] group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                <img
                  src={link.image_url}
                  alt={link.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-center tracking-wide capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
