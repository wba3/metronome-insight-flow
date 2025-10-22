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
    const metronomeBaseUrl = Deno.env.get('METRONOME_API_BASE_URL') || 'https://api.metronome.com';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!metronomeApiKey) {
      throw new Error('METRONOME_API_KEY not configured');
    }

    const { customer_id, starting_on, ending_before } = await req.json();

    const apiUrl = `${metronomeBaseUrl}/v1/invoices/breakdown`;
    console.log('Fetching invoice data:', { customer_id, starting_on, ending_before, apiUrl });

    // Call Metronome API for invoice breakdown
    const metronomeResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metronomeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id,
        starting_on,
        ending_before,
      }),
    });

    if (!metronomeResponse.ok) {
      const errorText = await metronomeResponse.text();
      console.error('Metronome API error:', errorText);
      throw new Error(`Metronome API error: ${metronomeResponse.status} - ${errorText}`);
    }

    const metronomeData = await metronomeResponse.json();
    console.log('Invoice data fetched:', JSON.stringify(metronomeData).substring(0, 200));

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Cache invoice data in database
    const invoices = metronomeData.data || [];
    
    for (const invoice of invoices) {
      await supabase
        .from('invoice_data')
        .insert({
          metronome_customer_id: customer_id,
          invoice_id: invoice.invoice_id,
          amount: invoice.total || 0,
          status: invoice.status || 'pending',
          period_start: invoice.period_start,
          period_end: invoice.period_end,
          metadata: invoice,
        });
    }

    console.log(`Cached ${invoices.length} invoices`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: metronomeData,
        cached: invoices.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-invoices:', error);
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