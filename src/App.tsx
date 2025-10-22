import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Executive from "./pages/Executive";
import Sales from "./pages/Sales";
import CustomerSuccess from "./pages/CustomerSuccess";
import Product from "./pages/Product";
import EmbeddableDashboard from "./pages/EmbeddableDashboard";
import MockDashboard from "./pages/MockDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/executive" element={<Executive />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customer-success" element={<CustomerSuccess />} />
          <Route path="/product" element={<Product />} />
          <Route path="/embeddable" element={<EmbeddableDashboard />} />
          <Route path="/mock-dashboard" element={<MockDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
