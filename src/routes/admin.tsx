import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, Upload, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { DbProduct } from "@/hooks/useProducts";
import type { QuickLink } from "@/hooks/useQuickLinks";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { NavigationTab } from "@/components/admin/NavigationTab";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Plantsin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const CATEGORIES = ["Indoor", "Succulent", "Flowering", "Trailing"] as const;
const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-md py-20 text-center">
          <h1 className="font-display text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-muted-foreground">Your account does not have admin privileges.</p>
          <Button asChild className="mt-6 rounded-full"><Link to="/">Back to store</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-semibold mb-6">Admin dashboard</h1>
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="quick-links">Quick Links</TabsTrigger>
            <TabsTrigger value="menu">Menu & Pages</TabsTrigger>
            <TabsTrigger value="settings">Site settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6"><DashboardTab /></TabsContent>
          <TabsContent value="products" className="mt-6"><ProductsTab /></TabsContent>
          <TabsContent value="orders" className="mt-6"><OrdersTab /></TabsContent>
          <TabsContent value="quick-links" className="mt-6"><QuickLinksTab /></TabsContent>
          <TabsContent value="menu" className="mt-6"><NavigationTab /></TabsContent>
          <TabsContent value="settings" className="mt-6"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ───────────────────── Products ─────────────────────

const emptyProduct = {
  name: "",
  additional_info: "",
  slug: "",
  tag: "",
  price: 0,
  old_price: null as number | null,
  rating: 4.5,
  image: "",
  badge: null as string | null,
  category: "Indoor",
  description: "",
  care_light: "",
  care_water: "",
  care_pet_safe: "",
  is_active: true,
  sort_order: 0,
};

function ProductsTab() {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DbProduct> | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems(data as DbProduct[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const onNew = () => { setEditing({ ...emptyProduct }); setOpen(true); };
  const onEdit = (p: DbProduct) => { setEditing(p); setOpen(true); };

  const onDelete = async (p: DbProduct) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  const toggleActive = async (p: DbProduct) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{items.length} products</p>
        <Button onClick={onNew} className="rounded-full"><Plus className="h-4 w-4" /> New product</Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.image && <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{formatINR(Number(p.price))}</TableCell>
                <TableCell>
                  <Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Hidden"}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => toggleActive(p)} aria-label="Toggle active">
                    {p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); refresh(); }} />
    </div>
  );
}

