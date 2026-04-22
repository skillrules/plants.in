import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, Leaf, LogOut, Shield, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useMenuItems } from "@/hooks/useMenuItems";
import { formatINR } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const SEARCH_TERMS = [
  "Areca Palm", "Money Plant", "Snake Plant", "Miniature Rose",
  "Pothos", "ZZ Plant", "Peace Lily", "Aloe Vera",
  "Rose Plants", "Spider Plant", "Rubber Plant", "Jasmine Plant"
];

export function Header() {
  const { open, count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { settings } = useSiteSettings();
  const { user, isAdmin, signOut } = useAuth();
  const { products } = useProducts();
  const { items: menuItems } = useMenuItems(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isAppAdminRoute = location.pathname.startsWith('/admin');

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [placeholder, setPlaceholder] = useState("");
  const [termIndex, setTermIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTerm = SEARCH_TERMS[termIndex];
    const fullText = currentTerm;

    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
        if (placeholder.length <= 0) {
          setIsDeleting(false);
          setTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
        }
      }, 40);
    } else {
      if (placeholder === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        timer = setTimeout(() => {
          setPlaceholder(fullText.substring(0, placeholder.length + 1));
        }, 80);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, termIndex]);

  const searchResults = query.trim().length > 0
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))).slice(0, 5)
    : [];

  const showDropdown = isFocused && query.trim().length > 0 && searchResults.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate({ to: "/shop", search: { q: query } as any });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center gap-4 px-4 py-4 md:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover shadow-glow"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2 rounded-full outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-2 border-[#3b9c45] text-foreground font-semibold px-4 hover:bg-[#3b9c45]/10">
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 mt-1 rounded-xl shadow-elegant border-border/60">
            {menuItems.length === 0 ? (
              <DropdownMenuItem asChild>
                <Link to="/shop" className="cursor-pointer">Shop All</Link>
              </DropdownMenuItem>
            ) : (
              menuItems.map((item) => (
                <DropdownMenuItem key={item.id} asChild>
                  <Link
                    to={item.type === "link" ? (item.url as any) : `/page/${item.slug}`}
                    className="cursor-pointer"
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div ref={dropdownRef} className="relative flex-1 max-w-2xl">
          <form onSubmit={onSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              className="h-11 rounded-full pl-11 bg-secondary/60 border-transparent focus-visible:bg-card transition-colors"
            />
          </form>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card p-2 shadow-elegant z-50">
              <div className="flex flex-col">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to="/products/$id"
                    params={{ id: product.id }}
                    onClick={() => {
                      setIsFocused(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/50"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-foreground text-sm">{product.name}</div>
                      {product.tag && <div className="truncate text-xs text-muted-foreground">{product.tag}</div>}
                    </div>
                    <div className="font-semibold text-sm text-foreground pr-2">
                      {formatINR(product.price)}
                    </div>
                  </Link>
                ))}
                <button
                  onClick={onSearch}
                  className="mt-2 text-xs text-center font-medium text-primary-deep hover:underline py-2"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {isAdmin && isAppAdminRoute && (
            <Button asChild variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" aria-label="Preview website">
              <a href="/" target="_blank" rel="noopener noreferrer" title="Preview website in new tab">
                <Eye className="h-5 w-5" />
              </a>
            </Button>
          )}

          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-transparent transition-transform hover:scale-105" aria-label="Chat on WhatsApp">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp">
              <div className="flex items-center justify-center w-7 h-7 rounded-[0.4rem] bg-gradient-to-b from-[#58e25d] to-[#1ab335] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </div>
            </a>
          </Button>

          <Button asChild variant="ghost" size="icon" className="rounded-full relative border border-border/80 shadow-sm" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Button onClick={open} variant="ghost" size="icon" className="rounded-full relative border border-border/80 shadow-sm" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border/80 shadow-sm" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="icon" className="rounded-full border border-border/80 shadow-sm" aria-label="Sign in">
              <Link to="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
