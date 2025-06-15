import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Chapter3 from "./pages/Chapter3";
import Chapter4 from "./pages/Chapter4";
import Chapter5 from "./pages/Chapter5";
import Dashboard from "./pages/Dashboard";
import BreathingExercise from "./pages/BreathingExercise";
import ChallengeTracker from "./pages/ChallengeTracker";
import MindTraining from "./pages/MindTraining";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chapter-1" element={<Chapter1 />} />
          <Route path="/chapter-2" element={<Chapter2 />} />
          <Route path="/chapter-3" element={<Chapter3 />} />
          <Route path="/chapter-4" element={<Chapter4 />} />
          <Route path="/chapter-5" element={<Chapter5 />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/breathing" element={<BreathingExercise />} />
          <Route path="/challenges" element={<ChallengeTracker />} />
          <Route path="/mind" element={<MindTraining />} />
          {/* More chapter routes will be added as chapters are created */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
