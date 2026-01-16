import { motion } from 'framer-motion';
import { Check, Lock, Flame } from 'lucide-react';
import { PROTOCOL_WEEKS } from '@/data/protocolWeeks';

interface JourneyRoadProps {
  currentWeek: number;
  completedWeeks: number[];
}

export const JourneyRoad = ({ currentWeek, completedWeeks }: JourneyRoadProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center justify-start gap-1 min-w-max px-4">
        {PROTOCOL_WEEKS.map((week, index) => {
          const isCompleted = completedWeeks.includes(week.week);
          const isCurrent = week.week === currentWeek;
          const isLocked = week.week > currentWeek;
          
          return (
            <div key={week.week} className="flex items-center">
              {/* Week Node */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative group"
              >
                {/* Glow effect for current week */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 blur-lg opacity-60 animate-pulse-glow" />
                )}
                
                {/* Node */}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                      : isCurrent 
                        ? 'bg-gradient-to-br from-orange-500/30 to-red-500/30 border-2 border-orange-400 text-orange-300'
                        : 'bg-white/5 border border-white/20 text-white/30'
                    }
                    ${!isLocked && 'hover:scale-110'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Flame className="w-5 h-5 animate-flame-flicker" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{week.week}</span>
                  )}
                </div>
                
                {/* Tooltip */}
                <div className={`
                  absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  px-3 py-2 rounded-lg text-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap z-10
                  ${isLocked ? 'bg-white/10' : 'bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10'}
                `}>
                  <p className="text-xs text-white/60">Week {week.week}</p>
                  <p className={`text-sm font-medium ${isLocked ? 'text-white/40' : 'text-white'}`}>
                    {isLocked ? '🔒 Locked' : week.chapter}
                  </p>
                  {!isLocked && (
                    <p className="text-xs text-orange-400">{week.theme}</p>
                  )}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                </div>
              </motion.div>
              
              {/* Connector Line */}
              {index < PROTOCOL_WEEKS.length - 1 && (
                <div 
                  className={`w-4 h-0.5 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Week {currentWeek} of {PROTOCOL_WEEKS.length}</span>
          <span className="text-orange-400 font-medium">
            {Math.round((currentWeek / PROTOCOL_WEEKS.length) * 100)}% Complete
          </span>
        </div>
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentWeek / PROTOCOL_WEEKS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  );
};