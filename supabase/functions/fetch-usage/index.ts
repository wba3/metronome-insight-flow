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
    const metronomeApiKey = Deno.env.get('METRONOME_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!metronomeApiKey) {
      throw new Error('METRONOME_API_KEY not configured');
    }

    const { customer_id, starting_on, ending_before, billable_metric_id, group_by } = await req.json();

    console.log('Fetching usage data:', { customer_id, starting_on, ending_before });

    // Call Metronome API
    const metronomeResponse = await fetch('https://api.metronome.com/v1/usage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metronomeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id,
        starting_on,
        ending_before,
        billable_metric_id,
        group_by,
      }),
    });

    if (!metronomeResponse.ok) {
      const errorText = await metronomeResponse.text();
      console.error('Metronome API error:', errorText);
      throw new Error(`Metronome API error: ${metronomeResponse.status} - ${errorText}`);
    }

    const metronomeData = await metronomeResponse.json();
    console.log('Usage data fetched:', JSON.stringify(metronomeData).substring(0, 200));

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Cache usage data in database
    const usagePoints = metronomeData.data || [];
    
    for (const usage of usagePoints) {
      await supabase
        .from('usage_data')
        .insert({
          metronome_customer_id: customer_id,
          metric_name: usage.billable_metric_name || 'unknown',
          value: usage.value || 0,
          timestamp: usage.timestamp || new Date().toISOString(),
          metadata: usage,
        });
    }

    console.log(`Cached ${usagePoints.length} usage data points`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: metronomeData,
        cached: usagePoints.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-usage:', error);
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