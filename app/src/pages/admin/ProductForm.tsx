import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/integrations/supabase/types";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    stock: "0",
    category_id: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    if (isNew || !id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setForm({
          title: data.title,
          slug: data.slug,
          description: data.description ?? "",
          price: String(data.price),
          compare_at_price: data.compare_at_price ? String(data.compare_at_price) : "",
          stock: String(data.stock),
          category_id: data.category_id ?? "",
          image_url: data.image_url ?? "",
          is_active: data.is_active,
        });
      });
  }, [id, isNew]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isNew ? "Product created" : "Product updated");
    navigate("/admin/products");
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{isNew ? "New product" : "Edit product"}</h2>
      <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={() => !form.slug && set("slug", slugify(form.title))}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" required value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" min={0} required value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="compare_at_price">Compare-at price (optional)</Label>
            <Input id="compare_at_price" type="number" min={0} value={form.compare_at_price} onChange={(e) => set("compare_at_price", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" min={0} required value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={form.category_id || "none"} onValueChange={(v) => set("category_id", v === "none" ? "" : v)}>
              <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
          <p className="mt-1 text-xs text-muted-foreground">
            Upload to the Supabase Storage "product-images" bucket and paste the public URL here.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
          Visible in shop
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save product"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
