# 🫧 Bubbles | Play & Learn Co. Sri Lanka
### Curated Montessori & Developmental Play Boxes (Ages 0–5)

A modern, responsive e-commerce web platform for **Bubbles**, designed specifically for the Sri Lankan market based on the E&J developmental toy market research and local pricing model.

---

## 🌟 Key Features

1. **Dedicated "Shop by Age" Category (5 Groups)**:
   - **🍼 0–1 years**: Sensory, grasping, auditory rattles, high contrast books & tummy time.
   - **🌱 1–2 years**: Push-pull bullock carts, wooden farm animals, coin drop box & threading beads.
   - **🧩 2–3 years**: E&J milestone problem solvers, interlocking elephant puzzles, math counters & beeswax crayons.
   - **🚀 3–4 years**: Little Maker STEAM, magnetic vehicle tracks, fossil excavation & spatial logic boards.
   - **🎓 5 years and above**: Kindergarten readiness, sandpaper phonics, Sri Lanka flag activity, 120pc magnetic tiles & electronic snap circuits.
   - Interactive visual cards with 1-click filtering, milestone checklists, and dynamic catalog syncing.

2. **Signature Curated Stage Boxes (LKR 5,200 – 6,900)**:
   - **0–1Y The Little Senses Box**: Gentle stimulation, grasping & auditory bonding.
   - **1–2Y The Wonder Explorer Box**: Cause & effect, first stacking & spatial discovery.
   - **2–3Y The Milestone Discoverer Box**: Direct formula from E&J research (Puzzle + Counting toy + Shape/colour sorter + Fine-motor activity + Art activity + Small learning book).
   - **3–4Y The Little Maker STEAM Box**: Magnetism, mechanics, color theory & logic.
   - **5Y+ School-Ready & Advanced STEAM Box**: Phonics, sandpaper letters, national flag activity & circuit engineering.

2. **Interactive "Build Your Own Bubbles Box" (5–7 Items)**:
   - Step 1: Select child's developmental age milestone and enter child's name for personalized packaging.
   - Step 2: Handpick 5 to 7 developmental toys across curated categories.
   - Step 3: Live 7-slot visual box visualizer, automatic bundle discount calculation (LKR 5,500 for 5 items, LKR 6,000 for 6 items, LKR 6,500 for 7 items), and 1-click cart addition.

3. **Handcrafted Sri Lankan Wooden & Montessori Toy Store**:
   - 30+ authentic items from the business research with verified Sri Lankan Rupee (LKR / Rs.) prices.
   - Artisanal local wooden toys (Elephant puzzles, Bullock carts, Dinosaurs, Rockers, English alphabet blocks).
   - Category filtering (Wooden Local, Montessori, Sensory, STEAM & Math, Language, Arts & Fine Motor, Newborn).
   - Real-time search and age filter dropdowns.
   - Quick View modal with developmental milestone benefits and materials breakdown.
   - Interactive Wishlist favorites system.

4. **Parent Milestone & Developmental Quiz**:
   - 4-step wizard assessing age, primary developmental priority, preferred materials, and playtime philosophy.
   - Calculates personalized developmental match (e.g. 98% match) with recommended stage box.

5. **Sri Lankan Parent Research Survey & Early Access Hub**:
   - Implements the research recommendation to survey parents regarding willingness to pay at LKR 4,000 / 5,000 / 6,000 / 7,500.
    - Interactive live community willingness-to-pay insights.

6. **Slide-Over Basket & Sri Lanka Islandwide Checkout**:
   - Free shipping progress bar (Free delivery over LKR 8,000; flat LKR 450 otherwise).
   - Eco-kraft gift wrapping toggle (+LKR 350).
   - Islandwide shipping to all 25 districts of Sri Lanka.
   - Flexible payment options: Cash on Delivery (COD), Direct Bank Transfer / FriMi / Genie, and Card / Koko Pay simulator.
   - Instant printable order invoice receipt and direct WhatsApp confirmation integration (+94 77 988 2000).

7. **Supabase Cloud Order Processing & Storefront Sync**:
   - Cloud database persistence in PostgreSQL `orders` table.
   - Resilient multi-tier fallback: automatic schema column fallback, minimal insert recovery, and persistent browser storage backups.
   - Realtime order synchronization and instant WhatsApp order fallback.

8. **Authenticated Admin Portal (`/admin` / `admin.html`)**:
   - Supabase Auth email/password login + instant API key direct dashboard access.
   - KPI metrics: Total Orders, Pending Fulfillment, In Transit / Courier, Delivered, Total Sales (LKR).
   - Real-time search, status filtering, and live fulfillment updater (`Pending` → `Packed` → `Handed to Courier` → `Delivered`).
   - One-click customer WhatsApp messaging with pre-filled order status notifications.
   - Detailed itemization popovers and in-browser Supabase credentials manager.

---

## 🚀 How to Run Locally

### Option 1: Using the Included Node Server
From PowerShell or terminal in this folder:
```powershell
agy-node.cmd server.js
```
Then open your browser to: **`http://localhost:3000`** (or **`http://localhost:3000/admin.html`** for Admin Portal).

### Option 2: Direct File Open
You can also directly double-click **`index.html`** or **`admin.html`** in any modern web browser.

---

## 📁 Project Structure

```
bubbles/
├── index.html              # Main single-page application structure & semantic markup
├── admin.html              # Authenticated Admin Dashboard & fulfillment manager
├── supabase-schema.sql     # PostgreSQL database schema, RLS policies & grants
├── vercel.json             # Vercel production edge routing & clean URL config
├── css/
│   ├── main.css            # Base design tokens, warm pastel palette, typography
│   ├── components.css      # Header, Hero, Cards, Box Builder, Cart, Modals
│   ├── responsive.css      # Mobile, tablet, and desktop responsive optimizations
│   └── admin.css           # Admin Portal design system and responsive tables
├── js/
│   ├── products.js         # Complete catalog & curated box data in LKR
│   ├── app.js              # Application state, routing/filtering, search, toasts
│   ├── box-builder.js      # Interactive 5-7 item custom box builder
│   ├── quiz.js             # 4-step developmental stage quiz
│   ├── cart.js             # Slide-over cart, promo codes, islandwide checkout
│   ├── survey.js           # Parent research survey & live chart visualizer
│   └── supabase-client.js  # Supabase JS client, orders service & admin auth
├── server.js               # Zero-dependency local Node.js static web server
├── test-server.js          # Endpoint test script (20/20 endpoints verified)
├── test-logic.mjs          # Core business logic & order pipeline unit tests
└── README.md               # Documentation & user guide
```
