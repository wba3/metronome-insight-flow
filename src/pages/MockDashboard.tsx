import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const [invoiceTimeRange, setInvoiceTimeRange] = useState("current");

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

  const monthlyInvoiceData = [
    { month: "May 2025", total: 58300, apiCalls: 34500, dataProcessing: 12800, compute: 8200, support: 2800 },
    { month: "Jun 2025", total: 59200, apiCalls: 35100, dataProcessing: 13100, compute: 8400, support: 2600 },
    { month: "Jul 2025", total: 61800, apiCalls: 36800, dataProcessing: 13500, compute: 8900, support: 2600 },
    { month: "Aug 2025", total: 62100, apiCalls: 37200, dataProcessing: 13200, compute: 9100, support: 2600 },
    { month: "Sep 2025", total: 64500, apiCalls: 38600, dataProcessing: 13800, compute: 9500, support: 2600 },
    { month: "Oct 2025", total: 66400, apiCalls: 39800, dataProcessing: 14200, compute: 9800, support: 2600 },
  ];

  const calculateMonthlyAverage = () => {
    const sum = monthlyInvoiceData.reduce((acc, month) => acc + month.total, 0);
    return sum / monthlyInvoiceData.length;
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
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-lg sm:text-2xl font-semibold">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs">
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
          <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsageDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="api" className="text-xs sm:text-sm">API Calls</TabsTrigger>
              <TabsTrigger value="data" className="text-xs sm:text-sm">Data</TabsTrigger>
              <TabsTrigger value="compute" className="text-xs sm:text-sm">Compute</TabsTrigger>
            </TabsList>
            <TabsContent value="api" className="mt-0">
              <ResponsiveContainer width="100%" height={250}>
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
              <ResponsiveContainer width="100%" height={250}>
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
              <ResponsiveContainer width="100%" height={250}>
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Commitment Drawdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
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
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Monthly Consumption</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={commitData.monthlyBurn}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill={colors.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t">
            <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Projected Completion</p>
              <p className="text-base sm:text-lg font-semibold">Dec 2025</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Renewal Status</p>
              <Badge variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                On Track
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoiceDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end mb-3 sm:mb-4">
        <Select value={invoiceTimeRange} onValueChange={setInvoiceTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Month</SelectItem>
            <SelectItem value="trailing6">Trailing 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {invoiceTimeRange === "current" ? (
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg font-semibold">Current Invoice</CardTitle>
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">June 2025</p>
                <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(invoiceData.total)}</p>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Invoice Breakdown</h4>
              <ResponsiveContainer width="100%" height={200}>
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
              <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Line Items</h4>
              <div className="space-y-2 sm:space-y-3">
                {invoiceData.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{item.product}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {formatNumber(item.quantity)} × {formatCurrency(item.rate)}
                      </p>
                    </div>
                    <p className="font-semibold text-xs sm:text-base">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-none shadow-md">
              <CardContent className="p-3 sm:p-5">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total (6 Months)
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold">
                    {formatCurrency(monthlyInvoiceData.reduce((acc, m) => acc + m.total, 0))}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    May - October 2025
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="p-3 sm:p-5">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Average Monthly
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold">
                    {formatCurrency(calculateMonthlyAverage())}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                    <TrendingUp className="h-3 w-3" style={{ color: colors.primary }} />
                    <span style={{ color: colors.primary }}>+6.5% growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold">Monthly Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyInvoiceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={11} angle={-45} textAnchor="end" height={80} />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="apiCalls" stackId="a" fill={colors.primary} name="API Calls" />
                  <Bar dataKey="dataProcessing" stackId="a" fill={colors.accent} name="Data Processing" />
                  <Bar dataKey="compute" stackId="a" fill="#B384FF" name="Compute" />
                  <Bar dataKey="support" stackId="a" fill="#FF7A59" name="Support" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold">Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {monthlyInvoiceData.map((month, idx) => (
                  <div key={idx} className="p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-xs sm:text-sm">{month.month}</p>
                      <p className="font-semibold text-sm sm:text-base">{formatCurrency(month.total)}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs">
                      <div>
                        <p className="text-muted-foreground">API Calls</p>
                        <p className="font-medium">{formatCurrency(month.apiCalls)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data</p>
                        <p className="font-medium">{formatCurrency(month.dataProcessing)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Compute</p>
                        <p className="font-medium">{formatCurrency(month.compute)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Support</p>
                        <p className="font-medium">{formatCurrency(month.support)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderCostExplorerDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="products" className="text-xs sm:text-sm">By Product</TabsTrigger>
              <TabsTrigger value="tags" className="text-xs sm:text-sm">By Tag</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-0 space-y-3 sm:space-y-4">
              <ResponsiveContainer width="100%" height={250}>
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
                  <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium text-xs sm:text-sm">{item.product}</span>
                    <Badge variant="outline" className="text-[10px] sm:text-xs" style={{ 
                      borderColor: item.growth > 60 ? colors.primary : colors.accent,
                      color: item.growth > 60 ? colors.primary : colors.accent
                    }}>
                      +{item.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tags" className="mt-0">
              <ResponsiveContainer width="100%" height={250}>
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
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <style>
        {`
          :root {
            --chart-1: ${colors.primary};
            --chart-2: ${colors.accent};
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-1">Customer Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Powered by Metronome • Customer ID: {customerId}
              </p>
            </div>
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default MockDashboard;
