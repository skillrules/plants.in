import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { sendOrderEmails } from "@/server/email";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Plantsin" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_email: z.string().trim().email().max(200),
  customer_phone: z.string().trim().min(5).max(30),
  shipping_address: z.string().trim().min(5).max(500),
  shipping_city: z.string().trim().min(2).max(100),
  shipping_postal: z.string().trim().min(3).max(20),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function CheckoutPage() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal: "",
    notes: "",
  });
  const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const total = subtotal + shipping;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    
    // Generate IDs on the client side to avoid needing SELECT permissions from Supabase RLS
    const orderId = crypto.randomUUID();
    const orderNumber = "VRD-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + String(Math.floor(Math.random() * 100000)).padStart(5, "0");

    const { error } = await supabase
      .from("orders")
      .insert({ id: orderId, order_number: orderNumber, ...parsed.data, customer_email: parsed.data.customer_email, customer_phone: parsed.data.customer_phone, notes: parsed.data.notes || null, subtotal });
      
    if (error) {
      setBusy(false);
      toast.error(error.message ?? "Failed to place order");
      return;
    }
    const { error: itemsErr } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: orderId,
        product_id: i.productId,
        product_name: i.name,
        product_image: i.image,
        variant: i.variant ?? null,
        unit_price: i.unitPrice,
        qty: i.qty,
      })),
    );
    setBusy(false);
    if (itemsErr) {
      toast.error(itemsErr.message);
      return;
    }
    setOrderNumber(orderNumber);
    // Clear cart by removing each
    items.forEach(() => {});
    if (typeof window !== "undefined") window.localStorage.removeItem("leaflet:cart:v1");
    toast.success(`Order ${orderNumber} placed!`);

    // Fire and forget the email notification (no await needed, run in background)
    (sendOrderEmails as any)({
      data: {
        orderNumber,
        customerName: parsed.data.customer_name,
        customerEmail: parsed.data.customer_email,
        shippingAddress: parsed.data.shipping_address,
        shippingCity: parsed.data.shipping_city,
        shippingPostal: parsed.data.shipping_postal,
        items: items.map(i => ({
          name: i.name,
          qty: i.qty,
          unitPrice: i.unitPrice,
          variant: i.variant
        })),
        subtotal,
        total: subtotal
      }
    }).catch(console.error);
  };

  if (orderNumber) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold">Thank you!</h1>
          <p className="mt-2 text-muted-foreground">Your order <span className="font-semibold text-foreground">{orderNumber}</span> has been placed.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/" onClick={() => window.location.reload()}>Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-semibold mb-6 flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary-deep" /> Checkout
        </h1>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4 rounded-full"><Link to="/shop">Browse plants</Link></Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required maxLength={100} value={form.customer_name} onChange={set("customer_name")} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required maxLength={200} value={form.customer_email} onChange={set("customer_email")} />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" required maxLength={30} value={form.customer_phone} onChange={set("customer_phone")} />
              </div>
              <div>
                <Label htmlFor="addr">Shipping address</Label>
                <Textarea id="addr" required maxLength={500} value={form.shipping_address} onChange={set("shipping_address")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required maxLength={100} value={form.shipping_city} onChange={set("shipping_city")} />
                </div>
                <div>
                  <Label htmlFor="zip">Postal code</Label>
                  <Input id="zip" required maxLength={20} value={form.shipping_postal} onChange={set("shipping_postal")} />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Order notes (optional)</Label>
                <Textarea id="notes" maxLength={500} value={form.notes} onChange={set("notes")} />
              </div>
              <Button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-gradient-primary text-base font-semibold shadow-glow">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Place order · {formatINR(total)}
              </Button>
            </form>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-4">Order summary</h2>
              <ul className="space-y-3 mb-4">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-3">
                    <img src={i.image} alt={i.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-1">{i.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {i.qty}{i.variant ? ` · ${i.variant}` : ""}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatINR(i.unitPrice * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
                <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span className="text-primary-deep">{formatINR(total)}</span></div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
