import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface PhoenixCompanionProps {
  phoenixScore: number;
  gameLevel: number;
  onMessage: (message: string) => void;
}

export const PhoenixCompanion = ({ phoenixScore, gameLevel, onMessage }: PhoenixCompanionProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [phoenixStage, setPhoenixStage] = useState<'hatching' | 'learning' | 'gathering' | 'transformed'>('hatching');

  const getPhoenixStage = () => {
    if (phoenixScore < 100) return 'hatching';
    if (phoenixScore < 400) return 'learning';
    if (phoenixScore < 800) return 'gathering';
    return 'transformed';
  };

  const getPhoenixMessages = (stage: string) => {
    const messages = {
      hatching: [
        "I'm just beginning to emerge! Help me grow stronger! 🥚✨",
        "Each game you complete helps me hatch! Thank you! 🐣",
        "I can feel my wings starting to form... 🪶"
      ],
      learning: [
        "Look! I'm learning to fly! You're amazing! 🕊️✨",
        "With each challenge, my wings grow stronger! 🦅",
        "I'm soaring thanks to your dedication! 🌟"
      ],
      gathering: [
        "My flames are growing brighter with your help! 🔥✨",
        "Together we're collecting the energy I need! ⚡",
        "I can feel my power building - we're almost there! 🌟🔥"
      ],
      transformed: [
        "I've reached my full potential thanks to you! 🔥👑",
        "We've accomplished something incredible together! ✨🦅",
        "Your journey has transformed us both! 🌟🔥✨"
      ]
    };
    return messages[stage as keyof typeof messages] || messages.hatching;
  };

  useEffect(() => {
    const newStage = getPhoenixStage();
    if (newStage !== phoenixStage) {
      setPhoenixStage(newStage);
      const messages = getPhoenixMessages(newStage);
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      onMessage(randomMessage);
    }
  }, [phoenixScore, phoenixStage, onMessage]);

  const getPhoenixVisual = () => {
    const stages = {
      hatching: { emoji: "🥚", glow: "shadow-orange-400/50" },
      learning: { emoji: "🐣", glow: "shadow-yellow-400/50" },
      gathering: { emoji: "🔥", glow: "shadow-red-400/50" },
      transformed: { emoji: "🦅", glow: "shadow-purple-400/50" }
    };
    return stages[phoenixStage];
  };

  const phoenixVisual = getPhoenixVisual();

  return (
    <div className="text-center space-y-4">
      <div className={`relative mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shadow-xl ${phoenixVisual.glow} animate-pulse`}>
        <div className="text-6xl animate-bounce">
          {phoenixVisual.emoji}
        </div>
        <div className="absolute -top-2 -right-2">
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 text-xs">
            {phoenixStage.charAt(0).toUpperCase() + phoenixStage.slice(1)}
          </Badge>
        </div>
      </div>
      
      {currentMessage && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
          <p className="text-orange-200 font-medium">{currentMessage}</p>
        </div>
      )}
    </div>
  );
};