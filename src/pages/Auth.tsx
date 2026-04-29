import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, continueAsGuest } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) toast.error("Sign in failed", { description: error.message });
    else {
      toast.success("Welcome back", { description: "Your journey continues." });
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (signupPassword.length < 6) {
      toast.error("Password too short", { description: "Use at least 6 characters." });
      setIsLoading(false);
      return;
    }
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    if (error) toast.error("Sign up failed", { description: error.message });
    else {
      toast.success("Account created", { description: "Welcome to your journey." });
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  };

  const handleGuestMode = () => {
    continueAsGuest();
    toast.info("Guest mode", { description: "Progress will not persist across sessions." });
    navigate(from, { replace: true });
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "Still here";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  })();

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white relative overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="fixed inset-0 z-0">
        <img
          src={authHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(8,8,12,0.55)_55%,_rgba(8,8,12,0.95)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/30 to-gray-950" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] rounded-full bg-orange-300/70 shadow-[0_0_8px_rgba(251,146,60,0.7)] animate-[float_6s_ease-in-out_infinite]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${(i * 0.4).toFixed(2)}s`,
                animationDuration: `${5 + Math.random() * 4}s`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating back nav */}
      <Link
        to="/"
        className="fixed top-5 left-5 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      {/* Editorial layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left: editorial hero text */}
        <section className="lg:w-1/2 flex flex-col justify-end lg:justify-center px-6 sm:px-10 lg:px-16 pt-24 pb-8 lg:py-16">
          <p className="text-[10px] tracking-[0.5em] uppercase text-orange-300/80 mb-4">
            {greeting} · Phoenix Journey
          </p>
          <h1 className="font-serif font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Rise from <em className="italic text-orange-300/90">stillness</em>,
            <br />
            into the <span className="text-orange-400">flame</span>.
          </h1>
          <p className="mt-6 max-w-md text-white/65 font-serif italic text-lg leading-relaxed">
            A clinical, Agentic companion for traumatic brain injury recovery —
            built on INCOG 2.0 evidence, paced for fragile minds.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <span>INCOG 2.0</span>
            <span className="w-6 h-px bg-white/20" />
            <span>NINDS Aligned</span>
            <span className="w-6 h-px bg-white/20" />
            <span>Beta</span>
          </div>
        </section>

        {/* Right: glass auth panel */}
        <section className="lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 pb-16 lg:py-16">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
              <div className="px-7 pt-7 pb-2 text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/70 mb-2">Enter</p>
                <h2 className="font-serif text-2xl text-white">Your Journey Awaits</h2>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <div className="px-7 pt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-white/[0.04] border border-white/10 h-10">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-200 text-white/60 text-xs tracking-[0.2em] uppercase"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-200 text-white/60 text-xs tracking-[0.2em] uppercase"
                    >
                      Begin
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="login" className="m-0">
                  <form onSubmit={handleLogin} className="px-7 py-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-[10px] tracking-[0.3em] uppercase text-white/50">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 h-11 focus-visible:ring-orange-400/40 focus-visible:border-orange-400/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-[10px] tracking-[0.3em] uppercase text-white/50">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 h-11 focus-visible:ring-orange-400/40 focus-visible:border-orange-400/40"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-[0_8px_30px_-8px_rgba(251,146,60,0.6)] tracking-[0.2em] uppercase text-xs"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="m-0">
                  <form onSubmit={handleSignup} className="px-7 py-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-[10px] tracking-[0.3em] uppercase text-white/50">Your Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="How shall we call you?"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 h-11 focus-visible:ring-orange-400/40 focus-visible:border-orange-400/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-[10px] tracking-[0.3em] uppercase text-white/50">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 h-11 focus-visible:ring-orange-400/40 focus-visible:border-orange-400/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-[10px] tracking-[0.3em] uppercase text-white/50">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 h-11 focus-visible:ring-orange-400/40 focus-visible:border-orange-400/40"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-[0_8px_30px_-8px_rgba(251,146,60,0.6)] tracking-[0.2em] uppercase text-xs"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Begin Journey"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="px-7 pb-6">
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-[10px] tracking-[0.4em] uppercase text-white/30">Or</span>
                  </div>
                </div>
                <button
                  onClick={handleGuestMode}
                  className="w-full text-center text-white/60 hover:text-white transition-colors py-2 text-sm font-serif italic"
                >
                  Wander as a guest
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-white/30 not-italic mt-1">
                    Progress not saved
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-white/30">
              Encrypted · Private · Yours
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
