import { Activity, Layers, Cpu, Zap } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

const featureUsage = [
  { feature: "API Calls", usage: 2450000, customers: 58, growth: 23 },
  { feature: "Data Processing", usage: 1890000, customers: 52, growth: 31 },
  { feature: "Storage", usage: 1560000, customers: 61, growth: 18 },
  { feature: "Compute", usage: 1230000, customers: 45, growth: 42 },
  { feature: "AI/ML Inference", usage: 890000, customers: 32, growth: 67 },
];

const regionUsage = [
  { region: "US-East", usage: 3200000, cost: 48000, customers: 42 },
  { region: "US-West", usage: 2100000, cost: 31500, customers: 35 },
  { region: "EU-Central", usage: 1800000, cost: 27000, customers: 28 },
  { region: "APAC", usage: 1200000, cost: 18000, customers: 18 },
];

const Product = () => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (growth: number) => {
    if (growth > 50) return <Badge className="bg-destructive">Hot</Badge>;
    if (growth > 20) return <Badge className="bg-success">Growing</Badge>;
    return <Badge className="bg-accent">Stable</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Product Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Feature usage and adoption insights
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Events"
            value="8.3M"
            trend="+34% MoM"
            icon={<Activity size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="Active Features"
            value="47"
            trend="12 launched this quarter"
            icon={<Layers size={24} />}
            trendDirection="up"
            color="hsl(var(--accent))"
          />
          <MetricCard
            title="Feature Adoption"
            value="78%"
            trend="+13% vs last quarter"
            icon={<Zap size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="Compute Hours"
            value="1.2M"
            trend="42% growth rate"
            icon={<Cpu size={24} />}
            trendDirection="up"
            color="hsl(var(--warning))"
          />
        </div>

        {/* Feature Usage Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Feature Usage & Growth</CardTitle>
            <CardDescription>Usage volume and growth rate by feature</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart
                data={featureUsage}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-1">{data.feature}</p>
                          <p className="text-sm">Usage: <strong>{formatNumber(data.usage)}</strong> events</p>
                          <p className="text-sm">Customers: <strong>{data.customers}</strong></p>
                          <p className="text-sm">Growth: <strong>+{data.growth}%</strong> MoM</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="usage" fill="hsl(var(--primary))" name="Usage Volume" />
                <Bar dataKey="growth" fill="hsl(var(--success))" name="Growth %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Regional Usage Distribution</CardTitle>
            <CardDescription>Usage volume and cost by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={formatNumber}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val) => `$${val / 1000}K`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-1">{data.region}</p>
                          <p className="text-sm">Usage: <strong>{formatNumber(data.usage)}</strong> events</p>
                          <p className="text-sm">Cost: <strong>{formatCurrency(data.cost)}</strong></p>
                          <p className="text-sm">Customers: <strong>{data.customers}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="usage" fill="hsl(var(--accent))" name="Usage Volume" />
                <Bar yAxisId="right" dataKey="cost" fill="hsl(var(--success))" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Performance Table */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Feature Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Usage</th>
                    <th className="text-left py-3 px-4 font-semibold">Active Customers</th>
                    <th className="text-left py-3 px-4 font-semibold">MoM Growth</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {featureUsage.map((feature, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <strong>{feature.feature}</strong>
                      </td>
                      <td className="py-3 px-4">{formatNumber(feature.usage)}</td>
                      <td className="py-3 px-4">{feature.customers}</td>
                      <td className="py-3 px-4">
                        <Badge className={
                          feature.growth > 30 ? "bg-success/20 text-success" :
                          feature.growth > 15 ? "bg-warning/20 text-warning" :
                          "bg-accent/20 text-accent"
                        }>
                          +{feature.growth}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(feature.growth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Product Insights */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Product Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">High Growth</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>AI/ML Inference</strong> growing 67% MoM — consider dedicated pricing tier
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Adoption</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>78% feature adoption</strong> — 12 new features launched with strong uptake
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-warning bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-warning" />
                  <span className="font-semibold text-warning">Regional</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>US-East</strong> accounts for 38% of usage — potential single region dependency
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Product;
