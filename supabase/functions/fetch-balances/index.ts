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

    const { customer_id } = await req.json();

    console.log('Fetching commit balances for customer:', customer_id);

    // Call Metronome API for contract balances
    const metronomeResponse = await fetch('https://api.metronome.com/v1/contracts/customerBalances', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${metronomeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id }),
    });

    if (!metronomeResponse.ok) {
      const errorText = await metronomeResponse.text();
      console.error('Metronome API error:', errorText);
      throw new Error(`Metronome API error: ${metronomeResponse.status} - ${errorText}`);
    }

    const metronomeData = await metronomeResponse.json();
    console.log('Balance data fetched:', JSON.stringify(metronomeData).substring(0, 200));

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Cache commit data in database
    const balances = metronomeData.data || [];
    
    for (const balance of balances) {
      await supabase
        .from('commit_data')
        .upsert({
          metronome_customer_id: customer_id,
          contract_id: balance.contract_id,
          total_amount: balance.starting_balance || 0,
          remaining_amount: balance.balance || 0,
          start_date: balance.start_date,
          end_date: balance.end_date,
          status: balance.status || 'active',
          metadata: balance,
        }, {
          onConflict: 'contract_id'
        });
    }

    console.log(`Cached ${balances.length} commit balances`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: metronomeData,
        cached: balances.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-balances:', error);
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