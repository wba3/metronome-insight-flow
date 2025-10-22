import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

interface UsageParams {
  customer_id: string;
  starting_on: string;
  ending_before: string;
  billable_metric_id?: string;
  group_by?: string[];
}

interface InvoiceParams {
  customer_id: string;
  starting_on: string;
  ending_before: string;
}

// Usage Data Hook
export const useUsageData = (params: UsageParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["usage", params],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to fetch usage data");
      return response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  });
};

// Invoice Breakdown Hook
export const useInvoiceBreakdown = (params: InvoiceParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["invoice-breakdown", params],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/invoices/breakdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to fetch invoice breakdown");
      return response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  });
};

// Commit Balances Hook
export const useCommitBalances = (customer_id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["balances", customer_id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/contracts/balances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id }),
      });
      if (!response.ok) throw new Error("Failed to fetch balances");
      return response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  });
};

// GTM Analytics Hook
export const useGTMAnalytics = (customer_id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["gtm-analytics", customer_id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/gtm/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id }),
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
};

// Customers List Hook
export const useCustomers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/customers`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled,
  });
};

// Embeddable Dashboard URL Hook
export const useEmbeddableDashboard = (
  params: {
    customer_id: string;
    dashboard_type: string;
    color_overrides?: Record<string, string>;
  },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["embeddable-dashboard", params],
    queryFn: async () => {
      // For mock/development, return a mock URL
      const mockUrl = `/mock-dashboard?customer_id=${params.customer_id}&type=${params.dashboard_type}&theme=${encodeURIComponent(JSON.stringify(params.color_overrides || {}))}`;
      
      return {
        url: mockUrl,
        dashboard_type: params.dashboard_type,
        customer_id: params.customer_id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        color_overrides: params.color_overrides,
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    enabled,
  });
};
