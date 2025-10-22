import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCustomers } from "@/hooks/useMetronomeRealtime";
import { useEmbeddableDashboard } from "@/hooks/useMetronomeData";
import { toast } from "sonner";

type DashboardType = "invoice" | "usage" | "commits_credits";

const DASHBOARD_TYPES: { value: DashboardType; label: string; description: string }[] = [
  { 
    value: "invoice", 
    label: "Invoice Dashboard", 
    description: "View current and historical invoices (draft, finalized, voided) up to 90 days old" 
  },
  { 
    value: "usage", 
    label: "Usage Dashboard", 
    description: "Shows usage metrics for the past 30, 60, or 90 days" 
  },
  { 
    value: "commits_credits", 
    label: "Commits & Credits Dashboard", 
    description: "View current and historical commit and credit grants, balances, and access schedules" 
  },
];

export default function EmbeddableDashboard() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedDashboardType, setSelectedDashboardType] = useState<DashboardType>("usage");
  const [shouldFetchDashboard, setShouldFetchDashboard] = useState(false);

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  
  const { 
    data: dashboardData, 
    isLoading: isLoadingDashboard,
    error: dashboardError 
  } = useEmbeddableDashboard(
    {
      customer_id: selectedCustomerId,
      dashboard_type: selectedDashboardType,
      color_overrides: {
        primary_medium: "#0EA5E9",
        gray_dark: "#1E293B",
        background: "#FFFFFF",
      },
    },
    shouldFetchDashboard && !!selectedCustomerId
  );

  const handleGenerateDashboard = () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    setShouldFetchDashboard(true);
  };

  const handleReset = () => {
    setShouldFetchDashboard(false);
    setSelectedCustomerId("");
    setSelectedDashboardType("usage");
  };

  const selectedDashboard = DASHBOARD_TYPES.find(d => d.value === selectedDashboardType);
  const selectedCustomer = customers?.find(c => c.metronome_customer_id === selectedCustomerId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Embeddable Customer Dashboards</h1>
        <p className="text-muted-foreground">
          Share Metronome data with your customers through customizable embeddable dashboards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Configuration</CardTitle>
          <CardDescription>
            Select a customer and dashboard type to generate an embeddable URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
                disabled={isLoadingCustomers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem 
                      key={customer.id} 
                      value={customer.metronome_customer_id}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dashboard Type</label>
              <Select
                value={selectedDashboardType}
                onValueChange={(value) => setSelectedDashboardType(value as DashboardType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DASHBOARD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDashboard && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {selectedDashboard.description}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateDashboard}
              disabled={!selectedCustomerId || isLoadingDashboard}
            >
              {isLoadingDashboard && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Dashboard
            </Button>
            {shouldFetchDashboard && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {dashboardError && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {dashboardError.message || "Failed to generate embeddable dashboard URL"}
            </p>
          </CardContent>
        </Card>
      )}

      {shouldFetchDashboard && selectedCustomerId && dashboardData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDashboard?.label} - {selectedCustomer?.name}
            </CardTitle>
            <CardDescription>
              Embeddable URL: <code className="text-xs">{dashboardData.url}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full" style={{ height: "800px" }}>
              <iframe
                src={dashboardData.url}
                className="w-full h-full border rounded-lg"
                title={`${selectedDashboard?.label} for ${selectedCustomer?.name}`}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {!shouldFetchDashboard && (
        <Card>
          <CardHeader>
            <CardTitle>How to Use Embeddable Dashboards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📊 Invoice Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Allows customers to view their current and historical invoices (draft, finalized, and voided), 
                up to 90 days old. Customers can also manually attempt payment on outstanding invoices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📈 Usage Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Shows usage metrics attached to a customer's current contract for the past 30, 60, or 90 days.
                Helps customers understand their consumption patterns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💰 Commits & Credits Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Allows customers to view their current and historical commit and credit grants, including 
                remaining and historical balances, grant and deduction history, and access schedules.
              </p>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">🎨 Customization</h3>
              <p className="text-sm text-muted-foreground">
                Dashboard colors are automatically customized to match your brand using color overrides.
                The embeddable URL can be used in iframes within your application.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
