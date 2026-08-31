import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
        )}
        {onSale && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            Sale
          </Badge>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="outline" className="bg-background">Out of stock</Badge>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary">{product.title}</h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-base font-semibold">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price as number)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant={outOfStock ? "outline" : "secondary"}
            disabled={outOfStock}
            className={cn("h-8 w-8")}
            onClick={() => {
              addItem(product, 1);
              toast.success(`${product.title} added to cart`);
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
