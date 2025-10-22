import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Fetch all customers
export const useCustomers = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch usage data
export const useUsageData = (customerId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('usage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'usage_data'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['usage'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['usage', customerId],
    queryFn: async () => {
      let query = supabase
        .from('usage_data')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (customerId) {
        query = query.eq('metronome_customer_id', customerId);
      }
      
      const { data, error } = await query.limit(1000);
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch commit/contract data
export const useCommitData = (customerId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('commit-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commit_data'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['commits'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['commits', customerId],
    queryFn: async () => {
      let query = supabase
        .from('commit_data')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (customerId) {
        query = query.eq('metronome_customer_id', customerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch invoice data
export const useInvoiceData = (customerId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('invoice-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_data'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['invoices'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['invoices', customerId],
    queryFn: async () => {
      let query = supabase
        .from('invoice_data')
        .select('*')
        .order('period_start', { ascending: false });
      
      if (customerId) {
        query = query.eq('metronome_customer_id', customerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

// Trigger sync from Metronome API
export const useSyncMetronome = () => {
  return async () => {
    const { data, error } = await supabase.functions.invoke('sync-metronome-data');
    
    if (error) throw error;
    return data;
  };
};

// Fetch specific customer from Metronome
export const useFetchCustomers = () => {
  return async () => {
    const { data, error } = await supabase.functions.invoke('fetch-customers');
    
    if (error) throw error;
    return data;
  };
};