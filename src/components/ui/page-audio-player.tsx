import { Volume2 } from "lucide-react";
import { useOpenAudiobook } from "@/hooks/use-audiobook";

interface PageAudioPlayerProps {
  /** Chapter id matching the global audiobook chapter list (e.g. "chapter1", "prologue", "introduction"). */
  chapterId: string;
}

/**
 * Top-right "Listen" button on chapter pages.
 * Opens the persistent global audiobook player at the given chapter and starts playback.
 * The global player continues across navigation and can be minimised.
 */
const PageAudioPlayer = ({ chapterId }: PageAudioPlayerProps) => {
  const openAudiobook = useOpenAudiobook();

  return (
    <button
      onClick={() => openAudiobook(chapterId)}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2.5 rounded-full bg-black/50 border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/60 backdrop-blur-sm transition-all duration-200"
      aria-label="Listen to this chapter"
      title="Listen to this chapter"
    >
      <Volume2 className="w-5 h-5" />
      <span className="text-xs font-medium hidden sm:inline">Listen</span>
    </button>
  );
};

export default PageAudioPlayer;
