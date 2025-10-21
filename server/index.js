import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Metronome API Configuration
const METRONOME_API_KEY = process.env.METRONOME_API_KEY;
const METRONOME_API_URL = process.env.METRONOME_API_URL || 'https://api.metronome.com/v1';

// Helper function to call Metronome API
async function callMetronomeAPI(endpoint, options = {}) {
  const url = `${METRONOME_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${METRONOME_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Metronome API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ======================
// GTM Dashboard Endpoints
// ======================

// Get customer usage data with filtering
app.post('/api/usage', async (req, res) => {
  try {
    const { customer_id, starting_on, ending_before, billable_metric_id, group_by } = req.body;

    const data = await callMetronomeAPI('/usage', {
      method: 'POST',
      body: JSON.stringify({
        customer_id,
        starting_on,
        ending_before,
        billable_metric_id,
        group_by,
      }),
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get invoice breakdown for real-time spend tracking
app.post('/api/invoices/breakdown', async (req, res) => {
  try {
    const { customer_id, starting_on, ending_before } = req.body;

    const data = await callMetronomeAPI('/invoices/breakdowns', {
      method: 'POST',
      body: JSON.stringify({
        customer_id,
        starting_on,
        ending_before,
      }),
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching invoice breakdown:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get commit and credit balances
app.post('/api/contracts/balances', async (req, res) => {
  try {
    const { customer_id } = req.body;

    const data = await callMetronomeAPI('/contracts/customerBalances/list', {
      method: 'POST',
      body: JSON.stringify({
        customer_id,
      }),
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching contract balances:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get embeddable dashboard URL
app.post('/api/dashboard/embeddable', async (req, res) => {
  try {
    const { customer_id, dashboard_type, color_overrides } = req.body;

    const data = await callMetronomeAPI('/dashboards/getEmbeddableUrl', {
      method: 'POST',
      body: JSON.stringify({
        customer_id,
        dashboard_type,
        color_overrides,
      }),
    });

    res.json(data);
  } catch (error) {
    console.error('Error generating embeddable URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get customer list
app.get('/api/customers', async (req, res) => {
  try {
    const data = await callMetronomeAPI('/customers/list', {
      method: 'GET',
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: error.message });
  }
});

// GTM Analytics: Calculate burn rate and health metrics
app.post('/api/gtm/analytics', async (req, res) => {
  try {
    const { customer_id, contract_id } = req.body;

    // Fetch balances
    const balances = await callMetronomeAPI('/contracts/customerBalances/list', {
      method: 'POST',
      body: JSON.stringify({ customer_id }),
    });

    // Calculate burn rate analytics
    const analytics = calculateBurnRateAnalytics(balances);

    res.json(analytics);
  } catch (error) {
    console.error('Error calculating GTM analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate burn rate analytics
function calculateBurnRateAnalytics(balances) {
  // Parse access schedules and calculate expected vs actual burn
  const analytics = {
    total_commits: 0,
    remaining_balance: 0,
    burned_amount: 0,
    expected_burn_rate: 0,
    actual_burn_rate: 0,
    health_status: 'healthy', // healthy, at_risk, critical
    days_remaining: 0,
    recommendations: [],
  };

  if (!balances || !balances.data) {
    return analytics;
  }

  balances.data.forEach(balance => {
    if (balance.contract_balance_type === 'COMMIT') {
      const totalAmount = balance.total_amount || 0;
      const remainingAmount = balance.remaining_amount || 0;
      const burnedAmount = totalAmount - remainingAmount;

      analytics.total_commits += totalAmount;
      analytics.remaining_balance += remainingAmount;
      analytics.burned_amount += burnedAmount;

      // Calculate days remaining
      if (balance.end_date) {
        const endDate = new Date(balance.end_date);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        analytics.days_remaining = Math.max(analytics.days_remaining, daysRemaining);
      }
    }
  });

  // Calculate burn rates
  if (analytics.total_commits > 0) {
    const burnPercentage = (analytics.burned_amount / analytics.total_commits) * 100;
    const expectedBurnPercentage = 50; // Simplified - should calculate based on time elapsed

    analytics.actual_burn_rate = burnPercentage;
    analytics.expected_burn_rate = expectedBurnPercentage;

    // Determine health status
    if (burnPercentage > expectedBurnPercentage * 1.5) {
      analytics.health_status = 'over_consuming';
      analytics.recommendations.push('Customer is burning faster than expected - upsell opportunity');
    } else if (burnPercentage < expectedBurnPercentage * 0.5) {
      analytics.health_status = 'under_consuming';
      analytics.recommendations.push('Customer is underutilizing - requires engagement');
    } else {
      analytics.health_status = 'healthy';
      analytics.recommendations.push('Customer usage is on track');
    }
  }

  return analytics;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Metronome GTM Dashboard Server running on port ${PORT}`);
  console.log(`API Key configured: ${METRONOME_API_KEY ? 'Yes' : 'No'}`);
});
