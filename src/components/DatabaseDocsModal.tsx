import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  FileCode, 
  Cloud, 
  Server, 
  Layout, 
  Terminal,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface DatabaseDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminPortal: () => void;
}

export const DatabaseDocsModal: React.FC<DatabaseDocsModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'firebase' | 'supabase' | 'cloudstorage' | 'local_run' | 'framer_elementor'>('firebase');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const firebaseRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection: public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders collection: public create (checkout), admin read/update/delete
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}`;

  const firebaseInitCode = `// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "bachpanpk-store.firebaseapp.com",
  projectId: "bachpanpk-store",
  storageBucket: "bachpanpk-store.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);`;

  const supabaseSQL = `-- Supabase PostgreSQL Schema for Bachpan PK - Premium Kids Wear
-- Run in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  sub_category TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_video_reel BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  badge TEXT,
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
  order_notes TEXT,
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

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Everyone can view products
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Anyone can submit an order at checkout
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);

-- Only logged-in admin can read and update orders
CREATE POLICY "Admin Manage Orders" ON orders FOR ALL USING (auth.role() = 'authenticated');`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">
                Backend Architecture & Database Setup Guide
              </h2>
              <p className="text-xs text-slate-400">
                Setup for Firebase, Supabase, Cloud Reels Storage, Local Dev & Elementor/Framer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'firebase'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔥 Firebase Setup
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            ⚡ Supabase (PostgreSQL)
          </button>

          <button
            onClick={() => setActiveTab('cloudstorage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'cloudstorage'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            ☁️ Video Reels Storage Bucket
          </button>

          <button
            onClick={() => setActiveTab('local_run')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'local_run'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            💻 Run Locally
          </button>

          <button
            onClick={() => setActiveTab('framer_elementor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'framer_elementor'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            🎨 Elementor & Framer Guide
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-700 flex-1">
          
          {/* TAB 1: FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <h3 className="font-bold text-amber-950 text-sm mb-1">
                  Why Firebase for Bachpan PK Boutique Real-Time Orders?
                </h3>
                <p className="text-amber-900 text-xs leading-relaxed">
                  Firebase Firestore provides instant real-time websocket synchronization. As soon as a customer hits <strong>Submit Order</strong> on checkout, the Admin table updates instantly with a chime sound and zero refresh needed.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Step 1: Setup Firebase Firestore</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                  <li>Visit <strong>https://console.firebase.google.com</strong> and click <strong>Create a Project</strong>.</li>
                  <li>Click <strong>Firestore Database</strong> in the left sidebar and choose <strong>Create Database</strong>.</li>
                  <li>Select closest region to Pakistan: <code>asia-south1 (Mumbai)</code> or <code>europe-west1</code>.</li>
                  <li>Select Start in Test Mode or paste the Security Rules below.</li>
                </ol>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                  <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
                    <span>firestore.rules</span>
                    <button
                      onClick={() => copyCode(firebaseRules, 'fb_rules')}
                      className="hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'fb_rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'fb_rules' ? 'Copied' : 'Copy Rules'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono overflow-x-auto text-emerald-300">
                    {firebaseRules}
                  </pre>
                </div>

                <h4 className="font-bold text-slate-900 pt-2">Step 2: Client Connection Initialization</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                  <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
                    <span>src/firebase.ts</span>
                    <button
                      onClick={() => copyCode(firebaseInitCode, 'fb_init')}
                      className="hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'fb_init' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'fb_init' ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono overflow-x-auto text-amber-200">
                    {firebaseInitCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <h3 className="font-bold text-emerald-950 text-sm mb-1">
                  Why Supabase?
                </h3>
                <p className="text-emerald-900 text-xs leading-relaxed">
                  Supabase gives you full relational PostgreSQL with SQL queries, relational joins for courier dispatch slips, and built-in Storage buckets for your 9:16 video reels.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Run this in your Supabase SQL Editor:</h4>
                  <button
                    onClick={() => copyCode(supabaseSQL, 'supa_sql')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'supa_sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'supa_sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                  <pre className="p-3 text-[11px] font-mono overflow-x-auto text-emerald-300 max-h-72">
                    {supabaseSQL}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD STORAGE BUCKETS FOR REELS & PHOTOS */}
          {activeTab === 'cloudstorage' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  Storing Product Photos & Video Reels in Cloud Storage Buckets
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When selling in Pakistan, video reels of dresses, footwear, and unboxing clips must start streaming within 300 milliseconds. If you host video files on slow servers, mobile customers on 4G will bounce.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">1. Free Supabase Storage Bucket (Recommended):</h5>
                    <p className="text-slate-600">
                      - In Supabase dashboard, go to <strong>Storage → Create new bucket</strong>.
                      <br />- Name: <code>product-media</code>.
                      <br />- Toggle: <strong>Public Bucket: Enabled</strong>.
                      <br />- Under Policies: Allow authenticated users to upload, public to read.
                      <br />- You will get CDN URLs like: <code>https://xyz.supabase.co/storage/v1/object/public/product-media/chappal-reel.mp4</code>.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">2. Free Cloudinary / Cloudflare R2:</h5>
                    <p className="text-slate-600">
                      - Cloudinary offers automatic video compression and 9:16 vertical crop transcoding on the fly for mobile reels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOCAL RUN INSTRUCTIONS */}
          {activeTab === 'local_run' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  How to Run This Applet Locally on Your PC
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                  <li>Make sure you have <strong>Node.js (version 18 or 20+)</strong> installed from <code>nodejs.org</code>.</li>
                  <li>Download or clone this project repository into a folder on your computer.</li>
                  <li>Open your command prompt (cmd), PowerShell, or Terminal in that folder.</li>
                  <li>
                    Run the dependency installation command:
                    <pre className="bg-slate-900 text-emerald-400 p-2 rounded mt-1 font-mono text-xs">npm install</pre>
                  </li>
                  <li>
                    Start the full-stack server (Express backend + Vite frontend):
                    <pre className="bg-slate-900 text-emerald-400 p-2 rounded mt-1 font-mono text-xs">npm run dev</pre>
                  </li>
                  <li>
                    Open your web browser and navigate to:
                    <pre className="bg-slate-900 text-emerald-400 p-2 rounded mt-1 font-mono text-xs">http://localhost:3000</pre>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: FRAMER & ELEMENTOR GUIDE */}
          {activeTab === 'framer_elementor' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layout className="w-4 h-4 text-purple-600" />
                  How to Edit and Customize with Drag-and-Drop Builders
                </h3>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">Editing with Elementor (WordPress + WooCommerce):</h5>
                    <p>
                      1. In WordPress, install <strong>WooCommerce</strong> and <strong>Elementor Pro</strong>.
                      <br />2. Set currency to <strong>PKR (Rs.)</strong> under WooCommerce → Settings.
                      <br />3. Install the <strong>"Pakistan Cities for WooCommerce"</strong> plugin to populate all 200+ Pakistani tehsils & cities.
                      <br />4. Install <strong>"JazzCash / Easypaisa Gateway"</strong> plugin for instant mobile wallet receipts.
                      <br />5. Use Elementor's drag-and-drop Product Archive and Single Product templates to visually place images, video reels, and COD buttons.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <h5 className="font-bold text-slate-900">Editing with Framer:</h5>
                    <p>
                      1. Open <strong>framer.com</strong> and create a new project.
                      <br />2. Use Framer's Visual Component Canvas to customize hero banners and product cards.
                      <br />3. Add a Custom Code Component for the 9:16 Video Reel player.
                      <br />4. Connect Framer forms to your Supabase or Firebase endpoint using Framer Code Overrides.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Hidden Admin Login: Default credentials <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">admin / Pakistan2026!</code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAdminPortal();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Admin Login</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
