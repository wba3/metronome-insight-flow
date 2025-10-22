import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Download, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MetronomeSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleFetchCustomers = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-customers');
      
      if (error) throw error;
      
      toast.success(`✅ Fetched ${data?.cached || 0} customers from Metronome`, {
        description: "Customer data has been cached in your dashboard",
      });
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error("Failed to fetch customers", {
        description: error instanceof Error ? error.message : "Please check your API configuration",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-metronome-data');
      
      if (error) throw error;
      
      const results = data?.results;
      toast.success(`✅ Synced ${results?.customers_synced || 0} customers`, {
        description: `Usage: ${results?.usage_synced || 0} | Balances: ${results?.balances_synced || 0} | Invoices: ${results?.invoices_synced || 0}`,
      });
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error("Failed to sync data", {
        description: error instanceof Error ? error.message : "Please check your API configuration",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Metronome Data Sync</CardTitle>
            <CardDescription>
              Fetch the latest data from your Metronome account
            </CardDescription>
          </div>
          {lastSync && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              Last synced: {lastSync.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleFetchCustomers}
            disabled={syncing}
            className="flex-1"
            variant="outline"
          >
            {syncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Fetch Customers
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSyncAll}
            disabled={syncing}
            className="flex-1"
          >
            {syncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All Data
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Real-time Updates Enabled</p>
              <p className="text-muted-foreground">
                Configure webhooks in Metronome to push updates automatically. Webhook URL: <br />
                <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                  https://plbyxkapqmcvktldnban.supabase.co/functions/v1/metronome-webhook
                </code>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};