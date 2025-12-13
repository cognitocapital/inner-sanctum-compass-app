import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, Music, Dumbbell, Brain, Repeat } from 'lucide-react';
import GMTDashboard from '@/components/gmt/GMTDashboard';
import MusicTherapy from '@/components/therapy/MusicTherapy';
import ADLTraining from '@/components/adl/ADLTraining';
import SpacedRepetition from '@/components/memory/SpacedRepetition';

const INCOG = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-orange-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="text-orange-400 hover:text-orange-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-orange-500" />
              <span className="font-semibold text-white">INCOG 2.0 Modules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Evidence-Based Cognitive Rehabilitation
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Research-backed interventions aligned with INCOG 2.0 International Cognitive 
            Rehabilitation Guidelines for traumatic brain injury recovery.
          </p>
        </div>

        {/* Module Tabs */}
        <Tabs defaultValue="gmt" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-gray-800/50 p-1">
            <TabsTrigger 
              value="gmt" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Target className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">GMT</span>
              <span className="sm:hidden">GMT</span>
            </TabsTrigger>
            <TabsTrigger 
              value="music"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Music className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Music</span>
              <span className="sm:hidden">Music</span>
            </TabsTrigger>
            <TabsTrigger 
              value="memory"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Repeat className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Memory</span>
              <span className="sm:hidden">Mem</span>
            </TabsTrigger>
            <TabsTrigger 
              value="adl"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Dumbbell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">ADL</span>
              <span className="sm:hidden">ADL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gmt" className="text-white">
            <GMTDashboard />
          </TabsContent>

          <TabsContent value="music" className="text-white">
            <MusicTherapy />
          </TabsContent>

          <TabsContent value="memory" className="text-white">
            <SpacedRepetition />
          </TabsContent>

          <TabsContent value="adl" className="text-white">
            <ADLTraining />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default INCOG;
