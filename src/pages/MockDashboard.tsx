import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Activity, CreditCard, Calendar } from "lucide-react";

const MockDashboard = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer_id") || "demo";
  const type = searchParams.get("type") || "usage";
  const primary = searchParams.get("primary") || "00A86B";
  const accent = searchParams.get("accent") || "5B5FFF";

  const [colors, setColors] = useState({
    primary: `#${primary}`,
    accent: `#${accent}`,
  });

  useEffect(() => {
    setColors({
      primary: `#${primary}`,
      accent: `#${accent}`,
    });
  }, [primary, accent]);

  // Mock data for different dashboard types
  const usageData = [
    { month: "Jan", api_calls: 45000, data_processed: 320, compute_hours: 1200 },
    { month: "Feb", api_calls: 52000, data_processed: 385, compute_hours: 1450 },
    { month: "Mar", api_calls: 61000, data_processed: 420, compute_hours: 1680 },
    { month: "Apr", api_calls: 58000, data_processed: 395, compute_hours: 1520 },
    { month: "May", api_calls: 71000, data_processed: 485, compute_hours: 1890 },
    { month: "Jun", api_calls: 85000, data_processed: 540, compute_hours: 2100 },
  ];

  const commitData = {
    total: 500000,
    used: 325000,
    remaining: 175000,
    burnRate: 65,
    daysRemaining: 127,
    monthlyBurn: [
      { month: "Jan", amount: 42000 },
      { month: "Feb", amount: 48000 },
      { month: "Mar", amount: 55000 },
      { month: "Apr", amount: 52000 },
      { month: "May", amount: 63000 },
      { month: "Jun", amount: 65000 },
    ],
  };

  const invoiceData = {
    total: 63250,
    lineItems: [
      { product: "API Calls", quantity: 85000, rate: 0.45, amount: 38250 },
      { product: "Data Processing (GB)", quantity: 540, rate: 25, amount: 13500 },
      { product: "Compute Hours", quantity: 2100, rate: 4.5, amount: 9450 },
      { product: "Support (5%)", quantity: 1, rate: 3060, amount: 3060 },
    ],
    breakdown: [
      { name: "API Calls", value: 38250, color: colors.primary },
      { name: "Data Processing", value: 13500, color: colors.accent },
      { name: "Compute", value: 9450, color: "#B384FF" },
      { name: "Support", value: 3060, color: "#FF7A59" },
    ],
  };

  const costExplorerData = {
    byProduct: [
      { product: "API Calls", q1: 132000, q2: 214000, growth: 62 },
      { product: "Data Processing", q1: 95000, q2: 162000, growth: 71 },
      { product: "Compute", q1: 48000, q2: 87000, growth: 81 },
      { product: "Storage", q1: 23000, q2: 35000, growth: 52 },
    ],
    byTag: [
      { name: "Production", value: 425000 },
      { name: "Development", value: 58000 },
      { name: "Staging", value: 35000 },
      { name: "Testing", value: 12000 },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="border-none shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-xs">
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" style={{ color: colors.primary }} />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span style={{ color: trend === "up" ? colors.primary : undefined }}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
            <Icon className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsageDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="API Calls (Jun)"
          value={formatNumber(85000)}
          change="+19.7%"
          icon={Activity}
          trend="up"
        />
        <MetricCard
          title="Data Processed"
          value="540 GB"
          change="+11.3%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Compute Hours"
          value={formatNumber(2100)}
          change="+11.1%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="api">API Calls</TabsTrigger>
              <TabsTrigger value="data">Data Processing</TabsTrigger>
              <TabsTrigger value="compute">Compute Hours</TabsTrigger>
            </TabsList>
            <TabsContent value="api" className="mt-0">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="api_calls" 
                    stroke={colors.primary} 
                    fillOpacity={1} 
                    fill="url(#colorApi)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="data" className="mt-0">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="data_processed" 
                    stroke={colors.accent} 
                    strokeWidth={3}
                    dot={{ fill: colors.accent, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="compute" className="mt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="compute_hours" fill={colors.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommitsDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Commitment"
          value={formatCurrency(commitData.total)}
          icon={CreditCard}
        />
        <MetricCard
          title="Remaining Balance"
          value={formatCurrency(commitData.remaining)}
          change={`${commitData.burnRate}% consumed`}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Days Remaining"
          value={commitData.daysRemaining.toString()}
          change="In contract period"
          icon={Calendar}
          trend="up"
        />
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Commitment Drawdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Usage Progress</span>
              <span className="text-muted-foreground">
                {formatCurrency(commitData.used)} / {formatCurrency(commitData.total)}
              </span>
            </div>
            <Progress value={commitData.burnRate} className="h-3" style={{ 
              //@ts-ignore
              '--progress-background': colors.primary 
            }} />
            <p className="text-xs text-muted-foreground">
              Current burn rate: {formatCurrency(commitData.monthlyBurn[commitData.monthlyBurn.length - 1].amount)}/month
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Monthly Consumption</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={commitData.monthlyBurn}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill={colors.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Projected Completion</p>
              <p className="text-lg font-semibold">Dec 2025</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Renewal Status</p>
              <Badge variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
                On Track
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoiceDashboard = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Current Invoice</CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">June 2025</p>
              <p className="text-2xl font-semibold">{formatCurrency(invoiceData.total)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-4">Invoice Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={invoiceData.breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {invoiceData.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Line Items</h4>
              <div className="space-y-3">
                {invoiceData.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.product}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(item.quantity)} × {formatCurrency(item.rate)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCostExplorerDashboard = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="products">By Product</TabsTrigger>
              <TabsTrigger value="tags">By Tag</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-0 space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costExplorerData.byProduct}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="product" fontSize={11} />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="q1" fill={colors.accent} name="Q1 2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="q2" fill={colors.primary} name="Q2 2025" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                {costExplorerData.byProduct.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-sm">{item.product}</span>
                    <Badge variant="outline" style={{ 
                      borderColor: item.growth > 60 ? colors.primary : colors.accent,
                      color: item.growth > 60 ? colors.primary : colors.accent
                    }}>
                      +{item.growth}% growth
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tags" className="mt-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costExplorerData.byTag}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costExplorerData.byTag.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[colors.primary, colors.accent, "#B384FF", "#FF7A59"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    switch (type) {
      case "usage":
        return renderUsageDashboard();
      case "commits":
        return renderCommitsDashboard();
      case "invoice":
        return renderInvoiceDashboard();
      case "cost-explorer":
        return renderCostExplorerDashboard();
      default:
        return renderUsageDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <style>
        {`
          :root {
            --chart-1: ${colors.primary};
            --chart-2: ${colors.accent};
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Customer Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Powered by Metronome • Customer ID: {customerId}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default MockDashboard;
