import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Training from "./pages/Training.tsx";
import TrainingLive from "./pages/TrainingLive.tsx";
import Immersive from "./pages/Immersive.tsx";
import Health from "./pages/Health.tsx";
import Community from "./pages/Community.tsx";
import Profile from "./pages/Profile.tsx";
import Coach from "./pages/Coach.tsx";
import Rehab from "./pages/Rehab.tsx";
import Autonomy from "./pages/Autonomy.tsx";
import Settings from "./pages/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training/live" element={<TrainingLive />} />
          <Route path="/immersive" element={<Immersive />} />
          <Route path="/health" element={<Health />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/rehab" element={<Rehab />} />
          <Route path="/autonomy" element={<Autonomy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
