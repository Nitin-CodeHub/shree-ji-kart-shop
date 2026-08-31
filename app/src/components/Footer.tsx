import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-secondary-foreground">
      <div className="container-shreeji grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold">Shreeji Kart</p>
          <p className="mt-3 max-w-xs text-sm text-secondary-foreground/75">
            Everyday essentials and more, picked with care and delivered to your door.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground/60">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop">All products</Link></li>
            <li><Link to="/shop?category=electronics">Electronics</Link></li>
            <li><Link to="/shop?category=fashion">Fashion</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground/60">Account</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/account">My account</Link></li>
            <li><Link to="/login">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground/60">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/75">
            <li>Mon&ndash;Sat, 9am&ndash;7pm</li>
            <li>support@shreejikart.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10 py-5 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} Shreeji Kart. All rights reserved.
      </div>
    </footer>
  );
}
