import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderItem } from "@/integrations/supabase/types";

type OrderWithItems = Order & { order_items: OrderItem[] };

const statusVariant: Record<Order["status"], "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  confirmed: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export default function Account() {
  const { user, profile, signOut } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as OrderWithItems[]) ?? []));
  }, [user]);

  if (!user) return null;

  return (
    <div className="container-shreeji py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">My account</h1>
          <p className="text-muted-foreground">{profile?.full_name || user.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            toast.success("Signed out");
          }}
        >
          Sign out
        </Button>
      </div>

      <Separator className="my-8" />

      <h2 className="font-display text-xl font-semibold">Order history</h2>
      {orders === null ? (
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-muted-foreground">You haven't placed any orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-md border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[order.status]} className="capitalize">{order.status}</Badge>
                  <span className="font-display font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {order.order_items.map((item) => (
                  <li key={item.id}>{item.title} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
