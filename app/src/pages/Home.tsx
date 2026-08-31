import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Category } from "@/integrations/supabase/types";

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setProducts(data ?? []));

    supabase
      .from("categories")
      .select("*")
      .limit(6)
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="container-shreeji grid items-center gap-10 py-16 lg:grid-cols-[1.1fr,0.9fr] lg:py-24">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-primary">New season, new picks</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-balance sm:text-5xl">
              Everything for your day, gathered in one kart.
            </h1>
            <p className="mt-5 max-w-md text-secondary-foreground/80">
              Shreeji Kart brings together electronics, fashion and everyday essentials, hand-picked and shipped fast across India.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/shop">
                <Button size="lg">
                  Start shopping <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-md bg-primary/90" />
            <div className="mt-8 aspect-square rounded-md bg-accent" />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-shreeji py-14">
          <h2 className="font-display text-2xl font-semibold">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="flex aspect-square flex-col items-center justify-center rounded-md border border-border bg-card text-center text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-shreeji py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Newly added</h2>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {products === null ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">
            No products yet. Add some from the admin dashboard once you're signed in as an admin.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
