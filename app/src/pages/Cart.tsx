import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { lines, subtotal, updateQty, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-shreeji py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container-shreeji grid gap-10 py-10 lg:grid-cols-[1fr,360px]">
      <div>
        <h1 className="font-display text-3xl font-semibold">Your cart</h1>
        <div className="mt-6 divide-y divide-border">
          {lines.map((line) => (
            <div key={line.productId} className="flex gap-4 py-5">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-muted">
                {line.image_url && <img src={line.image_url} alt={line.title} className="h-full w-full object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium">{line.title}</p>
                  <button onClick={() => removeItem(line.productId)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-sm border border-input">
                    <button className="px-2 py-1" onClick={() => updateQty(line.productId, line.quantity - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button className="px-2 py-1" onClick={() => updateQty(line.productId, line.quantity + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-display font-semibold">{formatPrice(line.price * line.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-md border border-border p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-display text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link to="/checkout">
          <Button size="lg" className="mt-6 w-full">Proceed to checkout</Button>
        </Link>
      </div>
    </div>
  );
}
