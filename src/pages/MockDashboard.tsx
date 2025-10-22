import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar, DollarSign, TrendingUp, Clock } from "lucide-react";

// Mock data for different dashboard types
const mockInvoiceData = [
  { 
    id: "INV-2024-001", 
    date: "2024-01-15", 
    amount: 15420.50, 
    status: "paid",
    period: "Jan 2024"
  },
  { 
    id: "INV-2024-002", 
    date: "2024-02-15", 
    amount: 18650.25, 
    status: "paid",
    period: "Feb 2024"
  },
  { 
    id: "INV-2024-003", 
    date: "2024-03-15", 
    amount: 22100.00, 
    status: "pending",
    period: "Mar 2024"
  },
];

const mockUsageData = [
  { date: "Week 1", api_calls: 125000, compute_hours: 450, storage_gb: 2800 },
  { date: "Week 2", api_calls: 142000, compute_hours: 520, storage_gb: 3100 },
  { date: "Week 3", api_calls: 158000, compute_hours: 580, storage_gb: 3400 },
  { date: "Week 4", api_calls: 176000, compute_hours: 640, storage_gb: 3750 },
];

const mockCommitData = {
  totalCommitment: 500000,
  remainingBalance: 342150,
  burned: 157850,
  burnRate: 31.57,
  daysRemaining: 245,
  monthlyData: [
    { month: "Oct", used: 45000, remaining: 455000 },
    { month: "Nov", used: 52000, remaining: 403000 },
    { month: "Dec", used: 60850, remaining: 342150 },
  ]
};

export default function MockDashboard() {
  const [dashboardType, setDashboardType] = useState<"invoice" | "usage" | "commits_credits">("usage");
  const [customerId, setCustomerId] = useState<string>("");
  const [colorTheme, setColorTheme] = useState<any>({});

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as any;
    const customer = params.get("customer_id");
    const theme = params.get("theme");

    if (type) setDashboardType(type);
    if (customer) setCustomerId(customer);
    if (theme) {
      try {
        setColorTheme(JSON.parse(theme));
      } catch (e) {
        console.error("Failed to parse theme", e);
      }
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      paid: "default",
      pending: "secondary",
      overdue: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status.toUpperCase()}</Badge>;
  };

  const renderInvoiceDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(56170.75)}</div>
            <p className="text-xs text-muted-foreground">Last 3 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(22100.00)}</div>
            <p className="text-xs text-muted-foreground">1 invoice pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Invoice</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 15</div>
            <p className="text-xs text-muted-foreground">Estimated: {formatCurrency(24500)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View your invoices from the last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvoiceData.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.period}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsageDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(601000)}</div>
            <p className="text-xs text-muted-foreground">+18% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compute Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(2190)}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage (GB)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(3750)}</div>
            <p className="text-xs text-muted-foreground">+34% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Trends (Last 30 Days)</CardTitle>
          <CardDescription>Track your consumption across all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="api_calls" stackId="1" stroke="#8884d8" fill="#8884d8" name="API Calls" />
              <Area type="monotone" dataKey="compute_hours" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Compute Hours" />
              <Area type="monotone" dataKey="storage_gb" stackId="3" stroke="#ffc658" fill="#ffc658" name="Storage GB" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommitsDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commitment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockCommitData.totalCommitment)}</div>
            <p className="text-xs text-muted-foreground">Annual contract</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockCommitData.remainingBalance)}</div>
            <p className="text-xs text-muted-foreground">{mockCommitData.burnRate}% utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockCommitData.burned)}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCommitData.daysRemaining}</div>
            <p className="text-xs text-muted-foreground">Until renewal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commitment Burn Rate</CardTitle>
          <CardDescription>Track your commitment utilization over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCommitData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="used" fill="#0EA5E9" name="Used" />
              <Bar dataKey="remaining" fill="#94A3B8" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grant & Deduction History</CardTitle>
          <CardDescription>View your commit and credit activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Initial Commitment</p>
                <p className="text-sm text-muted-foreground">Jan 1, 2024</p>
              </div>
              <p className="text-green-600 font-semibold">+{formatCurrency(500000)}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">October Usage</p>
                <p className="text-sm text-muted-foreground">Oct 31, 2024</p>
              </div>
              <p className="text-red-600 font-semibold">-{formatCurrency(45000)}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">November Usage</p>
                <p className="text-sm text-muted-foreground">Nov 30, 2024</p>
              </div>
              <p className="text-red-600 font-semibold">-{formatCurrency(52000)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">December Usage</p>
                <p className="text-sm text-muted-foreground">Dec 31, 2024</p>
              </div>
              <p className="text-red-600 font-semibold">-{formatCurrency(60850)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {dashboardType === "invoice" && "Invoice Dashboard"}
              {dashboardType === "usage" && "Usage Dashboard"}
              {dashboardType === "commits_credits" && "Commits & Credits Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Customer ID: {customerId || "demo-customer"}
            </p>
          </div>
          <Badge variant="outline">Embeddable Dashboard</Badge>
        </div>

        {dashboardType === "invoice" && renderInvoiceDashboard()}
        {dashboardType === "usage" && renderUsageDashboard()}
        {dashboardType === "commits_credits" && renderCommitsDashboard()}

        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>Powered by Metronome • Mock Dashboard for Development</p>
        </div>
      </div>
    </div>
  );
}
