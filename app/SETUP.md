# Shreeji Kart — setup guide

## 1. Install dependencies

```sh
npm i
```

## 2. Connect Supabase

1. In your Supabase project dashboard, go to **Project Settings → API** and copy the **Project URL** and **anon public** key.
2. Copy the env template and fill it in:
   ```sh
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
   ```

## 3. Run the database migration

Open your Supabase project's **SQL Editor** and run the contents of
`supabase/migrations/0001_init.sql`. This creates:

- `profiles`, `categories`, `products`, `addresses`, `orders`, `order_items`
- Row Level Security policies (customers only ever see their own data; admins
  get elevated read/write access via `profiles.role = 'admin'`)
- A trigger that auto-creates a `profiles` row whenever someone signs up
- A public `product-images` storage bucket (public read, admin-only write)
- A couple of seed categories/products so the site isn't empty on first run

(If you use the Supabase CLI locally instead: `supabase db push`.)

## 4. Make yourself an admin

1. Sign up for an account through the running app (`/signup`).
2. In the Supabase dashboard, go to **Authentication → Users** and copy your user's UUID.
3. In the SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-user-uuid>';
   ```
4. Refresh the app — you'll now see an **Admin** link in the nav, and
   `/admin` will let you manage products and orders.

## 5. Run the app

```sh
npm run dev
```

## What's included

- **Storefront**: home page, category browsing, search + sort, product detail, cart, checkout (address capture, order placed as pending/pay-on-delivery)
- **Auth**: email/password sign up & sign in via Supabase Auth, session persisted automatically
- **Account**: profile summary, order history
- **Admin dashboard**: stats overview, product CRUD (with image URL field — upload images to the `product-images` bucket and paste the public URL), order list with status updates

## Not included yet (ask if you want these added)

- Payment gateway (Razorpay/Stripe) — checkout currently places orders as pay-on-delivery/pending
- Direct image upload UI (currently takes an image URL — pair it with the Supabase Storage bucket already created)
- Product reviews, wishlists, coupons/discounts
- Email notifications on order status change
