# Metronome GTM Intelligence - Enhanced Dashboard

**Interactive, production-ready dashboards for Go-To-Market teams powered by Metronome's real-time usage and billing data.**

## What's New in This Enhanced Version

This project combines:
- ✅ **Your Beautiful Lovable UI** - Modern design with shadcn/ui, Tailwind, and glassmorphism effects
- ✅ **Metronome API Integration** - Secure backend proxy for all API calls
- ✅ **4 Role-Specific Dashboards** - Executive, Sales, Customer Success, and Product views
- ✅ **TypeScript** - Full type safety across the entire application
- ✅ **React Query** - Efficient data fetching with caching and automatic refetching
- ✅ **Supabase Ready** - Database integration for persistence and caching

## Features by Dashboard

### 🎯 Executive Dashboard
- ARR and growth metrics
- Account health distribution
- Revenue composition (commits vs overages)
- Actionable insights and key metrics

### 💰 Sales Dashboard
- Expansion pipeline tracking
- Hot account identification
- Priority outreach queue
- Usage-driven upsell opportunities

### ❤️ Customer Success Dashboard
- Portfolio health scoring
- Burn rate analysis
- At-risk account detection
- Proactive engagement recommendations

### 📊 Product Dashboard
- Feature usage analytics
- Regional distribution
- Adoption trends
- Growth signal identification

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Your `.env` file is already set up with Supabase. Add your Metronome API key:

```env
METRONOME_API_KEY=your_actual_api_key_here
```

### 3. Start the Application

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev:all
```

**Option B: Run separately in two terminals**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 4. Open Browser

Navigate to: [http://localhost:5173](http://localhost:5173)

The backend API runs on: [http://localhost:3001](http://localhost:3001)

## Project Structure

```
metronome-enhanced/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── Navigation.tsx         # Top navigation bar
│   │   ├── MetricCard.tsx         # Reusable metric cards
│   │   ├── Hero.tsx               # Landing page hero
│   │   ├── CommitDrawdown.tsx     # Commit tracking cards
│   │   ├── UsageChart.tsx         # Usage visualizations
│   │   ├── MetricsCards.tsx       # Overview metrics
│   │   └── FeatureShowcase.tsx    # Feature highlights
│   ├── pages/
│   │   ├── Index.tsx              # Home/landing page
│   │   ├── Executive.tsx          # Executive dashboard
│   │   ├── Sales.tsx              # Sales dashboard
│   │   ├── CustomerSuccess.tsx    # CS dashboard
│   │   ├── Product.tsx            # Product dashboard
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   └── useMetronomeData.ts    # React Query hooks for API
│   ├── integrations/
│   │   └── supabase/              # Supabase client & types
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── App.tsx                    # Main app with routing
├── server/
│   └── index.js                   # Express backend API
├── .env                           # Environment variables
├── package.json
└── vite.config.ts
```

## API Integration

### Using React Query Hooks

The application includes pre-built hooks for all Metronome endpoints:

```typescript
import { useUsageData, useCommitBalances, useGTMAnalytics } from "@/hooks/useMetronomeData";

// In your component
const MyComponent = () => {
  const { data, isLoading, error } = useCommitBalances("customer_123");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return <div>{/* Render data */}</div>;
};
```

### Available Hooks

- `useUsageData(params)` - Fetch granular usage data
- `useInvoiceBreakdown(params)` - Get invoice breakdowns
- `useCommitBalances(customer_id)` - Track commit consumption
- `useGTMAnalytics(customer_id)` - Get calculated analytics
- `useCustomers()` - List all customers
- `useEmbeddableDashboard(params)` - Generate embeddable URLs

## Connecting Real Metronome Data

Currently, the dashboards use mock data for demonstration. To connect real Metronome data:

### Step 1: Add your API key to `.env`

```env
METRONOME_API_KEY=your_actual_api_key
```

### Step 2: Update a dashboard to use real data

Example for Executive dashboard ([src/pages/Executive.tsx](src/pages/Executive.tsx)):

```typescript
import { useCommitBalances, useGTMAnalytics } from "@/hooks/useMetronomeData";

