
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/NotFound";
import MembersDirectory from "./pages/MembersDirectory";
import Pricing from "./pages/Pricing";
import Earnings from "./pages/Earnings";
import Opportunities from "./pages/Opportunities";
import { BusinessCardDisplay } from "./components/BusinessCardDisplay";
import { LifetimeOfferButton } from "./components/ui/LifetimeOfferButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/members" element={<MembersDirectory />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/card/:cardId" element={<BusinessCardDisplay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <LifetimeOfferButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
