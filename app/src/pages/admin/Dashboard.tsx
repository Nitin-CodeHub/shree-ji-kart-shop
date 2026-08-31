import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [stats, setStats] = useState<{ products: number; orders: number; revenue: number; pending: number } | null>(null);

  useEffect(() => {
    async function load() {
      const [{ count: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total,status"),
      ]);
      const revenue = (orders ?? []).reduce((sum, o) => sum + o.total, 0);
      const pending = (orders ?? []).filter((o) => o.status === "pending").length;
      setStats({ products: products ?? 0, orders: orders?.length ?? 0, revenue, pending });
    }
    load();
  }, []);

  const cards = [
    { label: "Total products", value: stats?.products ?? "—" },
    { label: "Total orders", value: stats?.orders ?? "—" },
    { label: "Pending orders", value: stats?.pending ?? "—" },
    { label: "Revenue", value: stats ? formatPrice(stats.revenue) : "—" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
