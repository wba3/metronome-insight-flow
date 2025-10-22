import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Starting Metronome data sync...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all customers from database
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('metronome_customer_id');

    if (customerError) {
      throw customerError;
    }

    console.log(`Found ${customers?.length || 0} customers to sync`);

    const syncResults = {
      customers_synced: 0,
      usage_synced: 0,
      balances_synced: 0,
      invoices_synced: 0,
      errors: [] as string[],
    };

    // Sync data for each customer
    for (const customer of customers || []) {
      try {
        const customerId = customer.metronome_customer_id;
        
        // Calculate date range (last 90 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);

        // Sync usage data
        const usageResponse = await supabase.functions.invoke('fetch-usage', {
          body: {
            customer_id: customerId,
            starting_on: startDate.toISOString().split('T')[0],
            ending_before: endDate.toISOString().split('T')[0],
          },
        });

        if (usageResponse.data?.success) {
          syncResults.usage_synced++;
        }

        // Sync balances
        const balanceResponse = await supabase.functions.invoke('fetch-balances', {
          body: { customer_id: customerId },
        });

        if (balanceResponse.data?.success) {
          syncResults.balances_synced++;
        }

        // Sync invoices
        const invoiceResponse = await supabase.functions.invoke('fetch-invoices', {
          body: {
            customer_id: customerId,
            starting_on: startDate.toISOString().split('T')[0],
            ending_before: endDate.toISOString().split('T')[0],
          },
        });

        if (invoiceResponse.data?.success) {
          syncResults.invoices_synced++;
        }

        syncResults.customers_synced++;
        console.log(`Synced data for customer: ${customerId}`);
      } catch (error) {
        console.error(`Error syncing customer ${customer.metronome_customer_id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        syncResults.errors.push(`${customer.metronome_customer_id}: ${errorMessage}`);
      }
    }

    console.log('Sync complete:', syncResults);

    return new Response(
      JSON.stringify({ 
        success: true,
        results: syncResults,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in sync-metronome-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});