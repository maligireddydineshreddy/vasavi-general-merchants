# 🛒 Vasavi General Merchants — B2B Wholesale Grocery Platform

A production-level React.js frontend for a B2B wholesale grocery ordering platform.

---

## 🚀 HOW TO RUN ON YOUR LAPTOP (Step-by-Step)

### Step 1 — Install Node.js (if not installed)
Go to https://nodejs.org and download the **LTS version**. Install it.
Check it works: open Terminal / Command Prompt and type:
```
node --version
npm --version
```
Both should print version numbers.

---

### Step 2 — Extract the project folder
Unzip `vasavi-general-merchants.zip` anywhere (e.g., Desktop).
You should see a folder called `vasavi`.

---

### Step 3 — Open Terminal in that folder
**Windows:** Right-click inside the `vasavi` folder → "Open in Terminal"
**Mac/Linux:** Open Terminal and type:
```
cd ~/Desktop/vasavi
```

---

### Step 4 — Install dependencies
```
npm install
```
This downloads all packages. Wait 2–3 minutes. You'll see a `node_modules` folder appear.

---

### Step 5 — Start the app
```
npm start
```
Your browser will automatically open **http://localhost:3000**

---

### 🔑 Demo Login Credentials
- **Mobile:** 9876543210
- **Password:** demo123

---

## 🌐 DEPLOY ON VERCEL (Free — Get a public link)

### Step 1 — Create GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Push your project to GitHub
In your terminal (inside the vasavi folder):
```
git init
git add .
git commit -m "Initial commit"
```
Then on GitHub, click "New Repository" → name it `vasavi-merchants` → click Create.
Copy the commands shown and paste in terminal.

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Select your `vasavi-merchants` repo
4. Click **Deploy**
5. Wait 1–2 minutes — you get a FREE public URL like:
   `https://vasavi-merchants.vercel.app`

That's your live website link to share with your college! ✅

---

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Top navigation
│   ├── ProductCard.jsx  # Product display card
│   ├── Notification.jsx # Toast notifications
│   ├── Spinner.jsx      # Loading spinner
│   └── ErrorUI.jsx      # Error state UI
├── pages/               # All application pages
│   ├── LoginPage.jsx    # Auth with glassmorphism
│   ├── HomePage.jsx     # Landing + hero + categories
│   ├── ProductsPage.jsx # Product listing + filters
│   ├── ProductDetailPage.jsx # Detail + bulk calculator
│   ├── CartPage.jsx     # Cart + savings display
│   ├── OrdersPage.jsx   # Order history + tracking
│   └── DashboardPage.jsx # Analytics + charts
├── context/
│   └── AppContext.js    # Global state (cart, auth)
├── data/
│   ├── products.js      # 45 wholesale products
│   └── orders.js        # Mock orders + dashboard data
└── services/
    └── api.js           # API service (mock)
```

## 🎨 Features
- ✅ Glassmorphism login page
- ✅ 45+ wholesale grocery products
- ✅ Live bulk savings calculator
- ✅ Cart with discount display
- ✅ Order tracking with visual steps
- ✅ Dashboard with Recharts
- ✅ Credit system with progress bar
- ✅ Delivery slot selection
- ✅ High Demand / Low Stock badges
- ✅ Fully responsive (mobile + desktop)
- ✅ Search + filter products
