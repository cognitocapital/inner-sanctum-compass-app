import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const READING_ORDER = [
  { path: "/disclaimer", label: "Disclaimer" },
  { path: "/dedication", label: "Dedication" },
  { path: "/prologue", label: "Prologue" },
  { path: "/introduction", label: "Introduction" },
  { path: "/chapter-1", label: "Chapter 1" },
  { path: "/chapter-2", label: "Chapter 2" },
  { path: "/chapter-3", label: "Chapter 3" },
  { path: "/chapter-4", label: "Chapter 4" },
  { path: "/chapter-5", label: "Chapter 5" },
  { path: "/chapter-6", label: "Chapter 6" },
  { path: "/chapter-7", label: "Chapter 7" },
  { path: "/chapter-8", label: "Chapter 8" },
  { path: "/chapter-9", label: "Chapter 9" },
  { path: "/chapter-10", label: "Chapter 10" },
  { path: "/chapter-11", label: "Chapter 11" },
  { path: "/chapter-12", label: "Chapter 12" },
  { path: "/chapter-13", label: "Chapter 13" },
  { path: "/chapter-14", label: "Chapter 14" },
  { path: "/chapter-15", label: "Chapter 15" },
  { path: "/chapter-16", label: "Chapter 16" },
  { path: "/chapter-17", label: "Chapter 17" },
  { path: "/chapter-18", label: "Chapter 18" },
  { path: "/chapter-19", label: "Chapter 19" },
  { path: "/chapter-20", label: "Chapter 20" },
  { path: "/chapter-21", label: "Chapter 21" },
];

interface ChapterNavArrowsProps {
  currentPath: string;
}

const ChapterNavArrows = ({ currentPath }: ChapterNavArrowsProps) => {
  const currentIndex = READING_ORDER.findIndex((c) => c.path === currentPath);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? READING_ORDER[currentIndex - 1] : null;
  const next = currentIndex < READING_ORDER.length - 1 ? READING_ORDER[currentIndex + 1] : null;

  return (
    <>
      {prev && (
        <Link
          to={prev.path}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/60 backdrop-blur-sm transition-all duration-200 group"
          title={prev.label}
          aria-label={`Previous: ${prev.label}`}
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      )}
      {next && (
        <Link
          to={next.path}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/60 backdrop-blur-sm transition-all duration-200 group"
          title={next.label}
          aria-label={`Next: ${next.label}`}
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </>
  );
};

export default ChapterNavArrows;