const Executive = () => {
  // Fetch real data
  const { data: balances, isLoading } = useCommitBalances("customer_id_here");
  const { data: analytics } = useGTMAnalytics("customer_id_here");

  if (isLoading) return <div>Loading...</div>;

  // Transform and display real data...
};
```

### Step 3: Transform Metronome data for charts

```typescript
const transformUsageData = (metronomData: any) => {
  return metronomData.map((item: any) => ({
    month: item.month,
    revenue: item.total_amount,
    commits: item.commit_amount,
    overages: item.overage_amount,
  }));
};
```

## Supabase Integration

### Database Schema

Create these tables in your Supabase project to enable data persistence:

```sql
-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  metronome_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage snapshots (cache Metronome data)
CREATE TABLE usage_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  snapshot_date DATE NOT NULL,
  usage_data JSONB NOT NULL,
  revenue NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health scores
CREATE TABLE health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  status TEXT CHECK (status IN ('healthy', 'warning', 'at-risk')),
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Using Supabase in Components

```typescript
import { supabase } from "@/integrations/supabase/client";

// Cache usage data
const cacheUsageSnapshot = async (customerId: string, data: any) => {
  const { error } = await supabase
    .from("usage_snapshots")
    .insert({
      customer_id: customerId,
      snapshot_date: new Date().toISOString(),
      usage_data: data,
    });

  if (error) console.error("Error caching data:", error);
};
```

## Customization

### Brand Colors

Edit [src/index.css](src/index.css):

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --success: 142.1 76.2% 36.3%;
  --warning: 38 92% 50%;
  --destructive: 0 84.2% 60.2%;
}
```

### Add New Metrics

Use the `MetricCard` component:

```typescript
<MetricCard
  title="Custom Metric"
  value="$1.2M"
  trend="+15% MoM"
  icon={<YourIcon size={24} />}
  trendDirection="up"
  color="hsl(var(--primary))"
/>
```

### Add New Charts

All charts use Recharts. Example:

```typescript
import { LineChart, Line, XAxis, YAxis } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={yourData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Line dataKey="value" stroke="hsl(var(--primary))" />
  </LineChart>
</ResponsiveContainer>
```

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel deploy
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL` (your backend URL)

### Backend (Railway/Heroku)

```bash
# Deploy backend separately
cd server
# Set METRONOME_API_KEY in platform dashboard
```

## Development Scripts

```bash
# Run both frontend and backend
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Charts**: Recharts
- **Data Fetching**: TanStack React Query
- **Routing**: React Router v6
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **API**: Metronome REST API

## Troubleshooting

### Backend won't start
- Verify `.env` exists with `METRONOME_API_KEY`
- Check port 3001 is available: `lsof -ti:3001`
- Ensure all dependencies installed: `npm install`

### Frontend can't connect to backend
- Confirm backend is running on port 3001
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS settings in `server/index.js`

### Charts not rendering
- Open browser console (F12) for errors
- Verify data structure matches chart requirements
- Check Recharts is installed: `npm list recharts`

### TypeScript errors
- Run `npm run build` to see all errors
- Check `tsconfig.json` settings
- Ensure all types are imported correctly

## Resources

- **Metronome Docs**: [https://docs.metronome.com](https://docs.metronome.com)
- **API Reference**: [https://docs.metronome.com/api-reference](https://docs.metronome.com/api-reference)
- **shadcn/ui**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **React Query**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **Supabase**: [https://supabase.com/docs](https://supabase.com/docs)

## Next Steps

1. ✅ Add your Metronome API key
2. ✅ Start the application (`npm run dev:all`)
3. ✅ Explore all four dashboards
4. ✅ Connect real Metronome data
5. ✅ Customize colors and branding
6. ✅ Set up Supabase tables
7. ✅ Deploy to production

## Support

For Metronome API questions, contact your account team or visit [docs.metronome.com](https://docs.metronome.com).

---

**Built with Metronome** - The leading usage-based billing platform for modern SaaS companies.
