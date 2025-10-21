# Getting Started - Metronome GTM Intelligence

## ✅ Integration Complete!

Your Lovable project has been successfully enhanced with comprehensive GTM dashboards and Metronome API integration.

## 🎉 What's Ready

### ✅ 4 Production-Ready Dashboards
1. **Executive Dashboard** (`/executive`) - Portfolio health, ARR, revenue trends
2. **Sales Dashboard** (`/sales`) - Expansion pipeline, hot accounts, upsell opportunities
3. **Customer Success Dashboard** (`/customer-success`) - Health scores, burn rates, at-risk accounts
4. **Product Dashboard** (`/product`) - Feature adoption, regional usage, growth signals

### ✅ Complete Tech Stack
- ✨ Your beautiful Lovable UI (shadcn/ui + Tailwind)
- 🔐 Secure Express backend with Metronome API integration
- ⚡ React Query for efficient data fetching
- 🎯 TypeScript for type safety
- 🗄️ Supabase ready for data persistence
- 📊 Recharts for beautiful visualizations

### ✅ Infrastructure
- Navigation with active state indicators
- Reusable MetricCard component
- React Query hooks for all Metronome endpoints
- Environment variables configured
- Backend API proxy for security

## 🚀 Launch Your Dashboard (3 Steps)

### Step 1: Add Your Metronome API Key

Edit `.env` file:
```env
METRONOME_API_KEY=your_actual_api_key_here
```

Get your API key from: Metronome Dashboard → Settings → API Keys

### Step 2: Start the Application

**Easy Mode (One Command)**:
```bash
npm run dev:all
```

**Manual Mode (Two Terminals)**:

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run dev
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:5173**

## 🎯 Demo Flow

1. **Home Page** (`/`) - Your existing Lovable landing page with hero, metrics, and features
2. **Executive** - Click "Executive" in navigation → See ARR, health, revenue charts
3. **Sales** - Click "Sales" → View expansion opportunities and hot accounts
4. **Customer Success** - Click "Customer Success" → Monitor health scores and burn rates
5. **Product** - Click "Product" → Analyze feature adoption and regional usage

## 📁 Project Structure

```
metronome-enhanced/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx         ← NEW: Top nav bar
│   │   ├── MetricCard.tsx         ← NEW: Reusable metric cards
│   │   ├── Hero.tsx               ← Your existing component
│   │   ├── CommitDrawdown.tsx     ← Your existing component
│   │   └── [other components]
│   ├── pages/
│   │   ├── Index.tsx              ← Your existing home page
│   │   ├── Executive.tsx          ← NEW: Executive dashboard
│   │   ├── Sales.tsx              ← NEW: Sales dashboard
│   │   ├── CustomerSuccess.tsx    ← NEW: CS dashboard
│   │   └── Product.tsx            ← NEW: Product dashboard
│   ├── hooks/
│   │   └── useMetronomeData.ts    ← NEW: React Query hooks
│   └── App.tsx                    ← Updated with routing
├── server/
│   └── index.js                   ← NEW: Backend API
└── .env                           ← Updated with Metronome config
```

## 🔌 Connecting Real Metronome Data

### Current State: Mock Data
All dashboards currently use mock data for demonstration purposes. This lets you:
- Demo immediately without API keys
- Show prospects before connecting their data
- Test layouts and interactions

### Connecting Real Data

1. **Add API Key** (already done if you followed Step 1):
   ```env
   METRONOME_API_KEY=your_key
   ```

2. **Use React Query Hooks** in any dashboard:
   ```typescript
   import { useCommitBalances } from "@/hooks/useMetronomeData";

   const MyDashboard = () => {
     const { data, isLoading } = useCommitBalances("customer_id");

     if (isLoading) return <div>Loading...</div>;

     // Use real data...
   };
   ```

3. **Available Hooks**:
   - `useUsageData(params)` - Usage metrics
   - `useCommitBalances(customer_id)` - Commit tracking
   - `useGTMAnalytics(customer_id)` - Calculated analytics
   - `useCustomers()` - Customer list
   - `useInvoiceBreakdown(params)` - Invoice data

