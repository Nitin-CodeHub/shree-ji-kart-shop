import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart, end: false },
];

export default function AdminLayout() {
  return (
    <div className="container-shreeji grid gap-8 py-10 lg:grid-cols-[220px,1fr]">
      <aside>
        <h1 className="font-display text-xl font-semibold">Admin</h1>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium",
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
