import { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useMetronomeRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

const EmbeddableDashboard = () => {
  const { data: customers = [] } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [dashboardType, setDashboardType] = useState<string>("usage");
  const [embeddableUrl, setEmbeddableUrl] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#00A86B");
  const [accentColor, setAccentColor] = useState<string>("#5B5FFF");

  useEffect(() => {
    if (selectedCustomer && dashboardType) {
      const params = new URLSearchParams({
        customer_id: selectedCustomer,
        type: dashboardType,
        primary: primaryColor.replace("#", ""),
        accent: accentColor.replace("#", ""),
      });
      
      const url = `${window.location.origin}/mock-dashboard?${params.toString()}`;
      setEmbeddableUrl(url);
    }
  }, [selectedCustomer, dashboardType, primaryColor, accentColor]);

  const copyToClipboard = () => {
    if (embeddableUrl) {
      navigator.clipboard.writeText(embeddableUrl);
      toast.success("URL copied to clipboard!");
    }
  };

  const copyIframeCode = () => {
    const iframeCode = `<iframe 
  src="${embeddableUrl}"
  width="100%"
  height="600px"
  frameborder="0"
  allowfullscreen
></iframe>`;
    
    navigator.clipboard.writeText(iframeCode);
    toast.success("Iframe code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-semibold tracking-tight">Embeddable Dashboards</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Create beautiful, branded usage dashboards for your customers
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card className="premium-card h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold">Dashboard Configuration</CardTitle>
              <CardDescription>
                Customize and generate embeddable dashboards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-medium">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer" className="w-full">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.metronome_customer_id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dashboard Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Dashboard Type</Label>
                <Select value={dashboardType} onValueChange={setDashboardType}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Usage & Metrics</SelectItem>
                    <SelectItem value="commits">Commits & Credits</SelectItem>
                    <SelectItem value="invoice">Invoice Breakdown</SelectItem>
                    <SelectItem value="cost-explorer">Cost Explorer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Customization */}
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="colors" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-sm font-medium">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-sm font-medium">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Advanced customization options coming soon. Control fonts, layouts, and more.
                  </p>
                </TabsContent>
              </Tabs>

              {/* Generated URL */}
              {embeddableUrl && (
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-sm font-medium">Embeddable URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={embeddableUrl}
                      readOnly
                      className="font-mono text-xs flex-1"
                    />
                    <Button onClick={copyToClipboard} variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyIframeCode} variant="secondary" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy iframe Code
                    </Button>
                    <Button asChild variant="default" className="flex-1">
                      <a href={embeddableUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold">Live Preview</CardTitle>
              <CardDescription>
                See how your dashboard will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              {embeddableUrl ? (
                <div className="border rounded-lg overflow-hidden bg-background" style={{ boxShadow: 'var(--shadow-elegant)' }}>
                  <iframe
                    src={embeddableUrl}
                    className="w-full h-[600px]"
                    title="Dashboard Preview"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground text-center">
                    Select a customer and dashboard type to preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Integration Guide */}
        <Card className="premium-card mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Integration Guide</CardTitle>
            <CardDescription>
              How to embed Metronome dashboards in your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Using an iframe</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`<iframe 
  src="${embeddableUrl || 'https://your-app.com/mock-dashboard?...'}"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
              </pre>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Using the Metronome SDK</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`import { MetronomeEmbed } from '@metronome/embed';

<MetronomeEmbed
  customerId="${selectedCustomer || 'customer_id'}"
  dashboardType="${dashboardType}"
  theme={{
    primary: "${primaryColor}",
    accent: "${accentColor}"
  }}
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddableDashboard;