## 🎨 Customization

### Change Brand Colors

Edit `src/index.css`:
```css
:root {
  --primary: YOUR_PRIMARY_COLOR;
  --secondary: YOUR_SECONDARY_COLOR;
  /* Update other colors */
}
```

### Modify Mock Data

Each dashboard has mock data at the top of the file. Example in `src/pages/Executive.tsx`:
```typescript
const revenueData = [
  { month: "Jan", revenue: 245000, ... },
  // Update with your demo data
];
```

### Add New Metrics

Use the `MetricCard` component:
```typescript
<MetricCard
  title="Your Metric"
  value="$1.2M"
  trend="+15%"
  icon={<YourIcon size={24} />}
  trendDirection="up"
  color="hsl(var(--success))"
/>
```

## 🗄️ Supabase Setup (Optional)

To enable data persistence and caching:

1. **Create Tables** in Supabase dashboard:
   ```sql
   -- See README_ENHANCED.md for full schema
   CREATE TABLE customers (...);
   CREATE TABLE usage_snapshots (...);
   CREATE TABLE health_scores (...);
   ```

2. **Use in Components**:
   ```typescript
   import { supabase } from "@/integrations/supabase/client";

   const { data } = await supabase
     .from("customers")
     .select("*");
   ```

## 🐛 Troubleshooting

### "Cannot find module '@/components/Navigation'"
- TypeScript path alias issue
- Fix: Restart dev server (`npm run dev`)

### "Port 3001 already in use"
- Another process is using port 3001
- Fix: `lsof -ti:3001 | xargs kill` then restart

### "Failed to fetch usage data"
- Backend not running or API key invalid
- Fix: Check backend is running and `.env` has valid key

### Charts not showing
- Check browser console (F12) for errors
- Verify data structure matches chart requirements

## 📚 Key Files to Understand

1. **`src/App.tsx`** - Routing setup
2. **`src/components/Navigation.tsx`** - Top navigation bar
3. **`src/pages/Executive.tsx`** - Example dashboard structure
4. **`src/hooks/useMetronomeData.ts`** - API integration hooks
5. **`server/index.js`** - Backend API endpoints
6. **`.env`** - Configuration

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

Add environment variables in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL` (your backend URL)

### Backend (Railway/Heroku)
Deploy `server/index.js` separately and set `METRONOME_API_KEY` environment variable.

## 📖 Additional Resources

- **Full Documentation**: See `README_ENHANCED.md`
- **Integration Plan**: See `INTEGRATION_PLAN.md` (in parent directory)
- **Demo Script**: See `DEMO_SCRIPT.md` (in parent directory)
- **Metronome Docs**: https://docs.metronome.com

## ✨ What Makes This Special

1. **Best of Both Worlds**
   - Your polished Lovable UI
   - Comprehensive GTM analytics
   - Production-ready code

2. **Type-Safe**
   - Full TypeScript coverage
   - Better developer experience
   - Fewer runtime errors

3. **Performant**
   - React Query caching
   - Optimistic updates
   - Smart refetching

4. **Secure**
   - API keys in backend only
   - CORS configured
   - No client-side secrets

5. **Extensible**
   - Reusable components
   - Clean architecture
   - Easy to customize

## 🎯 Next Actions

1. ✅ Run `npm run dev:all`
2. ✅ Explore all dashboards
3. ✅ Customize with your branding
4. ✅ Add real Metronome data
5. ✅ Set up Supabase tables
6. ✅ Deploy to production
7. ✅ Demo to prospects!

## 🤝 Need Help?

- **Metronome API**: Contact your account team
- **Technical Issues**: Check `README_ENHANCED.md` troubleshooting section
- **Customization**: Reference component examples in each dashboard

---

**You're ready to showcase Metronome's power!** 🚀

Start with: `npm run dev:all`
