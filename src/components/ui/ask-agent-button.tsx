import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AskAgentButtonProps {
  context?: string;
  label?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
}

export const AskAgentButton = ({
  context = "",
  label = "Ask Phoenix",
  className = "",
  variant = "ghost",
}: AskAgentButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      onClick={() =>
        navigate(`/ai-companion${context ? `?context=${encodeURIComponent(context)}` : ""}`)
      }
      className={`text-orange-300 hover:text-orange-200 gap-1.5 ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      {label}
    </Button>
  );
};
