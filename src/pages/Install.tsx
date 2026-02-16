import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share, MoreVertical, Plus, Smartphone, CheckCircle, Flame, Wifi, WifiOff, Zap } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-foreground">
      <SEOHead title="Install App - What a Journey" description="Install the What a Journey app on your device for offline reading and recovery tools." path="/install" />
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Install Phoenix
          </h1>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Flame className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Phoenix Journey</h2>
          <p className="text-slate-400">Your recovery companion, always within reach</p>
        </div>

        {/* Already Installed */}
        {isInstalled && (
          <Card className="mb-6 bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="flex items-center gap-4 p-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-emerald-400">Already Installed!</h3>
                <p className="text-sm text-slate-400">Phoenix is ready on your home screen</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Install Button (Chrome/Edge) */}
        {deferredPrompt && !isInstalled && (
          <Button 
            onClick={handleInstallClick}
            className="w-full mb-6 h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25"
          >
            <Download className="w-5 h-5 mr-2" />
            Install Phoenix App
          </Button>
        )}

        {/* iOS Instructions */}
        {isIOS && !isInstalled && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5 text-orange-400" />
                Install on iPhone/iPad
              </CardTitle>
              <CardDescription>Add Phoenix to your home screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Tap the <Share className="w-4 h-4 inline text-blue-400" /> Share button in Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Scroll down and tap <Plus className="w-4 h-4 inline" /> "Add to Home Screen"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Tap "Add" to install Phoenix</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Android Instructions */}
        {isAndroid && !deferredPrompt && !isInstalled && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5 text-orange-400" />
                Install on Android
              </CardTitle>
              <CardDescription>Add Phoenix to your home screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Tap the <MoreVertical className="w-4 h-4 inline" /> menu button in Chrome</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Tap "Install app" or "Add to Home screen"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">Tap "Install" to add Phoenix</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <h3 className="text-lg font-semibold text-white mb-4">Why Install?</h3>
        <div className="grid gap-4 mb-8">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Instant Access</h4>
                <p className="text-sm text-slate-400">Launch from your home screen like a native app</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Works Offline</h4>
                <p className="text-sm text-slate-400">Access exercises and soundscapes without internet</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Full Screen Experience</h4>
                <p className="text-sm text-slate-400">No browser bars - immersive recovery sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to App */}
        <Link to="/dashboard">
          <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
            Continue to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Install;
