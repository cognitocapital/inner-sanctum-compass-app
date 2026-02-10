import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Zap, BookOpen, Wind, Clock } from "lucide-react";
import { getQuestByKey, type QuestDefinition } from "@/data/phoenixQuests";
import { usePhoenixPath } from "@/hooks/use-phoenix-path";
import { toast } from "sonner";

const QuestView = () => {
  const { questKey } = useParams<{ questKey: string }>();
  const navigate = useNavigate();
  const { completeQuest, getQuestStatus } = usePhoenixPath();
  const [reflectionText, setReflectionText] = useState("");
  const [toolkitStep, setToolkitStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  const quest = questKey ? getQuestByKey(questKey) : undefined;
  const status = questKey ? getQuestStatus(questKey) : 'locked';

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/60">Quest not found</p>
          <Button asChild variant="ghost"><Link to="/phoenix-path">Back to Path</Link></Button>
        </div>
      </div>
    );
  }

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const metadata: Record<string, unknown> = {};
      if (reflectionText) metadata.reflection = reflectionText;

      const result = await completeQuest(quest.key, metadata);
      toast.success(`Quest Complete! +${quest.xpReward} XP`, {
        description: result?.advanced
          ? `🔥 Phase ${result.newPhase} unlocked!`
          : quest.selfCompassionPrompt || "Well done, Phoenix.",
      });
      navigate("/phoenix-path");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/30 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <Link to="/phoenix-path"><ArrowLeft className="w-4 h-4 mr-2" />Back</Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-orange-400">
            <Zap className="w-4 h-4" />
            <span>{quest.xpReward} XP</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Quest header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 capitalize font-medium">
              {quest.type}
            </span>
            {quest.bookChapterRef && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Chapter {quest.bookChapterRef}
              </span>
            )}
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{quest.estimatedMinutes} min
            </span>
          </div>
          <h1 className="text-2xl font-serif text-white mb-2">{quest.title}</h1>
          <p className="text-white/60">{quest.description}</p>
        </motion.div>

        {/* Quote */}
        {quest.quote && (
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-l-2 border-orange-500/50 pl-4 italic text-white/50"
          >
            "{quest.quote}"
          </motion.blockquote>
        )}

        {/* Manuscript excerpt */}
        {quest.manuscriptExcerpt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <p className="text-xs text-orange-400/80 mb-2 uppercase tracking-wider font-medium">From the Manuscript</p>
            <p className="text-white/70 italic">{quest.manuscriptExcerpt}</p>
          </motion.div>
        )}

        {/* Narrative quest: link to chapter */}
        {quest.type === 'narrative' && quest.chapterPath && (
          <Button asChild className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10">
            <Link to={quest.chapterPath}>
              <BookOpen className="w-4 h-4 mr-2" />
              Read Full Chapter
            </Link>
          </Button>
        )}

        {/* Breathing quest: link to breathing page */}
        {quest.type === 'breathing' && quest.breathingPattern && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Wind className="w-5 h-5 text-orange-400" />
              {quest.breathingPattern.name}
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-lg font-bold text-orange-400">{quest.breathingPattern.inhale}s</p>
                <p className="text-xs text-white/40">Inhale</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-lg font-bold text-orange-400">{quest.breathingPattern.hold}s</p>
                <p className="text-xs text-white/40">Hold</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-lg font-bold text-orange-400">{quest.breathingPattern.exhale}s</p>
                <p className="text-xs text-white/40">Exhale</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-lg font-bold text-orange-400">{quest.breathingPattern.pause}s</p>
                <p className="text-xs text-white/40">Pause</p>
              </div>
            </div>
            <p className="text-sm text-white/50">Duration: {quest.breathingPattern.duration} minutes</p>
            {quest.breathingPattern.safetyNote && (
              <p className="text-xs text-orange-300/70 italic">⚠️ {quest.breathingPattern.safetyNote}</p>
            )}
            <Button asChild className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10">
              <Link to="/breathing">Open Breathing Exercise</Link>
            </Button>
          </div>
        )}

        {/* Challenge details */}
        {quest.challenge && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3">
            <h3 className="text-lg font-medium">{quest.challenge.name}</h3>
            <p className="text-white/60 text-sm">{quest.challenge.description}</p>
            <p className="text-sm text-white/40">Duration: {quest.challenge.duration}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50 capitalize">{quest.challenge.intensity}</span>
            {quest.challenge.safetyNote && (
              <p className="text-xs text-orange-300/70 italic">⚠️ {quest.challenge.safetyNote}</p>
            )}
            {quest.challenge.type === 'cold' && (
              <Button asChild className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10">
                <Link to="/cold-exposure">Open Cold Exposure Timer</Link>
              </Button>
            )}
          </div>
        )}

        {/* Toolkit steps */}
        {quest.toolkitSteps && quest.toolkitSteps.length > 0 && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
            <h3 className="text-lg font-medium">Steps</h3>
            <div className="space-y-3">
              {quest.toolkitSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: idx <= toolkitStep ? 1 : 0.4, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-start gap-3 cursor-pointer ${idx <= toolkitStep ? '' : 'opacity-40'}`}
                  onClick={() => idx <= toolkitStep + 1 && setToolkitStep(Math.max(toolkitStep, idx))}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    idx < toolkitStep ? 'bg-orange-500 text-white' :
                    idx === toolkitStep ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
                    'bg-white/5 text-white/30'
                  }`}>
                    {idx < toolkitStep ? <Check className="w-3 h-3" /> : idx + 1}
                  </div>
                  <p className="text-sm text-white/70 pt-0.5">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Science note */}
        {quest.scienceNote && (
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/40 mb-1 font-medium uppercase tracking-wider">Science Note</p>
            <p className="text-sm text-white/60">{quest.scienceNote}</p>
          </div>
        )}

        {/* Reflection prompt */}
        {(quest.reflectionPrompt || quest.type === 'reflection') && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Reflection</h3>
            <p className="text-white/60 text-sm italic">{quest.reflectionPrompt}</p>
            <Textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-orange-500/50"
            />
          </div>
        )}

        {/* Self-compassion */}
        {quest.selfCompassionPrompt && (
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
            <p className="text-sm text-orange-200/80 italic">💛 {quest.selfCompassionPrompt}</p>
          </div>
        )}

        {/* Complete button */}
        <div className="pt-4 pb-8">
          <Button
            onClick={handleComplete}
            disabled={completing || status === 'completed'}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-6 text-lg"
          >
            {status === 'completed' ? (
              'Already Completed ✓'
            ) : completing ? (
              'Completing...'
            ) : (
              <>
                Complete Quest <Zap className="w-5 h-5 ml-2" /> +{quest.xpReward} XP
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestView;
