import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader2, Link as LinkIcon, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigation, NavigationCategory, NavigationItem } from "@/hooks/useNavigation";

export function NavigationTab() {
  const { data: categories = [], isLoading, refetch } = useNavigation();
  
  // Category State
  const [catOpen, setCatOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<NavigationCategory> | null>(null);
  
  // Item State
  const [itemOpen, setItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem & { category_id: string }> | null>(null);

  const [saving, setSaving] = useState(false);


  const publishMenu = async () => {
    try {
      const { data: cats } = await supabase.from("navigation_categories").select("*").eq("is_active", true).order("display_order", { ascending: true });
      const { data: items } = await supabase.from("navigation_items").select("*").eq("is_active", true).order("display_order", { ascending: true });
      
      const mapped = (cats || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        display_order: cat.display_order,
        items: (items || []).filter(i => i.category_id === cat.id).map(i => ({
          id: i.id,
          name: i.name,
          url_path: i.url_path,
          display_order: i.display_order
        }))
      }));
      
      await supabase.storage.from('site-assets').upload('menu.json', JSON.stringify(mapped, null, 2), {
        contentType: 'application/json',
        upsert: true
      });
    } catch (e) {
      console.error("Failed to publish static menu", e);
    }
  };

  // --- Category Actions ---
  const saveCategory = async () => {
    if (!editingCat?.name || !editingCat?.slug) return toast.error("Name and Slug are required.");
    setSaving(true);
    const payload = {
      name: editingCat.name,
      slug: editingCat.slug,
      display_order: editingCat.display_order ?? 0,
      is_active: true,
    };

    if (editingCat.id) {
      const { error } = await supabase.from("navigation_categories").update(payload).eq("id", editingCat.id);
      if (error) toast.error(error.message);
      else toast.success("Category updated");
    } else {
      const { error } = await supabase.from("navigation_categories").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Category created");
    }
    
    setSaving(false);
    setCatOpen(false);
    await publishMenu();
    refetch();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete all sub-items too!")) return;
    const { error } = await supabase.from("navigation_categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Category deleted");
      await publishMenu();
      refetch();
    }
  };

  const toggleCategoryStatus = async (id: string, current: boolean) => {
    const { error } = await supabase.from("navigation_categories").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else { await publishMenu(); refetch(); }
  };

  // --- Item Actions ---
  const saveItem = async () => {
    if (!editingItem?.name || !editingItem?.url_path) return toast.error("Name and URL Path are required.");
    setSaving(true);
    const payload = {
      name: editingItem.name,
      url_path: editingItem.url_path,
      category_id: editingItem.category_id,
      display_order: editingItem.display_order ?? 0,
      is_active: true,
    };

    if (editingItem.id) {
      const { error } = await supabase.from("navigation_items").update(payload).eq("id", editingItem.id);
      if (error) toast.error(error.message);
      else toast.success("Item updated");
    } else {
      const { error } = await supabase.from("navigation_items").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Item created");
    }
    
    setSaving(false);
    setItemOpen(false);
    await publishMenu();
    refetch();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this sub-item?")) return;
    const { error } = await supabase.from("navigation_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Item deleted");
      await publishMenu();
      refetch();
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Navigation Menu</h2>
          <p className="text-sm text-muted-foreground">Manage your main header categories and sub-menus.</p>
        </div>
        <Button onClick={() => { setEditingCat({ display_order: categories.length }); setCatOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Main Category
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {categories.map((cat, index) => (
          <AccordionItem key={cat.id} value={cat.id} className="border bg-card rounded-lg px-4 shadow-sm overflow-hidden">
            <div className="flex items-center w-full py-4 gap-4">
              <AccordionTrigger className="flex-1 hover:no-underline py-0 text-left font-semibold text-lg">
                {cat.name}
              </AccordionTrigger>
              <div className="flex items-center gap-2 pr-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditingCat(cat); setCatOpen(true); }}><Pencil className="h-4 w-4 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-600" /></Button>
              </div>
            </div>
            
            <AccordionContent className="pb-4 pt-2">
              <div className="pl-6 border-l-2 ml-2 space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sub-menu Items</h4>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setEditingItem({ category_id: cat.id, display_order: cat.items.length }); setItemOpen(true); }}>
                    <Plus className="h-3 w-3 mr-1" /> Add Link
                  </Button>
                </div>
                
                {cat.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-2">No sub-items yet. The category will just act as a standard link.</p>
                ) : (
                  cat.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-secondary/50 rounded-md p-3 group">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground font-mono mt-1">{item.url_path}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem({ ...item, category_id: cat.id }); setItemOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(item.id)}><Trash2 className="h-3.5 w-3.5 text-red-500/70 hover:text-red-600" /></Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium text-muted-foreground">No Categories Yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Add your first navigation category to build your menu.</p>
          </div>
        )}
      </Accordion>

      {/* Category Dialog */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCat?.id ? "Edit Category" : "Add Main Category"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Category Name</Label>
              <Input value={editingCat?.name ?? ""} onChange={(e) => {
                const name = e.target.value;
                setEditingCat({ ...editingCat, name, slug: !editingCat?.id ? generateSlug(name) : editingCat?.slug });
              }} placeholder="e.g. Plants" />
            </div>
            <div>
              <Label>URL Slug</Label>
              <Input value={editingCat?.slug ?? ""} onChange={(e) => setEditingCat({ ...editingCat, slug: generateSlug(e.target.value) })} placeholder="plants" />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={editingCat?.display_order ?? 0} onChange={(e) => setEditingCat({ ...editingCat, display_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatOpen(false)}>Cancel</Button>
            <Button onClick={saveCategory} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemOpen} onOpenChange={setItemOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem?.id ? "Edit Link" : "Add Sub-menu Link"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Link Title</Label>
              <Input value={editingItem?.name ?? ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} placeholder="e.g. Indoor Plants" />
            </div>
            <div>
              <Label>URL Path</Label>
              <Input value={editingItem?.url_path ?? ""} onChange={(e) => setEditingItem({ ...editingItem, url_path: e.target.value })} placeholder="/shop?category=indoor" />
              <p className="text-xs text-muted-foreground mt-1">Can be a relative path like `/shop` or an absolute URL.</p>
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={editingItem?.display_order ?? 0} onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemOpen(false)}>Cancel</Button>
            <Button onClick={saveItem} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
