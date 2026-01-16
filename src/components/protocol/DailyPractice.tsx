import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wind, Snowflake, Brain, Heart, Check, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeekData } from '@/data/protocolWeeks';

interface DailyPracticeProps {
  weekData: WeekData;
  isPracticeCompleted: boolean;
  onCompletePractice: () => void;
}

const challengeIcons = {
  cold: Snowflake,
  cognitive: Brain,
  physical: Heart,
  mindfulness: Heart
};

export const DailyPractice = ({ weekData, isPracticeCompleted, onCompletePractice }: DailyPracticeProps) => {
  const [showBreathingDetails, setShowBreathingDetails] = useState(false);
  const { breathing, challenge } = weekData.practice;
  const ChallengeIcon = challengeIcons[challenge.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Today's Practice</h3>
            {isPracticeCompleted && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Complete
              </span>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Breathing Practice */}
            <div 
              onClick={() => setShowBreathingDetails(!showBreathingDetails)}
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Wind className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{breathing.name}</h4>
                  <p className="text-sm text-white/60 mb-2">
                    {breathing.inhale}-{breathing.hold}-{breathing.exhale}-{breathing.pause} pattern
                  </p>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>{breathing.duration} minutes</span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${showBreathingDetails ? 'rotate-90' : ''}`} />
              </div>
              
              {showBreathingDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xl font-bold text-cyan-400">{breathing.inhale}s</p>
                      <p className="text-xs text-white/40">Inhale</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xl font-bold text-blue-400">{breathing.hold}s</p>
                      <p className="text-xs text-white/40">Hold</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xl font-bold text-purple-400">{breathing.exhale}s</p>
                      <p className="text-xs text-white/40">Exhale</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xl font-bold text-indigo-400">{breathing.pause}s</p>
                      <p className="text-xs text-white/40">Pause</p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                  >
                    <Link to="/breathing">Start Breathing Session</Link>
                  </Button>
                </motion.div>
              )}
            </div>
            
            {/* Weekly Challenge */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  challenge.type === 'cold' 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                    : challenge.type === 'cognitive'
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30'
                }`}>
                  <ChallengeIcon className={`w-6 h-6 ${
                    challenge.type === 'cold' 
                      ? 'text-cyan-400'
                      : challenge.type === 'cognitive'
                        ? 'text-purple-400'
                        : 'text-green-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{challenge.name}</h4>
                  <p className="text-sm text-white/60 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>{challenge.duration}</span>
                  </div>
                </div>
              </div>
              
              {challenge.type === 'cold' && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/cold-exposure">Open Cold Timer</Link>
                </Button>
              )}
              
              {challenge.type === 'cognitive' && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/mind">Start N-Back Training</Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Complete Practice Button */}
          {!isPracticeCompleted && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <Button
                onClick={onCompletePractice}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark Practice Complete
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};