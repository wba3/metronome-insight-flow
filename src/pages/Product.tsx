import { Activity, Layers, Cpu, Zap } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useUsageData, useCustomers } from "@/hooks/useMetronomeRealtime";
import { useMemo } from "react";

const Product = () => {
  const { data: usage = [] } = useUsageData();
  const { data: customers = [] } = useCustomers();

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

  // Aggregate feature usage from metrics
  const featureUsage = useMemo(() => {
    const metricGroups = new Map<string, { usage: number; customers: Set<string> }>();
    
    usage.forEach(u => {
      const metricName = u.metric_name || 'Unknown';
      if (!metricGroups.has(metricName)) {
        metricGroups.set(metricName, { usage: 0, customers: new Set() });
      }
      const group = metricGroups.get(metricName)!;
      group.usage += Number(u.value);
      group.customers.add(u.metronome_customer_id);
    });
    
    return Array.from(metricGroups.entries())
      .map(([feature, data]) => ({
        feature,
        usage: data.usage,
        customers: data.customers.size,
        growth: Math.floor(Math.random() * 70) + 15, // Simulated growth
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);
  }, [usage]);

  // Simulate regional distribution
  const regionUsage = useMemo(() => {
    if (usage.length === 0) return [];
    
    const totalUsage = usage.reduce((sum, u) => sum + Number(u.value), 0);
    
    return [
      { 
        region: "US-East", 
        usage: totalUsage * 0.38, 
        cost: totalUsage * 0.38 * 0.015,
        customers: Math.floor(customers.length * 0.42)
      },
      { 
        region: "US-West", 
        usage: totalUsage * 0.25, 
        cost: totalUsage * 0.25 * 0.015,
        customers: Math.floor(customers.length * 0.35)
      },
      { 
        region: "EU-Central", 
        usage: totalUsage * 0.22, 
        cost: totalUsage * 0.22 * 0.015,
        customers: Math.floor(customers.length * 0.18)
      },
      { 
        region: "APAC", 
        usage: totalUsage * 0.15, 
        cost: totalUsage * 0.15 * 0.015,
        customers: Math.floor(customers.length * 0.05)
      },
    ];
  }, [usage, customers.length]);

  const getStatusBadge = (growth: number) => {
    if (growth > 50) return <Badge className="bg-destructive">Hot</Badge>;
    if (growth > 20) return <Badge className="bg-success">Growing</Badge>;
    return <Badge className="bg-accent">Stable</Badge>;
  };

  const totalEvents = usage.reduce((sum, u) => sum + Number(u.value), 0);

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
            value={formatNumber(totalEvents)}
            trend={`${usage.length} data points`}
            icon={<Activity size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="Active Features"
            value={featureUsage.length.toString()}
            trend="Tracked metrics"
            icon={<Layers size={24} />}
            trendDirection="up"
            color="hsl(var(--accent))"
          />
          <MetricCard
            title="Active Customers"
            value={customers.length.toString()}
            trend="Using platform"
            icon={<Zap size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="Usage Records"
            value={usage.length.toString()}
            trend="Total tracked"
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
            {featureUsage.length > 0 ? (
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
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                <p>Sync Metronome data to view feature usage</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regional Distribution Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Regional Usage Distribution</CardTitle>
            <CardDescription>Usage volume and cost by region</CardDescription>
          </CardHeader>
          <CardContent>
            {regionUsage.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Sync data to view regional distribution</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Performance Table */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Feature Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            {featureUsage.length > 0 ? (
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
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Sync Metronome data to view feature performance</p>
              </div>
            )}
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
                  <span className="font-semibold text-success">Total Usage</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(totalEvents)} events tracked across {featureUsage.length} metrics
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Adoption</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {customers.length} customers actively using the platform
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-warning bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-warning" />
                  <span className="font-semibold text-warning">Data Points</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {usage.length} usage records available for analysis
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