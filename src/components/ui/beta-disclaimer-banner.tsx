import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "beta-disclaimer-dismissed";

const BetaDisclaimerBanner = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!wasDismissed) setDismissed(false);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-900/95 border-t border-amber-500/40 backdrop-blur-sm px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            This is a beta prototype for demonstration purposes. Content is not medical advice.{" "}
            <Link to="/disclaimer" className="underline text-amber-300 hover:text-amber-200">
              See full disclaimer
            </Link>.
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-300 hover:text-white flex-shrink-0 p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BetaDisclaimerBanner;
