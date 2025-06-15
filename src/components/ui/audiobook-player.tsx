import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

interface Chapter {
  title: string;
  text: string;
  route: string;
}

interface AudiobookPlayerProps {
  apiKey?: string;
  voiceId?: string;
}

const chapters: Chapter[] = [
  {
    title: "Prologue",
    text: "The main purpose for writing this book is to help others navigate the foreign landscape of traumatic brain injury. When I was first injured, it felt like the resources available outside of specialized units, like the Brain Injury Rehabilitation Unit, had huge voids in patient care and guidance on what to expect...",
    route: "/prologue"
  },
  {
    title: "Introduction",
    text: "What a journey. It's a term I would often say to my Dad on one of our work days as he would drive me to look at work sites, because I could not drive after my brain injury. We were trying to keep my business going and work progressing for my team of roofing tradesmen...",
    route: "/introduction"
  },
  {
    title: "Chapter 1: The Day Everything Changed",
    text: "Australia Day 2024. A date I'll never forget, though I wish I could. It was supposed to be a celebration, a day of joy and national pride. Instead, it became the day my world turned upside down, literally and figuratively...",
    route: "/chapter-1"
  },
  {
    title: "Chapter 2: The Hospital Stay",
    text: "The next few days exist in a haze of sterile hospital corridors, the constant beeping of machines, and the worried faces of family members. The medical team was thorough but cautious—traumatic brain injuries are unpredictable beasts...",
    route: "/chapter-2"
  }
];

export const AudiobookPlayer = ({ apiKey, voiceId = "9BWtsMINqrJLrRacOk9x" }: AudiobookPlayerProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const currentChapter = chapters[currentChapterIndex];

  const generateAudio = async (text: string) => {
    if (!apiKey) {
      alert("Please add your ElevenLabs API key to enable audiobook");
      return null;
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate audio');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  };

  const handlePlayPause = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (audio && !audio.ended) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const audioUrl = await generateAudio(currentChapter.text);
      if (!audioUrl) return;

      const newAudio = new Audio(audioUrl);
      newAudio.volume = isMuted ? 0 : volume;
      
      newAudio.onended = () => {
        setIsPlaying(false);
        // Auto-play next chapter
        if (currentChapterIndex < chapters.length - 1) {
          setCurrentChapterIndex(currentChapterIndex + 1);
          setTimeout(() => handlePlayPause(), 1000);
        }
      };
      
      setAudio(newAudio);
      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      if (audio) {
        audio.pause();
        setIsPlaying(false);
        setAudio(null);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      if (audio) {
        audio.pause();
        setIsPlaying(false);
        setAudio(null);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audio) {
      audio.volume = isMuted ? volume : 0;
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-orange-500/10 border-orange-500/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-orange-600 flex items-center justify-center gap-2">
          <Volume2 className="h-5 w-5" />
          Complete Audiobook Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chapter Display */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {currentChapter.title}
          </h3>
          <p className="text-sm text-gray-600">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex === 0}
            variant="outline"
            size="sm"
            className="border-orange-500/50 hover:bg-orange-500/10"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white w-16 h-16 rounded-full"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            variant="outline"
            size="sm"
            className="border-orange-500/50 hover:bg-orange-500/10"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (audio) audio.volume = isMuted ? 0 : newVolume;
            }}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Chapter Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 text-center">Select Chapter:</p>
          <div className="grid grid-cols-2 gap-2">
            {chapters.map((chapter, index) => (
              <Button
                key={index}
                onClick={() => {
                  setCurrentChapterIndex(index);
                  if (audio) {
                    audio.pause();
                    setIsPlaying(false);
                    setAudio(null);
                  }
                }}
                variant={index === currentChapterIndex ? "default" : "outline"}
                size="sm"
                className={index === currentChapterIndex 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "border-orange-500/50 hover:bg-orange-500/10"
                }
              >
                {chapter.title.split(':')[0]}
              </Button>
            ))}
          </div>
        </div>

        {!apiKey && (
          <div className="text-center text-sm text-orange-600 bg-orange-500/10 p-3 rounded-lg">
            Add your ElevenLabs API key to enable the audiobook experience
          </div>
        )}
      </CardContent>
    </Card>
  );
};