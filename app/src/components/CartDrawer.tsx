import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { lines, subtotal, updateQty, removeItem } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p>Your cart is empty.</p>
            <SheetClose asChild>
              <Link to="/shop" className="text-sm text-primary underline underline-offset-4">
                Browse products
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-muted">
                    {line.image_url && <img src={line.image_url} alt={line.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium">{line.title}</p>
                      <button onClick={() => removeItem(line.productId)} aria-label="Remove item" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-sm border border-input"
                          onClick={() => updateQty(line.productId, line.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-sm">{line.quantity}</span>
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-sm border border-input"
                          onClick={() => updateQty(line.productId, line.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <SheetClose asChild>
                <Link to="/checkout">
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
