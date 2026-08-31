import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-shreeji flex h-16 items-center gap-4">
        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
          Shreeji <span className="text-primary">Kart</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <Link to="/shop?category=electronics" className="hover:text-primary">Electronics</Link>
          <Link to="/shop?category=fashion" className="hover:text-primary">Fashion</Link>
          {isAdmin && <Link to="/admin" className="hover:text-primary">Admin</Link>}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-sm flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-4">
          <Link to={user ? "/account" : "/login"}>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)} aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <form onSubmit={submitSearch} className="my-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." />
          </form>
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/shop?category=electronics" onClick={() => setMenuOpen(false)}>Electronics</Link>
            <Link to="/shop?category=fashion" onClick={() => setMenuOpen(false)}>Fashion</Link>
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          </nav>
        </div>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
