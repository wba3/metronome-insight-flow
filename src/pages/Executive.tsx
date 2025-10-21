import { TrendingUp, DollarSign, AlertTriangle, Users } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 245000, commits: 180000, overages: 65000 },
  { month: "Feb", revenue: 268000, commits: 180000, overages: 88000 },
  { month: "Mar", revenue: 292000, commits: 200000, overages: 92000 },
  { month: "Apr", revenue: 315000, commits: 220000, overages: 95000 },
  { month: "May", revenue: 342000, commits: 240000, overages: 102000 },
  { month: "Jun", revenue: 378000, commits: 260000, overages: 118000 },
];

const accountHealthData = [
  { name: "Healthy", value: 42, color: "hsl(var(--success))" },
  { name: "Over-consuming", value: 12, color: "hsl(var(--warning))" },
  { name: "Under-consuming", value: 8, color: "hsl(var(--destructive))" },
];

const Executive = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Executive Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Portfolio health and revenue metrics
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Annual Recurring Revenue"
            value={formatCurrency(4536000)}
            trend="+23.5%"
            icon={<DollarSign size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="MoM Growth Rate"
            value="23.5%"
            trend="+3.2% vs last month"
            icon={<TrendingUp size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="At-Risk Revenue"
            value={formatCurrency(287000)}
            trend="8 accounts under-consuming"
            icon={<AlertTriangle size={24} />}
            trendDirection="down"
            color="hsl(var(--destructive))"
          />
          <MetricCard
            title="Account Health"
            value="68%"
            trend="42 of 62 accounts healthy"
            icon={<Users size={24} />}
            trendDirection="up"
            color="hsl(var(--accent))"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Revenue Trend & Composition</CardTitle>
              <CardDescription>
                Monthly revenue breakdown showing commit vs overage usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="commits" stackId="a" fill="hsl(var(--primary))" name="Commit Revenue" />
                  <Bar dataKey="overages" stackId="a" fill="hsl(var(--success))" name="Overage Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Account Health Pie */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Account Health</CardTitle>
              <CardDescription>Burn rate health across customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={accountHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accountHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Key Insights & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">Growth Opportunity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  12 accounts are over-consuming by 50%+ — potential for $420K in upsell revenue
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-destructive bg-destructive/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold text-destructive">At Risk</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  8 accounts under-utilizing commits — $287K at risk for non-renewal
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Engagement</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  4 enterprise accounts need renewal conversations in next 30 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Executive;
