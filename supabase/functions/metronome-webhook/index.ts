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
    
    const webhookData = await req.json();
    
    console.log('Received webhook:', JSON.stringify(webhookData).substring(0, 500));

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the webhook event
    const { data: webhookEvent, error: logError } = await supabase
      .from('webhook_events')
      .insert({
        event_type: webhookData.type || webhookData.event_type || 'unknown',
        event_data: webhookData,
        processed: false,
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging webhook:', logError);
      throw logError;
    }

    console.log('Webhook logged with ID:', webhookEvent.id);

    // Process the webhook based on event type
    const eventType = webhookData.type || webhookData.event_type;
    
    switch (eventType) {
      case 'invoice.finalized':
        await processInvoiceFinalized(supabase, webhookData);
        break;
      case 'usage.updated':
        await processUsageUpdated(supabase, webhookData);
        break;
      case 'contract.updated':
        await processContractUpdated(supabase, webhookData);
        break;
      case 'alert.triggered':
        await processAlertTriggered(supabase, webhookData);
        break;
      default:
        console.log('Unknown event type:', eventType);
    }

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', webhookEvent.id);

    return new Response(
      JSON.stringify({ success: true, event_id: webhookEvent.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in metronome-webhook:', error);
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

async function processInvoiceFinalized(supabase: any, webhookData: any) {
  console.log('Processing invoice.finalized event');
  const invoice = webhookData.data || webhookData;
  
  await supabase
    .from('invoice_data')
    .upsert({
      metronome_customer_id: invoice.customer_id,
      invoice_id: invoice.id,
      amount: invoice.total || 0,
      status: 'finalized',
      period_start: invoice.period_start,
      period_end: invoice.period_end,
      metadata: invoice,
    }, {
      onConflict: 'invoice_id'
    });
}

async function processUsageUpdated(supabase: any, webhookData: any) {
  console.log('Processing usage.updated event');
  const usage = webhookData.data || webhookData;
  
  await supabase
    .from('usage_data')
    .insert({
      metronome_customer_id: usage.customer_id,
      metric_name: usage.billable_metric_name || 'unknown',
      value: usage.value || 0,
      timestamp: usage.timestamp || new Date().toISOString(),
      metadata: usage,
    });
}

async function processContractUpdated(supabase: any, webhookData: any) {
  console.log('Processing contract.updated event');
  const contract = webhookData.data || webhookData;
  
  await supabase
    .from('commit_data')
    .upsert({
      metronome_customer_id: contract.customer_id,
      contract_id: contract.id,
      total_amount: contract.starting_balance || 0,
      remaining_amount: contract.balance || 0,
      start_date: contract.start_date,
      end_date: contract.end_date,
      status: contract.status || 'active',
      metadata: contract,
    }, {
      onConflict: 'contract_id'
    });
}

async function processAlertTriggered(supabase: any, webhookData: any) {
  console.log('Processing alert.triggered event');
  // You can add custom logic here to handle alerts
  // For example, send notifications, update dashboard, etc.
}