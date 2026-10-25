# Bachpan PK — Premium Kids Wear Platform & Admin Management

A complete, production-grade luxury kids clothing boutique platform specifically engineered for the **Pakistani Market**. Includes customer checkout with PKR (Rs.) pricing, mandatory Pakistani mobile validation (03xx), Cash on Delivery (COD) workflows, Easypaisa/JazzCash wallet payment, 9:16 interactive video reels uploaded directly from PC, and a completely separate, hidden Admin Portal protected by **Two-Way Authentication (2FA / OTP)**.

---

## 🇵🇰 1. Core Pakistani Market Features

### Frontend & Customer Flow
- **PKR Currency (Rs.):** Authentic Pakistani pricing, strike-through original prices, and voucher codes (`AZADI` for 10% off, `WELCOME10`).
- **Media & 9:16 Video Reels:** Upload and showcase product photos and vertical video reels directly from local storage/PC.
- **Cart System:** Slide-over cart drawer with free delivery progress meter (Free shipping over Rs. 2,999; Flat courier rate of Rs. 250 elsewhere).
- **Checkout Form:**
  - Customer Full Name (Required).
  - Mobile Number (Compulsory for call confirmation, validated for Pakistani 11-digit `03xx-xxxxxxx` format).
  - Province & City selection (Karachi, Lahore, Faisalabad, Rawalpindi, Islamabad, Peshawar, Quetta, and 200+ cities).
  - Detailed Street Address & Nearest Famous Landmark for rider convenience.
- **Payment Options:**
  1. **Cash on Delivery (COD)** (Default, most popular in Pakistan).
  2. **Easypaisa / JazzCash / Raast** (Displays official account details and TID/screenshot upload).
  3. **Online Bank Transfer** (Meezan / HBL / Nayapay / Sadapay).
- **Order Confirmation:**
  - Saves order securely to database.
  - Generates unique tracking ID (e.g. `#PK-94821`).
  - Displays required guarantee: *"Thank You! We will call you shortly to confirm your order."*
  - 1-Click WhatsApp Instant Confirmation button pre-populating parcel and address details.

---

## 🔒 2. Secure Admin Panel (Separate & Hidden)

### How to Access the Hidden Admin Panel:
As requested, the Admin Portal is not linked in public customer menus:
1. **Keyboard Shortcut:** Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac) anywhere on the website.
2. **URL Parameter:** Visit `/?admin=true` in your browser.
3. **Discreet Footer Key:** Hover over the copyright area in the footer and click the lock icon labeled "Staff Portal".

### Two-Way Authentication (2FA / OTP):
- **Step 1:** Enter Master Username & Password:
  - Default Username: `admin`
  - Default Password: `Pakistan2026!`
- **Step 2:** Two-Factor Verification (2FA):
  - System generates a 6-digit dynamic OTP (e.g. `849201`).
  - Real-time 60-second expiration timer and live SMS/authenticator dispatcher preview.
  - Enter the code to unlock the Admin Dashboard.

### Admin Dashboard Capabilities:
- **Real-Time Orders Table:** Automatically updates with new customer orders.
- **Fields Displayed:** Order ID, Customer Name, Mobile Number (with direct `tel:` call and WhatsApp verification links), Shipping Address, Landmark, City, Products Ordered, Total (Rs.), Payment Method & Reference.
- **Action Button:** **"Order Confirmed / Proceed to COD"** (instantly updates order status in the database).
- **Courier Logistics Actions:** Advance status to *"Dispatched (TCS/Trax)"*, *"Delivered"*, or *"Cancelled"*.
- **Printable Courier Booking Slip:** Standard courier layout with consignee details and COD payable amount ready for packaging.
- **Catalog & Video Reel Manager:** Add/delete products, upload product videos from PC, configure stock and discount badges.

---

## 🗄️ 3. Backend & Database Setup Guide

### Option A: Supabase (PostgreSQL — Free & Beginner Friendly)

1. Create a free account at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab and execute:

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_video_reel BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  whatsapp_number TEXT,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  nearest_landmark TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 250,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'Pending Confirmation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
```

---

### Option B: Firebase (Firestore NoSQL Database)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Click **Firestore Database** → Create in `asia-south1 (Mumbai)` or `europe-west1` for minimal latency in Pakistan.
3. In the **Rules** tab, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

---

## ☁️ 4. Cloud Storage Bucket Guide for Video Reels

To ensure product video reels play without buffering on Jazz, Zong, and PTCL connections:

1. **Supabase Storage:**
   - In Supabase, click **Storage** → **New Bucket** → Name: `product-media`.
   - Set **Public Bucket** to `ON`.
   - Upload your 9:16 vertical MP4 video files.
   - Use the public URL directly in the product video field.
2. **Firebase Storage:**
   - In Firebase console, enable **Storage**.
   - Set public read rule: `allow read: if true;`.
   - Files are distributed via Google's low-latency edge CDN.

---

## 💻 5. Step-by-Step Local Run Instructions

1. Ensure **Node.js (v18+)** is installed.
2. Open terminal in the project directory:
```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express backend + Vite frontend)
npm run dev
```
3. Open `http://localhost:3000` in your browser.

---

## 🎨 6. Editing Later with Drag-and-Drop (Elementor & Framer)

### WordPress + Elementor:
1. Install WordPress with WooCommerce on Pakistani hosting (e.g., HosterPK).
2. Set currency to **PKR (Rs.)** in WooCommerce settings.
3. Install the *"Pakistan Cities for WooCommerce"* plugin.
4. Install *"JazzCash / Easypaisa Gateway"* plugin.
5. Use Elementor's drag-and-drop Single Product and Checkout templates to customize layouts visually.

### Framer:
1. Create a new layout at [framer.com](https://framer.com).
2. Connect Framer checkout form fields to the Supabase endpoint via code overrides.
3. Embed the vertical 9:16 HTML5 Video player component for instant reel streaming.
