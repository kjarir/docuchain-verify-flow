
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ValidatePage from "./pages/ValidatePage";
import GeneratePage from "./pages/GeneratePage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import ApiDocsPage from "./pages/ApiDocsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { handleValidateRequest, handleGenerateRequest } from "./utils/apiHandler";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// API route handler
if (typeof window !== 'undefined') {
  const apiBase = '/api';
  
  // Set up route handlers for API endpoints
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Handle API routes
    if (url.startsWith(apiBase)) {
      const path = url.slice(apiBase.length);
      const request = new Request(url, init);
      
      if (path === '/validate') {
        return handleValidateRequest(request);
      } else if (path === '/generate') {
        return handleGenerateRequest(request);
      }
    }
    
    // Pass through to original fetch for all other requests
    return originalFetch(input, init);
  };
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/validate" element={<ValidatePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/api" element={<ApiDocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
