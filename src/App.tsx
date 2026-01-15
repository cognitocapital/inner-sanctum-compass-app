import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AudioProvider } from "@/contexts/AudioContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GlobalAmbientControl } from "@/components/ui/global-ambient-control";
import { GlobalAudiobookPlayer } from "@/components/ui/global-audiobook-player";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BreathingExercise from "./pages/BreathingExercise";
import ColdExposure from "./pages/ColdExposure";
import Dedication from "./pages/Dedication";
import Prologue from "./pages/Prologue";
import Introduction from "./pages/Introduction";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Chapter3 from "./pages/Chapter3";
import Chapter4 from "./pages/Chapter4";
import Chapter5 from "./pages/Chapter5";
import Chapter6 from "./pages/Chapter6";
import Chapter7 from "./pages/Chapter7";
import Chapter8 from "./pages/Chapter8";
import Chapter9 from "./pages/Chapter9";
import Chapter10 from "./pages/Chapter10";
import Chapter11 from "./pages/Chapter11";
import Chapter12 from "./pages/Chapter12";
import Chapter13 from "./pages/Chapter13";
import Chapter14 from "./pages/Chapter14";
import Chapter15 from "./pages/Chapter15";
import Chapter16 from "./pages/Chapter16";
import Chapter17 from "./pages/Chapter17";
import Chapter18 from "./pages/Chapter18";
import Chapter19 from "./pages/Chapter19";
import Chapter20 from "./pages/Chapter20";
import Chapter21 from "./pages/Chapter21";
import ChallengeTracker from "./pages/ChallengeTracker";
import MindTraining from "./pages/MindTraining";
import GratitudeJourney from "./pages/GratitudeJourney";
import UnwrittenChapters from "./pages/UnwrittenChapters";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
// TBI Programs & NeuroRehab consolidated into unified Neurotech Arsenal (INCOG)
import INCOG from "./pages/INCOG";
import Install from "./pages/Install";

const queryClient = new QueryClient();

// Create a context for audiobook visibility
export const useAudiobookPlayer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [startChapter, setStartChapter] = useState("dedication");
  
  const showPlayer = (chapterId?: string) => {
    if (chapterId) setStartChapter(chapterId);
    setIsVisible(true);
  };
  
  const hidePlayer = () => setIsVisible(false);
  
  return { isVisible, startChapter, showPlayer, hidePlayer };
};

const AppContent = () => {
  const [audiobookVisible, setAudiobookVisible] = useState(false);
  const [startChapterId, setStartChapterId] = useState("dedication");

  // Expose global function for opening audiobook
  if (typeof window !== "undefined") {
    (window as any).openAudiobook = (chapterId?: string) => {
      if (chapterId) setStartChapterId(chapterId);
      setAudiobookVisible(true);
    };
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes - accessible without auth */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Book content - accessible without auth (guest friendly) */}
          <Route path="/dedication" element={<Dedication />} />
          <Route path="/prologue" element={<Prologue />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/chapter-1" element={<Chapter1 />} />
          <Route path="/chapter-2" element={<Chapter2 />} />
          <Route path="/chapter-3" element={<Chapter3 />} />
          <Route path="/chapter-4" element={<Chapter4 />} />
          <Route path="/chapter-5" element={<Chapter5 />} />
          <Route path="/chapter-6" element={<Chapter6 />} />
          <Route path="/chapter-7" element={<Chapter7 />} />
          <Route path="/chapter-8" element={<Chapter8 />} />
          <Route path="/chapter-9" element={<Chapter9 />} />
          <Route path="/chapter-10" element={<Chapter10 />} />
          <Route path="/chapter-11" element={<Chapter11 />} />
          <Route path="/chapter-12" element={<Chapter12 />} />
          <Route path="/chapter-13" element={<Chapter13 />} />
          <Route path="/chapter-14" element={<Chapter14 />} />
          <Route path="/chapter-15" element={<Chapter15 />} />
          <Route path="/chapter-16" element={<Chapter16 />} />
          <Route path="/chapter-17" element={<Chapter17 />} />
          <Route path="/chapter-18" element={<Chapter18 />} />
          <Route path="/chapter-19" element={<Chapter19 />} />
          <Route path="/chapter-20" element={<Chapter20 />} />
          <Route path="/chapter-21" element={<Chapter21 />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/install" element={<Install />} />
          
          {/* Protected routes - require auth or guest mode */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/breathing" element={
            <ProtectedRoute>
              <BreathingExercise />
            </ProtectedRoute>
          } />
          <Route path="/cold-exposure" element={
            <ProtectedRoute>
              <ColdExposure />
            </ProtectedRoute>
          } />
          <Route path="/neuro-rehab" element={
            <ProtectedRoute>
              <INCOG />
            </ProtectedRoute>
          } />
          <Route path="/tbi-programs" element={
            <ProtectedRoute>
              <INCOG />
            </ProtectedRoute>
          } />
          <Route path="/incog" element={
            <ProtectedRoute>
              <INCOG />
            </ProtectedRoute>
          } />
          <Route path="/challenges" element={
            <ProtectedRoute>
              <ChallengeTracker />
            </ProtectedRoute>
          } />
          <Route path="/mind" element={
            <ProtectedRoute>
              <MindTraining />
            </ProtectedRoute>
          } />
          <Route path="/gratitude" element={
            <ProtectedRoute>
              <GratitudeJourney />
            </ProtectedRoute>
          } />
          <Route path="/unwritten" element={
            <ProtectedRoute>
              <UnwrittenChapters />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
      {/* Global Audio Controls - Always Available */}
      <GlobalAmbientControl />
      <GlobalAudiobookPlayer 
        isVisible={audiobookVisible}
        onClose={() => setAudiobookVisible(false)}
        startChapterId={startChapterId}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
