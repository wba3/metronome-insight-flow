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
    const baseFromEnv = Deno.env.get('METRONOME_API_BASE_URL') || 'https://api.metronome.com';
    const metronomeBaseUrl = (baseFromEnv.includes('app.metronome.com') || baseFromEnv.includes('sandbox'))
      ? 'https://api.metronome.com'
      : baseFromEnv;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!metronomeApiKey) {
      throw new Error('METRONOME_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let nextPage: string | null = null;
    let totalFetched = 0;
    let allCustomers: any[] = [];

    // Fetch all customers with pagination
    do {
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (nextPage) {
        params.set('next_page', nextPage);
      }

      const apiUrl = `${metronomeBaseUrl}/v1/customers?${params.toString()}`;
      console.log('Fetching customers from:', apiUrl);

      const metronomeResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${metronomeApiKey}`,
        },
      });

      if (!metronomeResponse.ok) {
        const errorText = await metronomeResponse.text();
        console.error('Metronome API error:', metronomeResponse.status, errorText);
        throw new Error(`Metronome API error: ${metronomeResponse.status} - ${errorText}`);
      }

      const responseData = await metronomeResponse.json();
      const customers = responseData.data || responseData.customers || [];
      nextPage = responseData.next_page || null;

      console.log(`Fetched ${customers.length} customers, next_page: ${nextPage}`);

      // Cache customers in the database
      for (const customer of customers) {
        await supabase
          .from('customers')
          .upsert({
            metronome_customer_id: customer.id,
            name: customer.name,
            industry: customer.custom_fields?.industry || null,
            tier: customer.custom_fields?.tier || null,
          }, {
            onConflict: 'metronome_customer_id'
          });
        totalFetched++;
      }

      allCustomers = allCustomers.concat(customers);
    } while (nextPage);

    console.log(`Successfully cached ${totalFetched} customers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: allCustomers,
        cached: totalFetched 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-customers:', error);
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