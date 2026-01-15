import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Flame, Loader2, Sparkles } from "lucide-react";

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
    
    if (error) {
      toast.error("Login failed", { description: error.message });
    } else {
      toast.success("Welcome back!", { description: "Your recovery journey continues." });
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupPassword.length < 6) {
      toast.error("Password too short", { description: "Please use at least 6 characters." });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(signupEmail, signupPassword, signupName);
    
    if (error) {
      toast.error("Signup failed", { description: error.message });
    } else {
      toast.success("Account created!", { description: "Welcome to your recovery journey." });
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  const handleGuestMode = () => {
    continueAsGuest();
    toast.info("Guest mode activated", { description: "Your progress won't be saved across sessions." });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-orange-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-500 rounded-full animate-float opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Back to home */}
      <div className="absolute top-6 left-6">
        <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and title */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-xl animate-pulse" />
            <div 
              className="relative w-full h-full rounded-full border-2 border-orange-500/50 shadow-2xl"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Yellow Brick Road</h1>
            <p className="text-white/60 mt-2">Your personalized recovery journey</p>
          </div>
        </div>

        {/* Auth card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-white/60">
                    Continue your recovery journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white/80">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white/80">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Flame className="mr-2 h-4 w-4" />
                    )}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle className="text-white">Begin Your Journey</CardTitle>
                  <CardDescription className="text-white/60">
                    Create an account to save your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white/80">Your Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="How should we call you?"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white/80">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white/80">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          {/* Guest mode option */}
          <div className="px-6 pb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/40">Or</span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleGuestMode}
            >
              Continue as Guest
              <span className="ml-2 text-xs text-white/40">(progress not saved)</span>
            </Button>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="text-center text-white/40 text-sm space-y-2">
          <p>Your data is encrypted and secure</p>
          <p>Based on INCOG 2.0 clinical standards</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
