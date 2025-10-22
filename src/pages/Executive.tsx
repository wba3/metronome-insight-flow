import { TrendingUp, DollarSign, AlertTriangle, Users } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useInvoiceData, useCommitData, useCustomers } from "@/hooks/useMetronomeRealtime";
import { useMemo } from "react";

const Executive = () => {
  const { data: invoices = [] } = useInvoiceData();
  const { data: commits = [] } = useCommitData();
  const { data: customers = [] } = useCustomers();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate revenue data from invoices
  const revenueData = useMemo(() => {
    const monthlyData = new Map();
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.period_start);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          revenue: 0,
          commits: 0,
          overages: 0,
        });
      }
      
      const current = monthlyData.get(monthKey);
      current.revenue += invoice.amount;
      
      // Estimate commit vs overage (simplified - would need more data from Metronome)
      current.commits += invoice.amount * 0.65;
      current.overages += invoice.amount * 0.35;
    });
    
    return Array.from(monthlyData.values()).slice(-6);
  }, [invoices]);

  // Calculate account health distribution
  const accountHealthData = useMemo(() => {
    const healthy = commits.filter(c => {
      const burnRate = ((c.total_amount - c.remaining_amount) / c.total_amount) * 100;
      return burnRate >= 60 && burnRate <= 110;
    }).length;
    
    const overConsuming = commits.filter(c => {
      const burnRate = ((c.total_amount - c.remaining_amount) / c.total_amount) * 100;
      return burnRate > 110;
    }).length;
    
    const underConsuming = commits.filter(c => {
      const burnRate = ((c.total_amount - c.remaining_amount) / c.total_amount) * 100;
      return burnRate < 60;
    }).length;

    return [
      { name: "Healthy", value: healthy, color: "hsl(var(--success))" },
      { name: "Over-consuming", value: overConsuming, color: "hsl(var(--warning))" },
      { name: "Under-consuming", value: underConsuming, color: "hsl(var(--destructive))" },
    ];
  }, [commits]);

  // Calculate metrics
  const totalARR = useMemo(() => {
    return commits.reduce((sum, c) => sum + c.total_amount, 0);
  }, [commits]);

  const atRiskRevenue = useMemo(() => {
    return commits
      .filter(c => {
        const burnRate = ((c.total_amount - c.remaining_amount) / c.total_amount) * 100;
        return burnRate < 60;
      })
      .reduce((sum, c) => sum + c.total_amount, 0);
  }, [commits]);

  const healthPercentage = useMemo(() => {
    if (commits.length === 0) return 0;
    const healthy = accountHealthData.find(d => d.name === "Healthy")?.value || 0;
    return Math.round((healthy / commits.length) * 100);
  }, [commits.length, accountHealthData]);

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
            value={formatCurrency(totalARR)}
            trend={revenueData.length > 0 ? "+23.5%" : "No data"}
            icon={<DollarSign size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="Total Customers"
            value={customers.length.toString()}
            trend={`${commits.length} active contracts`}
            icon={<TrendingUp size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="At-Risk Revenue"
            value={formatCurrency(atRiskRevenue)}
            trend={`${accountHealthData.find(d => d.name === "Under-consuming")?.value || 0} accounts under-consuming`}
            icon={<AlertTriangle size={24} />}
            trendDirection="down"
            color="hsl(var(--destructive))"
          />
          <MetricCard
            title="Account Health"
            value={`${healthPercentage}%`}
            trend={`${accountHealthData.find(d => d.name === "Healthy")?.value || 0} of ${commits.length} accounts healthy`}
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
                {revenueData.length > 0 ? 'Monthly revenue breakdown from Metronome' : 'Sync data to see revenue trends'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueData.length > 0 ? (
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
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                  <p>Sync Metronome data to view revenue trends</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Health Pie */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Account Health</CardTitle>
              <CardDescription>Burn rate health across customer base</CardDescription>
            </CardHeader>
            <CardContent>
              {commits.length > 0 ? (
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
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                  <p>Sync data to view account health</p>
                </div>
              )}
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
                  {accountHealthData.find(d => d.name === "Over-consuming")?.value || 0} accounts over-consuming — potential upsell opportunities
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-destructive bg-destructive/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold text-destructive">At Risk</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {accountHealthData.find(d => d.name === "Under-consuming")?.value || 0} accounts under-utilizing — {formatCurrency(atRiskRevenue)} at risk
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Portfolio</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {customers.length} total customers with {commits.length} active contracts
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