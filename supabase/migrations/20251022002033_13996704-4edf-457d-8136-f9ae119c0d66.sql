-- Create customers table to cache Metronome customer data
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metronome_customer_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  tier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on customers (make publicly readable for demo purposes)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customers"
  ON public.customers FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage customers"
  ON public.customers FOR ALL
  USING (auth.role() = 'service_role');

-- Create usage data cache table
CREATE TABLE public.usage_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  metronome_customer_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on usage_data
ALTER TABLE public.usage_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view usage data"
  ON public.usage_data FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage usage data"
  ON public.usage_data FOR ALL
  USING (auth.role() = 'service_role');

-- Create commit/contract data cache table
CREATE TABLE public.commit_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  metronome_customer_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  remaining_amount NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on commit_data
ALTER TABLE public.commit_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view commit data"
  ON public.commit_data FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage commit data"
  ON public.commit_data FOR ALL
  USING (auth.role() = 'service_role');

-- Create invoice data cache table
CREATE TABLE public.invoice_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  metronome_customer_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on invoice_data
ALTER TABLE public.invoice_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invoice data"
  ON public.invoice_data FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage invoice data"
  ON public.invoice_data FOR ALL
  USING (auth.role() = 'service_role');

-- Create webhook events log table
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view webhook events"
  ON public.webhook_events FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage webhook events"
  ON public.webhook_events FOR ALL
  USING (auth.role() = 'service_role');

-- Create branding settings table for white-label customization
CREATE TABLE public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on branding_settings
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view branding settings"
  ON public.branding_settings FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage branding settings"
  ON public.branding_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_usage_data_customer_id ON public.usage_data(customer_id);
CREATE INDEX idx_usage_data_timestamp ON public.usage_data(timestamp);
CREATE INDEX idx_usage_data_metronome_customer_id ON public.usage_data(metronome_customer_id);
CREATE INDEX idx_commit_data_customer_id ON public.commit_data(customer_id);
CREATE INDEX idx_commit_data_metronome_customer_id ON public.commit_data(metronome_customer_id);
CREATE INDEX idx_invoice_data_customer_id ON public.invoice_data(customer_id);
CREATE INDEX idx_invoice_data_metronome_customer_id ON public.invoice_data(metronome_customer_id);
CREATE INDEX idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX idx_webhook_events_received_at ON public.webhook_events(received_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_branding_settings_updated_at
  BEFORE UPDATE ON public.branding_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables so UI updates automatically
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usage_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commit_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoice_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.webhook_events;