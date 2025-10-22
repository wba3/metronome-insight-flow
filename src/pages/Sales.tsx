import { TrendingUp, Target, Zap, Award } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCommitData, useCustomers } from "@/hooks/useMetronomeRealtime";
import { useMemo } from "react";

const Sales = () => {
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

  // Calculate expansion opportunities
  const expansionOpportunities = useMemo(() => {
    return commits
      .map(commit => {
        const customer = customers.find(c => c.metronome_customer_id === commit.metronome_customer_id);
        const burned = commit.total_amount - commit.remaining_amount;
        const usage = (burned / commit.total_amount) * 100;
        const potential = usage > 140 ? (burned - commit.total_amount) * 1.5 : 0;
        const score = Math.min(100, Math.round(usage * 0.6 + (potential / 1000)));
        
        return {
          company: customer?.name || commit.metronome_customer_id,
          usage: Math.round(usage),
          commitment: 100,
          potential,
          score,
          customerId: commit.metronome_customer_id,
        };
      })
      .filter(opp => opp.usage > 140)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [commits, customers]);

  const totalPipeline = expansionOpportunities.reduce((sum, opp) => sum + opp.potential, 0);
  const avgGrowth = useMemo(() => {
    if (commits.length === 0) return 0;
    const growthRates = commits.map(c => {
      const burned = c.total_amount - c.remaining_amount;
      return ((burned / c.total_amount) * 100) - 100;
    });
    return Math.round(growthRates.reduce((a, b) => a + b, 0) / growthRates.length);
  }, [commits]);

  const getPriorityBadge = (score: number) => {
    if (score > 90) return <Badge className="bg-destructive">HOT</Badge>;
    if (score > 80) return <Badge className="bg-warning">WARM</Badge>;
    return <Badge className="bg-success">COLD</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sales Intelligence</h1>
          <p className="text-muted-foreground text-lg">
            Expansion opportunities and growth signals
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Expansion Pipeline"
            value={formatCurrency(totalPipeline)}
            trend={`${expansionOpportunities.length} hot accounts`}
            icon={<Target size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="Hot Accounts"
            value={expansionOpportunities.length.toString()}
            trend="Over-consuming >40%"
            icon={<Zap size={24} />}
            trendDirection="up"
            color="hsl(var(--warning))"
          />
          <MetricCard
            title="Avg Usage Growth"
            value={`+${avgGrowth}%`}
            trend="Across portfolio"
            icon={<TrendingUp size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="Total Contracts"
            value={commits.length.toString()}
            trend={`${customers.length} customers`}
            icon={<Award size={24} />}
            trendDirection="up"
            color="hsl(var(--accent))"
          />
        </div>

        {/* Expansion Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Top Expansion Opportunities</CardTitle>
            <CardDescription>Customers exceeding commit allocations</CardDescription>
          </CardHeader>
          <CardContent>
            {expansionOpportunities.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={expansionOpportunities.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="company" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold mb-1">{data.company}</p>
                            <p className="text-sm">Usage: <strong>{data.usage}%</strong> of commitment</p>
                            <p className="text-sm">Potential ARR: <strong>{formatCurrency(data.potential)}</strong></p>
                            <p className="text-sm">Priority Score: <strong>{data.score}/100</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="usage" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                <p>Sync Metronome data to see expansion opportunities</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Priority Outreach Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {expansionOpportunities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Account</th>
                      <th className="text-left py-3 px-4 font-semibold">Current Usage</th>
                      <th className="text-left py-3 px-4 font-semibold">Expansion Potential</th>
                      <th className="text-left py-3 px-4 font-semibold">Priority</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expansionOpportunities.map((opp, index) => (
                      <tr key={index} className="border-b border-border hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <strong>{opp.company}</strong>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-success/20 text-success">{opp.usage}%</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <strong>{formatCurrency(opp.potential)}</strong>
                        </td>
                        <td className="py-3 px-4">{getPriorityBadge(opp.score)}</td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="default">Schedule Call</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No expansion opportunities found. Sync Metronome data to see insights.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales Plays */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Sales Plays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">Immediate Action</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {expansionOpportunities.length > 0 
                    ? `${expansionOpportunities[0]?.company} is top priority with ${formatCurrency(expansionOpportunities[0]?.potential)} potential`
                    : 'Sync data to see top opportunities'
                  }
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Pipeline</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(totalPipeline)} total expansion pipeline from {expansionOpportunities.length} accounts
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-warning bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-warning" />
                  <span className="font-semibold text-warning">Active Tracking</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitoring {commits.length} contracts across {customers.length} customers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;