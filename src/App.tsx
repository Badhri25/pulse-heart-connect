import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import PulseLink from "./pages/PulseLink";
import Header from "./components/Header";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import CustomPulse from "./pages/CustomPulse";
import Payment from "./pages/Payment";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Invite from "./pages/Invite";
import Join from "./pages/Join";
import MapPage from "./pages/Map";
import TodayWidget from "./pages/widgets/TodayWidget";
import BadgeWidget from "./pages/widgets/BadgeWidget";

const queryClient = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/widgets/");
  return (
    <>
      {!hideHeader && <Header />}
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/p/:handle" element={<PulseLink />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/custom-pulse" element={<CustomPulse />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/join/:code" element={<Join />} />
          {/* Widgets */}
          <Route path="/widgets/today" element={<TodayWidget />} />
          <Route path="/widgets/badge" element={<BadgeWidget />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
