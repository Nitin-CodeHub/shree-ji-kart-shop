import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/integrations/supabase/types";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => setProduct(data));
  }, [slug]);

  if (product === undefined) {
    return (
      <div className="container-shreeji grid gap-10 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="container-shreeji py-20 text-center">
        <p className="text-lg font-medium">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Back to shop</Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="container-shreeji grid gap-10 py-10 lg:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-md bg-muted">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>

      <div>
        {outOfStock && <Badge variant="outline" className="mb-3">Out of stock</Badge>}
        <h1 className="font-display text-3xl font-semibold">{product.title}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl font-semibold">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-muted-foreground line-through">{formatPrice(product.compare_at_price as number)}</span>
          )}
        </div>
        {product.description && <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>}

        <div className="mt-8 flex items-center gap-3">
          <div className="flex items-center rounded-sm border border-input">
            <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="w-8 text-center">{qty}</span>
            <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
          </div>
          <Button
            size="lg"
            disabled={outOfStock}
            onClick={() => {
              addItem(product, qty);
              toast.success(`${product.title} added to cart`);
            }}
          >
            Add to cart
          </Button>
        </div>
        {!outOfStock && <p className="mt-3 text-sm text-muted-foreground">{product.stock} in stock</p>}
      </div>
    </div>
  );
}