function ProductDialog({
  open, onOpenChange, editing, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Partial<DbProduct> | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<DbProduct>>(emptyProduct);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>([...CATEGORIES]);

  useEffect(() => {
    if (editing) {
      setForm(editing);
      if (editing.category && !categoriesList.includes(editing.category)) {
        setCategoriesList((prev) => [...prev, editing.category!]);
      }
    }
  }, [editing, categoriesList]);

  const set = <K extends keyof DbProduct>(k: K, v: DbProduct[K] | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    set("image", data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const onGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const currentGallery = form.gallery || [];
    if (currentGallery.length + files.length > 4) {
      toast.error("You can only upload up to 4 gallery images");
      return;
    }
    
    setUploading(true);
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `uploads/gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType: file.type });
      if (error) {
        toast.error(`Error uploading ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    
    set("gallery", [...currentGallery, ...newUrls] as never);
    setUploading(false);
    if (newUrls.length > 0) toast.success("Gallery images uploaded");
  };

  const removeGalleryImage = (index: number) => {
    const currentGallery = form.gallery || [];
    const updated = [...currentGallery];
    updated.splice(index, 1);
    set("gallery", updated as never);
  };

  const save = async () => {
    if (!form.name || !form.image || !form.category) {
      toast.error("Name, image, and category are required");
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name!,
      slug: form.slug?.trim() || form.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      tag: form.tag ?? "",
      price: Number(form.price ?? 0),
      old_price: form.old_price ? Number(form.old_price) : null,
      rating: Number(form.rating ?? 4.5),
      image: form.image!,
      badge: form.badge || null,
      category: form.category!,
      description: form.description ?? "",
      additional_info: form.additional_info ?? null,
      care_light: form.care_light ?? "",
      care_water: form.care_water ?? "",
      care_pet_safe: form.care_pet_safe ?? "",
      is_active: form.is_active ?? true,
      sort_order: Number(form.sort_order ?? 0),
      gallery: form.gallery && form.gallery.length > 0 ? form.gallery : null,
    };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); onSaved(); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Name</Label><Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Custom URL Slug (optional)</Label><Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value as never)} placeholder="e.g. snake-plant" /></div>
          <div><Label>Tag</Label><Input value={form.tag ?? ""} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Easy care · Indoor" /></div>
          <div><Label>Category</Label>
            <div className="flex gap-2 mt-1">
              <Select value={form.category ?? "Indoor"} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>{categoriesList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const newCat = window.prompt("Enter new category name:");
                  if (newCat && newCat.trim() !== "") {
                    const trimmed = newCat.trim();
                    if (!categoriesList.includes(trimmed)) {
                      setCategoriesList((prev) => [...prev, trimmed]);
                    }
                    set("category", trimmed as never);
                  }
                }}
                title="Add new category"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div><Label>Price (₹)</Label><Input type="number" step="0.01" value={form.price ?? 0} onChange={(e) => set("price", Number(e.target.value) as never)} /></div>
          <div><Label>Old price (₹, optional)</Label><Input type="number" step="0.01" value={form.old_price ?? ""} onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) as never : null)} /></div>
          <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating ?? 4.5} onChange={(e) => set("rating", Number(e.target.value) as never)} /></div>
          <div><Label>Badge</Label>
            <Select value={form.badge ?? "none"} onValueChange={(v) => set("badge", v === "none" ? null : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="bestseller">Bestseller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Sort order</Label><Input type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value) as never)} /></div>

          <div className="sm:col-span-2">
            <Label>Image</Label>
            <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as typeof imageMode)} className="mt-1">
              <TabsList>
                <TabsTrigger value="url">Paste URL</TabsTrigger>
                <TabsTrigger value="upload">Upload file</TabsTrigger>
              </TabsList>
              <TabsContent value="url">
                <Input placeholder="https://..." value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} />
              </TabsContent>
              <TabsContent value="upload">
                <label className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-4 hover:bg-secondary/40">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">{uploading ? "Uploading..." : "Choose image file"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
                </label>
              </TabsContent>
            </Tabs>
            {form.image && <img src={form.image} alt="preview" className="mt-3 h-24 w-24 rounded-lg object-cover" />}
          </div>

          <div className="sm:col-span-2">
            <Label>Gallery Images (Max 4)</Label>
            <div className="mt-1">
              <label className={`flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-4 hover:bg-secondary/40 ${(form.gallery?.length || 0) >= 4 ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="h-4 w-4" />
                <span className="text-sm">{uploading ? "Uploading..." : "Upload up to 4 images"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onGalleryUpload} disabled={uploading || (form.gallery?.length || 0) >= 4} />
              </label>
            </div>
            {form.gallery && form.gallery.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {form.gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`gallery-${i}`} className="h-20 w-20 rounded-lg object-cover border" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2"><Label>Description (Short)</Label><Textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
          
          <div className="sm:col-span-2">
            <Label>Additional Information (HTML Supported)</Label>
            <p className="text-xs text-muted-foreground mb-2 mt-1">You can use basic HTML here (e.g., &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;br&gt;).</p>
            <Textarea rows={6} value={form.additional_info ?? ""} onChange={(e) => set("additional_info", e.target.value)} placeholder="<b>Plant Name:</b> Anthurium..." />
          </div>
          <div><Label>Light</Label><Input value={form.care_light ?? ""} onChange={(e) => set("care_light", e.target.value)} placeholder="Bright indirect" /></div>
          <div><Label>Water</Label><Input value={form.care_water ?? ""} onChange={(e) => set("care_water", e.target.value)} placeholder="Weekly" /></div>
          <div className="sm:col-span-2"><Label>Pet safe</Label><Input value={form.care_pet_safe ?? ""} onChange={(e) => set("care_pet_safe", e.target.value)} placeholder="Pet safe / Toxic to pets" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────── Orders ─────────────────────

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  notes: string | null;
  subtotal: number;
  status: typeof STATUSES[number];
  created_at: string;
}

function OrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders(data as OrderRow[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id: string, status: OrderRow["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); refresh(); }
  };

  return (
    <div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders yet</TableCell></TableRow>
            ) : orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                </TableCell>
                <TableCell>{formatINR(Number(o.subtotal))}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderRow["status"])}>
                    <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => setOpenId(o.id)}>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetails id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function OrderDetails({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [items, setItems] = useState<{ product_name: string; qty: number; unit_price: number; variant: string | null }[]>([]);
  const [order, setOrder] = useState<OrderRow | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("orders").select("*").eq("id", id).maybeSingle().then(({ data }) => setOrder(data as OrderRow | null));
    supabase.from("order_items").select("product_name, qty, unit_price, variant").eq("order_id", id).then(({ data }) => setItems((data ?? []) as never));
  }, [id]);

  return (
    <Dialog open={!!id} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Order {order?.order_number}</DialogTitle></DialogHeader>
        {order && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-muted-foreground">{order.customer_email}{order.customer_phone ? ` · ${order.customer_phone}` : ""}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_postal}</p>
            </div>
            {order.notes && <div className="rounded-lg border p-3 italic text-muted-foreground">{order.notes}</div>}
            <ul className="divide-y border rounded-lg">
              {items.map((i, idx) => (
                <li key={idx} className="flex justify-between p-3">
                  <div>
                    <p className="font-medium">{i.product_name}</p>
                    <p className="text-xs text-muted-foreground">Qty {i.qty}{i.variant ? ` · ${i.variant}` : ""}</p>
                  </div>
                  <span className="font-semibold">{formatINR(Number(i.unit_price) * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold pt-2 border-t"><span>Subtotal</span><span>{formatINR(Number(order.subtotal))}</span></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────── Settings ─────────────────────

function SettingsTab() {
  const { settings, refresh } = useSiteSettings();
  const [name, setName] = useState(settings.site_name);
  const [logo, setLogo] = useState(settings.logo_url ?? "");
  const [favicon, setFavicon] = useState(settings.favicon_url ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    setName(settings.site_name);
    setLogo(settings.logo_url ?? "");
    setFavicon(settings.favicon_url ?? "");
  }, [settings]);

  const onUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setUploadingLogo(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setLogo(data.publicUrl);
    setUploadingLogo(false);
  };

  const onUploadFavicon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    const ext = file.name.split(".").pop();
    const path = `favicon-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setUploadingFavicon(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setFavicon(data.publicUrl);
    setUploadingFavicon(false);
  };

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_settings").update({ 
      site_name: name, 
      logo_url: logo || null,
      favicon_url: favicon || null 
    }).eq("id", 1);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); refresh(); }
  };

  return (
    <div className="max-w-xl rounded-3xl border bg-card p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">General Settings</h3>
        <div>
          <Label>Site name</Label>
          <Input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Logo</h3>
        <div>
          <Label>Logo URL</Label>
          <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label>Or upload a new logo</Label>
          <label className="mt-1 flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-4 hover:bg-secondary/40 transition-colors">
            <Upload className="h-4 w-4" />
            <span className="text-sm">{uploadingLogo ? "Uploading..." : "Choose image file"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={onUploadLogo} disabled={uploadingLogo} />
          </label>
        </div>
        {logo && (
          <div>
            <Label className="text-muted-foreground text-xs">Preview</Label>
            <img src={logo} alt="logo preview" className="mt-2 h-16 w-16 rounded-full object-cover border bg-white" />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Favicon</h3>
        <div>
          <Label>Favicon URL</Label>
          <Input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="https://..." />
          <p className="text-xs text-muted-foreground mt-1">This is the small icon that appears in the browser tab.</p>
        </div>
        <div>
          <Label>Or upload a new favicon</Label>
          <label className="mt-1 flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-4 hover:bg-secondary/40 transition-colors">
            <Upload className="h-4 w-4" />
            <span className="text-sm">{uploadingFavicon ? "Uploading..." : "Choose image file (.ico, .png)"}</span>
            <input type="file" accept=".ico,.png,.jpg,.jpeg" className="hidden" onChange={onUploadFavicon} disabled={uploadingFavicon} />
          </label>
        </div>
        {favicon && (
          <div>
            <Label className="text-muted-foreground text-xs">Preview</Label>
            <div className="mt-2 h-8 w-8 rounded overflow-hidden border bg-white flex items-center justify-center">
              <img src={favicon} alt="favicon preview" className="max-h-full max-w-full" />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <Button onClick={save} disabled={busy} className="rounded-full w-full sm:w-auto">
          {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save all settings
        </Button>
      </div>
    </div>
  );
}

// ───────────────────── Quick Links ─────────────────────

const emptyQuickLink: Partial<QuickLink> = {
  title: "",
  image_url: "",
  url: "",
  sort_order: 0,
  is_active: true,
};

export function QuickLinksTab() {
  const [items, setItems] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<QuickLink> | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("quick_links").select("*").order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setItems((data || []) as QuickLink[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const onNew = () => { setEditing({ ...emptyQuickLink, sort_order: items.length }); setOpen(true); };
  const onEdit = (q: QuickLink) => { setEditing(q); setOpen(true); };

  const onDelete = async (q: QuickLink) => {
    if (!confirm(`Delete link "${q.title}"?`)) return;
    const { error } = await supabase.from("quick_links").delete().eq("id", q.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  const toggleActive = async (q: QuickLink) => {
    const { error } = await supabase.from("quick_links").update({ is_active: !q.is_active }).eq("id", q.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  const moveOrder = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const current = items[index];
    const swapWith = items[index + direction];
    
    // optimistic UI
    const newItems = [...items];
    newItems[index] = { ...swapWith, sort_order: current.sort_order };
    newItems[index + direction] = { ...current, sort_order: swapWith.sort_order };
    setItems(newItems.sort((a, b) => a.sort_order - b.sort_order));

    await supabase.from("quick_links").update({ sort_order: swapWith.sort_order }).eq("id", current.id);
    await supabase.from("quick_links").update({ sort_order: current.sort_order }).eq("id", swapWith.id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{items.length} quick links</p>
        <Button onClick={onNew} className="rounded-full"><Plus className="h-4 w-4" /> New Link</Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No quick links yet</TableCell></TableRow>
            ) : items.map((q, idx) => (
              <TableRow key={q.id}>
                <TableCell>{q.image_url && <img src={q.image_url} alt={q.title} className="h-10 w-10 rounded-full object-cover" />}</TableCell>
                <TableCell className="font-medium">{q.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{q.url}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => moveOrder(idx, -1)}><ArrowUp className="h-3 w-3" /></Button>
                    <span className="text-sm w-4 text-center">{q.sort_order}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === items.length - 1} onClick={() => moveOrder(idx, 1)}><ArrowDown className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={q.is_active ? "default" : "secondary"}>{q.is_active ? "Active" : "Hidden"}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => toggleActive(q)} aria-label="Toggle active">
                    {q.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(q)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(q)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuickLinkDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); refresh(); }} />
    </div>
  );
}

function QuickLinkDialog({ open, onOpenChange, editing, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; editing: Partial<QuickLink> | null; onSaved: () => void; }) {
  const [form, setForm] = useState<Partial<QuickLink>>(emptyQuickLink);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const set = <K extends keyof QuickLink>(k: K, v: QuickLink[K] | null) => setForm((f) => ({ ...f, [k]: v }));

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `uploads/quicklink-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    set("image_url", data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const save = async () => {
    if (!form.title || !form.image_url || !form.url) {
      toast.error("Title, image, and URL are required");
      return;
    }
    setBusy(true);
    const payload = {
      title: form.title!,
      image_url: form.image_url!,
      url: form.url!,
      sort_order: Number(form.sort_order ?? 0),
      is_active: form.is_active ?? true,
    };
    
    const { error } = form.id
      ? await supabase.from("quick_links").update(payload).eq("id", form.id)
      : await supabase.from("quick_links").insert(payload);
      
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); onSaved(); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{form.id ? "Edit Quick Link" : "New Quick Link"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Indoor Plants" /></div>
          <div><Label>Destination URL</Label><Input value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="e.g. /shop?category=Indoor" /></div>
          
          <div>
            <Label>Icon / Image</Label>
            {form.image_url ? (
              <div className="mt-2 flex items-center gap-4">
                <img src={form.image_url} alt="preview" className="h-16 w-16 rounded-full object-cover border shadow-sm" />
                <Button variant="outline" size="sm" onClick={() => set("image_url", "")}>Remove</Button>
              </div>
            ) : (
              <label className="mt-2 flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-4 hover:bg-secondary/40 transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">{uploading ? "Uploading..." : "Upload image file"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}// ───────────────────── Menu & Pages ─────────────────────

import type { MenuItem } from "@/hooks/useMenuItems";

const emptyMenuItem: Partial<MenuItem> = {
  title: "",
  type: "link",
  url: "/",
  slug: "",
  content: "",
  sort_order: 0,
  is_active: true,
};

function MenuItemsTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("menu_items").select("*").order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setItems((data || []) as MenuItem[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const onNew = () => { setEditing({ ...emptyMenuItem, sort_order: items.length }); setOpen(true); };
  const onEdit = (m: MenuItem) => { setEditing(m); setOpen(true); };

  const onDelete = async (m: MenuItem) => {
    if (!confirm(`Delete "${m.title}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", m.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  const toggleActive = async (m: MenuItem) => {
    const { error } = await supabase.from("menu_items").update({ is_active: !m.is_active }).eq("id", m.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  const moveOrder = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const current = items[index];
    const swapWith = items[index + direction];
    
    // optimistic UI
    const newItems = [...items];
    newItems[index] = { ...swapWith, sort_order: current.sort_order };
    newItems[index + direction] = { ...current, sort_order: swapWith.sort_order };
    setItems(newItems.sort((a, b) => a.sort_order - b.sort_order));

    await supabase.from("menu_items").update({ sort_order: swapWith.sort_order }).eq("id", current.id);
    await supabase.from("menu_items").update({ sort_order: current.sort_order }).eq("id", swapWith.id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{items.length} menu items</p>
        <Button onClick={onNew} className="rounded-full"><Plus className="h-4 w-4" /> New Item</Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No menu items yet</TableCell></TableRow>
            ) : items.map((m, idx) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{m.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {m.type === "link" ? m.url : `/page/${m.slug}`}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => moveOrder(idx, -1)}><ArrowUp className="h-3 w-3" /></Button>
                    <span className="text-sm w-4 text-center">{m.sort_order}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === items.length - 1} onClick={() => moveOrder(idx, 1)}><ArrowDown className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={m.is_active ? "default" : "secondary"}>{m.is_active ? "Active" : "Hidden"}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => toggleActive(m)} aria-label="Toggle active">
                    {m.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MenuItemDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); refresh(); }} />
    </div>
  );
}

function MenuItemDialog({ open, onOpenChange, editing, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; editing: Partial<MenuItem> | null; onSaved: () => void; }) {
  const [form, setForm] = useState<Partial<MenuItem>>(emptyMenuItem);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const set = <K extends keyof MenuItem>(k: K, v: MenuItem[K] | null) => setForm((f) => ({ ...f, [k]: v }));

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const save = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    
    if (form.type === "page" && !form.slug) {
      set("slug", generateSlug(form.title));
    }
    
    if (form.type === "page" && !form.slug && !generateSlug(form.title)) {
      toast.error("Valid slug is required for a page");
      return;
    }

    setBusy(true);
    const payload = {
      title: form.title,
      type: form.type as "link" | "page",
      url: form.type === "link" ? (form.url || "/") : null,
      slug: form.type === "page" ? (form.slug || generateSlug(form.title)) : null,
      content: form.type === "page" ? (form.content || "") : null,
      sort_order: Number(form.sort_order ?? 0),
      is_active: form.is_active ?? true,
    };
    
    const { error } = form.id
      ? await supabase.from("menu_items").update(payload).eq("id", form.id)
      : await supabase.from("menu_items").insert(payload);
      
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); onSaved(); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit Menu Item" : "New Menu Item"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="flex gap-4 mb-2">
            <Button 
              type="button" 
              variant={form.type === "link" ? "default" : "outline"} 
              onClick={() => set("type", "link")}
              className="flex-1"
            >
              Standard Link
            </Button>
            <Button 
              type="button" 
              variant={form.type === "page" ? "default" : "outline"} 
              onClick={() => {
                set("type", "page");
                if (!form.slug && form.title) set("slug", generateSlug(form.title));
              }}
              className="flex-1"
            >
              Custom Page
            </Button>
          </div>
          
          <div><Label>Menu Title *</Label><Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. About Us" /></div>
          
          {form.type === "link" ? (
            <div><Label>URL Destination *</Label><Input value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="e.g. /shop" /></div>
          ) : (
            <>
              <div>
                <Label>Page Slug</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-md border">/page/</span>
                  <Input value={form.slug ?? ""} onChange={(e) => set("slug", generateSlug(e.target.value))} placeholder="about-us" className="flex-1" />
                </div>
              </div>
              <div>
                <Label>Page Content</Label>
                <p className="text-xs text-muted-foreground mb-2">You can use basic HTML here (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;b&gt;).</p>
                <Textarea 
                  rows={10} 
                  value={form.content ?? ""} 
                  onChange={(e) => set("content", e.target.value)} 
                  placeholder="<h2>Our Story</h2><p>Welcome to Plantsin...</p>" 
                  className="font-mono text-sm"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


