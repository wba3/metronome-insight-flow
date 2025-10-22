import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer_id, dashboard_type, color_overrides } = await req.json();

    console.log('Generating mock dashboard URL', {
      customer_id,
      dashboard_type,
      color_overrides
    });

    // Generate a mock embeddable dashboard URL
    // In production, this would call Metronome's /dashboards/getEmbeddableUrl endpoint
    // For now, we'll return a mock URL that displays a sample dashboard
    
    const baseUrl = "https://metronome-mock-dashboard.lovable.app";
    const params = new URLSearchParams({
      customer_id: customer_id || "",
      type: dashboard_type || "usage",
      theme: JSON.stringify(color_overrides || {}),
    });

    const mockUrl = `${baseUrl}?${params.toString()}`;

    return new Response(
      JSON.stringify({
        url: mockUrl,
        dashboard_type,
        customer_id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        color_overrides,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating mock dashboard:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
