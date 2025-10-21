import { Heart, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const burnRateData = [
  { week: "W1", expected: 8, actual: 12, remaining: 88 },
  { week: "W2", expected: 16, actual: 22, remaining: 78 },
  { week: "W3", expected: 24, actual: 35, remaining: 65 },
  { week: "W4", expected: 32, actual: 45, remaining: 55 },
  { week: "W5", expected: 40, actual: 58, remaining: 42 },
  { week: "W6", expected: 48, actual: 68, remaining: 32 },
];

const accountHealth = [
  { name: "Acme Corp", health: 92, trend: "up", risk: "low", nextAction: "Quarterly Review" },
  { name: "TechStart Inc", health: 78, trend: "stable", risk: "medium", nextAction: "Usage Check-in" },
  { name: "DataFlow Ltd", health: 45, trend: "down", risk: "high", nextAction: "Urgent: Engagement Plan" },
  { name: "CloudScale", health: 88, trend: "up", risk: "low", nextAction: "Expansion Discussion" },
  { name: "InnovateCo", health: 62, trend: "down", risk: "medium", nextAction: "Training Session" },
];

const CustomerSuccess = () => {
  const getHealthColor = (health: number) => {
    if (health >= 80) return "hsl(var(--success))";
    if (health >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      low: "bg-success/20 text-success",
      medium: "bg-warning/20 text-warning",
      high: "bg-destructive/20 text-destructive",
    };
    return <Badge className={variants[risk]}>{risk.toUpperCase()}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customer Success Hub</h1>
          <p className="text-muted-foreground text-lg">
            Account health and engagement metrics
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Portfolio Health Score"
            value="78/100"
            trend="+5 pts vs last month"
            icon={<Heart size={24} />}
            trendDirection="up"
            color="hsl(var(--success))"
          />
          <MetricCard
            title="At-Risk Accounts"
            value="3"
            trend="Requires immediate attention"
            icon={<AlertCircle size={24} />}
            trendDirection="down"
            color="hsl(var(--destructive))"
          />
          <MetricCard
            title="Healthy & Growing"
            value="42"
            trend="68% of portfolio"
            icon={<CheckCircle size={24} />}
            trendDirection="up"
            color="hsl(var(--accent))"
          />
          <MetricCard
            title="Avg Response Time"
            value="4.2 hrs"
            trend="-1.3 hrs improvement"
            icon={<Clock size={24} />}
            trendDirection="up"
            color="hsl(var(--primary))"
          />
        </div>

        {/* Burn Rate Chart */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Commit Burn Rate Analysis</CardTitle>
            <CardDescription>Expected vs Actual consumption trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={burnRateData}>
                <defs>
                  <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Commit %", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-1">{data.week}</p>
                          <p className="text-sm">Expected: <strong>{data.expected}%</strong></p>
                          <p className="text-sm">Actual: <strong>{data.actual}%</strong></p>
                          <p className="text-sm">Remaining: <strong>{data.remaining}%</strong></p>
                          <p className={`text-sm font-bold ${data.actual > data.expected ? 'text-success' : 'text-destructive'}`}>
                            {data.actual > data.expected ? "Over-consuming" : "Under-consuming"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expectedGradient)"
                  name="Expected Burn"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGradient)"
                  name="Actual Usage"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Account Portfolio Table */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Account Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Account</th>
                    <th className="text-left py-3 px-4 font-semibold">Health Score</th>
                    <th className="text-left py-3 px-4 font-semibold">Trend</th>
                    <th className="text-left py-3 px-4 font-semibold">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold">Next Action</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountHealth.map((account, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <strong>{account.name}</strong>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20">
                            <Progress value={account.health} className="h-2" />
                          </div>
                          <strong style={{ color: getHealthColor(account.health) }}>
                            {account.health}
                          </strong>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xl font-bold">{getTrendIcon(account.trend)}</span>
                      </td>
                      <td className="py-3 px-4">{getRiskBadge(account.risk)}</td>
                      <td className="py-3 px-4 text-sm">{account.nextAction}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="default">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-l-4 border-destructive bg-destructive/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold text-destructive">Critical</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>DataFlow Ltd</strong> health score dropped 23 points — usage down 40% in 2 weeks
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">Opportunity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>CloudScale</strong> exceeding usage by 88% — ideal expansion candidate
                </p>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-accent bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent">Scheduled</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  5 QBRs this week — prepare usage reports and health summaries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSuccess;
