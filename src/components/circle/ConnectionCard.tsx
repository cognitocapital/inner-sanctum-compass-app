import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, Heart, Brain, Zap, Shield, User,
  Clock, Sparkles, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Connection {
  id: string;
  name: string;
  injuryType: string;
  timeSinceInjury: string;
  challenges: string[];
  interests: string[];
  bio?: string;
  isOnline?: boolean;
  matchScore?: number;
}

interface ConnectionCardProps {
  connection: Connection;
  onConnect: (id: string) => void;
  onChat: (id: string) => void;
  isConnected?: boolean;
}

const injuryIcons = {
  tbi: Brain,
  stroke: Zap,
  concussion: Shield,
  anoxic: Heart,
  other: User
};

export const ConnectionCard = ({ 
  connection, 
  onConnect, 
  onChat,
  isConnected 
}: ConnectionCardProps) => {
  const Icon = injuryIcons[connection.injuryType as keyof typeof injuryIcons] || User;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
        {/* Match score badge */}
        {connection.matchScore && connection.matchScore > 70 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {connection.matchScore}% match
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 flex items-center justify-center border-2 border-primary/20">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              {connection.isOnline && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {connection.name}
                </h3>
                {isConnected && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Clock className="w-3 h-3" />
                <span>{connection.timeSinceInjury}</span>
              </div>

              {/* Challenges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {connection.challenges.slice(0, 3).map((challenge) => (
                  <Badge 
                    key={challenge} 
                    variant="outline" 
                    className="text-xs bg-primary/5 border-primary/20"
                  >
                    {challenge}
                  </Badge>
                ))}
                {connection.challenges.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{connection.challenges.length - 3}
                  </Badge>
                )}
              </div>

              {/* Bio preview */}
              {connection.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {connection.bio}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {isConnected ? (
                  <Button 
                    onClick={() => onChat(connection.id)}
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                ) : (
                  <Button 
                    onClick={() => onConnect(connection.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConnectionCard;
