import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const usageData = [
  { month: "Jan", usage: 4200, revenue: 42000, commits: 50000 },
  { month: "Feb", usage: 5100, revenue: 51000, commits: 50000 },
  { month: "Mar", usage: 6800, revenue: 68000, commits: 70000 },
  { month: "Apr", usage: 7500, revenue: 75000, commits: 70000 },
  { month: "May", usage: 8900, revenue: 89000, commits: 90000 },
  { month: "Jun", usage: 9200, revenue: 92000, commits: 90000 }
];

const customerHealthData = [
  { week: "Week 1", healthy: 850, warning: 120, risk: 30 },
  { week: "Week 2", healthy: 870, warning: 115, risk: 28 },
  { week: "Week 3", healthy: 890, warning: 110, risk: 25 },
  { week: "Week 4", healthy: 920, warning: 105, risk: 23 }
];

export const UsageChart = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage vs Revenue Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Usage & Revenue Trends</CardTitle>
            <CardDescription>Consumption metrics vs. actual revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorUsage)" 
                  strokeWidth={2}
                  name="Usage Units"
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Health Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Customer Health Distribution</CardTitle>
            <CardDescription>Track account health in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="healthy" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  name="Healthy"
                  dot={{ fill: "hsl(var(--success))", r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="warning" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={3}
                  name="Warning"
                  dot={{ fill: "hsl(var(--warning))", r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  name="At Risk"
                  dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
