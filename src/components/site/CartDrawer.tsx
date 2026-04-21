import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/format";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQty, subtotal, count } = useCart();
  const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary-deep" />
            Your Cart
            <span className="text-sm font-normal text-muted-foreground">({count})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add some greenery to get started.</p>
            <Button onClick={() => setOpen(false)} className="mt-3 rounded-full">
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">{item.variant}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-destructive transition-smooth"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border border-border h-8">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-primary-deep">
                          {formatINR(item.unitPrice * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border bg-secondary/30 px-6 py-5 flex-col gap-3 sm:flex-col sm:space-x-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <span>Total</span>
                <span className="text-primary-deep">{formatINR(total)}</span>
              </div>
              <Button
                asChild
                onClick={() => setOpen(false)}
                className="w-full h-12 rounded-full bg-gradient-primary text-base font-semibold shadow-glow hover:opacity-95"
              >
                <Link to="/checkout">Checkout · {formatINR(total)}</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
