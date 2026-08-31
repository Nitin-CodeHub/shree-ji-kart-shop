import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (lines.length === 0) {
    return (
      <div className="container-shreeji py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Nothing to check out</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Browse products</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-shreeji py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Sign in to check out</h1>
        <p className="mt-2 text-muted-foreground">We need an account to save your order and address.</p>
        <Link to="/login?redirect=/checkout" className="mt-4 inline-block">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: address, error: addrError } = await supabase
        .from("addresses")
        .insert({ ...form, user_id: user!.id })
        .select()
        .single();
      if (addrError) throw addrError;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user!.id, total: subtotal, address_id: address.id, status: "pending" })
        .select()
        .single();
      if (orderError) throw orderError;

      const items = lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        title: l.title,
        price: l.price,
        quantity: l.quantity,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) throw itemsError;

      clear();
      toast.success("Order placed! Pay on delivery.");
      navigate("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-shreeji grid gap-10 py-10 lg:grid-cols-[1fr,360px]">
      <form onSubmit={placeOrder} className="space-y-6">
        <h1 className="font-display text-3xl font-semibold">Delivery address</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="line1">Address line 1</Label>
            <Input id="line1" required value={form.line1} onChange={(e) => set("line1", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="line2">Address line 2 (optional)</Label>
            <Input id="line2" value={form.line2} onChange={(e) => set("line2", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" required value={form.state} onChange={(e) => set("state", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" required value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Payment gateway isn't connected yet — orders are placed as pay-on-delivery / pending payment. Ask me to
          wire up Razorpay or Stripe whenever you're ready.
        </p>

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Placing order..." : `Place order · ${formatPrice(subtotal)}`}
        </Button>
      </form>

      <div className="h-fit rounded-md border border-border p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-3">
          {lines.map((l) => (
            <div key={l.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{l.title} × {l.quantity}</span>
              <span>{formatPrice(l.price * l.quantity)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-display text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
