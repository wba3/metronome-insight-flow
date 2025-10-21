import { TrendingUp, Target, Zap, Award } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const expansionOpportunities = [
  { company: "Acme Corp", usage: 185, commitment: 100, potential: 85000, score: 95 },
  { company: "TechStart Inc", usage: 165, commitment: 100, potential: 65000, score: 88 },
  { company: "DataFlow Ltd", usage: 142, commitment: 100, potential: 42000, score: 78 },
  { company: "CloudScale", usage: 178, commitment: 100, potential: 78000, score: 92 },
  { company: "InnovateCo", usage: 156, commitment: 100, potential: 56000, score: 82 },
];

const Sales = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPipeline = expansionOpportunities.reduce((sum, opp) => sum + opp.potential, 0);

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
            trend="+$127K this month"
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
            value="+35%"
            trend="MoM across portfolio"
            icon={<TrendingUp size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
          <MetricCard
            title="Win Rate Impact"
            value="89%"
            trend="Usage data in demos"
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
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={expansionOpportunities}
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
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Priority Outreach Queue</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <strong>Acme Corp</strong> is at 185% usage — schedule upsell call this week for $85K expansion
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Emerging</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>3 accounts</strong> showing 60%+ MoM growth — early indicator of expansion needs
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-warning bg-warning/5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-warning" />
                  <span className="font-semibold text-warning">Renewal Risk</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>2 accounts</strong> below 30% usage — proactive engagement needed before renewal
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
