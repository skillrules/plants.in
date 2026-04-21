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
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2 rounded-full outline-none focus-visible:ring-2">
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
              placeholder="Search for plants, pots, accessories..."
              className="h-11 rounded-full pl-11 bg-secondary/60 border-transparent focus-visible:bg-card"
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

        <div className="flex items-center gap-1 ml-auto">
          {isAdmin && isAppAdminRoute && (
            <Button asChild variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" aria-label="Preview website">
              <a href="/" target="_blank" rel="noopener noreferrer" title="Preview website in new tab">
                <Eye className="h-5 w-5" />
              </a>
            </Button>
          )}
          <Button asChild variant="ghost" size="icon" className="rounded-full relative" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Button onClick={open} variant="ghost" size="icon" className="rounded-full relative" aria-label="Open cart">
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
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
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
            <Button asChild variant="ghost" size="icon" className="rounded-full" aria-label="Sign in">
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
