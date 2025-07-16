import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Eye, Play, Pause, RotateCcw, Settings, TrendingUp, Target, AlertTriangle } from "lucide-react";

const VRTherapyInterface = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [selectedEnvironment, setSelectedEnvironment] = useState("beach");
    const [difficulty, setDifficulty] = useState([3]);
    const [balance, setBalance] = useState(68);
    const [gazeStability, setGazeStability] = useState(72);
    const [motionTolerance, setMotionTolerance] = useState(85);
    
    const [realTimeMetrics, setRealTimeMetrics] = useState({
        headMovement: 0,
        eyeTracking: 0,
        postureStability: 0,
        nausea: 0
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSessionActive) {
            interval = setInterval(() => {
                setSessionTime(prev => prev + 1);
                
                // Simulate real-time metrics
                setRealTimeMetrics({
                    headMovement: Math.random() * 100,
                    eyeTracking: 70 + Math.random() * 30,
                    postureStability: 60 + Math.random() * 40,
                    nausea: Math.random() * 20
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive]);

    const environments = {
        beach: {
            name: "Calm Beach Walk",
            description: "Gentle waves and minimal motion",
            difficulty: "Beginner",
            color: "blue",
            icon: "🏖️"
        },
        forest: {
            name: "Forest Trail",
            description: "Natural environment with moderate challenge",
            difficulty: "Intermediate", 
            color: "green",
            icon: "🌲"
        },
        city: {
            name: "Urban Navigation",
            description: "Complex visual environment",
            difficulty: "Advanced",
            color: "purple", 
            icon: "🏙️"
        },
        space: {
            name: "Space Station",
            description: "Zero gravity training environment",
            difficulty: "Expert",
            color: "orange",
            icon: "🚀"
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = () => {
        setIsSessionActive(true);
        setSessionTime(0);
    };

    const pauseSession = () => {
        setIsSessionActive(false);
    };

    const resetSession = () => {
        setIsSessionActive(false);
        setSessionTime(0);
        setRealTimeMetrics({
            headMovement: 0,
            eyeTracking: 0,
            postureStability: 0,
            nausea: 0
        });
    };

    return (
        <div className="space-y-6">
            {/* Session Control Header */}
            <Card className="bg-blue-500/10 border-blue-400/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-blue-300 flex items-center gap-2">
                            <Eye className="h-6 w-6" />
                            VR Vestibular Rehabilitation
                        </CardTitle>
                        <Badge className={`${isSessionActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {isSessionActive ? 'Session Active' : 'Session Inactive'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Session Timer */}
                        <div className="text-center">
                            <div className="text-3xl font-mono text-blue-400 mb-2">
                                {formatTime(sessionTime)}
                            </div>
                            <div className="text-sm text-blue-200">Session Duration</div>
                            <div className="flex gap-2 justify-center mt-4">
                                <Button
                                    size="sm"
                                    onClick={isSessionActive ? pauseSession : startSession}
                                    className="bg-blue-500/20 hover:bg-blue-500/30"
                                >
                                    {isSessionActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={resetSession}
                                    className="border-blue-400/30"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Difficulty Control */}
                        <div className="space-y-3">
                            <div className="text-center">
                                <div className="text-blue-300 font-medium">Difficulty Level</div>
                                <div className="text-2xl font-bold text-blue-400">{difficulty[0]}/10</div>
                            </div>
                            <Slider
                                value={difficulty}
                                onValueChange={setDifficulty}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-blue-200">
                                <span>Easy</span>
                                <span>Moderate</span>
                                <span>Hard</span>
                            </div>
                        </div>

                        {/* Current Score */}
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {Math.round((balance + gazeStability + motionTolerance) / 3)}
                            </div>
                            <div className="text-sm text-green-200">Overall Score</div>
                            <div className="text-xs text-gray-400 mt-1">Today's Average</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Environment Selection */}
            <Card className="bg-white/5 border-gray-400/20">
                <CardHeader>
                    <CardTitle className="text-gray-300">VR Environment Selection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(environments).map(([key, env]) => (
                            <Button
                                key={key}
                                variant="outline"
                                className={`h-24 flex-col gap-2 ${
                                    selectedEnvironment === key 
                                        ? `border-${env.color}-400 bg-${env.color}-500/20` 
                                        : 'border-gray-400/30 hover:border-gray-400/50'
                                }`}
                                onClick={() => setSelectedEnvironment(key)}
                            >
                                <div className="text-2xl">{env.icon}</div>
                                <div className="text-sm font-medium">{env.name}</div>
                                <Badge variant="outline" className="text-xs">
                                    {env.difficulty}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-center text-gray-400">
                            <div className="text-lg font-medium mb-1">
                                {environments[selectedEnvironment as keyof typeof environments].name}
                            </div>
                            <div className="text-sm">
                                {environments[selectedEnvironment as keyof typeof environments].description}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-green-500/10 border-green-400/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-200">Balance Score</p>
                                <p className="text-2xl font-bold text-green-400">{balance}%</p>
                            </div>
                            <Target className="h-8 w-8 text-green-400" />
                        </div>
                        <Progress value={balance} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/10 border-blue-400/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-200">Gaze Stability</p>
                                <p className="text-2xl font-bold text-blue-400">{gazeStability}%</p>
                            </div>
                            <Eye className="h-8 w-8 text-blue-400" />
                        </div>
                        <Progress value={gazeStability} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="bg-purple-500/10 border-purple-400/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-200">Motion Tolerance</p>
                                <p className="text-2xl font-bold text-purple-400">{motionTolerance}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-400" />
                        </div>
                        <Progress value={motionTolerance} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="bg-yellow-500/10 border-yellow-400/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-200">Comfort Level</p>
                                <p className="text-2xl font-bold text-yellow-400">{100 - Math.round(realTimeMetrics.nausea)}%</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                        </div>
                        <Progress value={100 - realTimeMetrics.nausea} className="mt-2 h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Live Biometric Data */}
            {isSessionActive && (
                <Card className="bg-white/5 border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-blue-300 flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Live Biometric Monitoring
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-blue-200">Head Movement Tracking</span>
                                        <span className="text-blue-400">{Math.round(realTimeMetrics.headMovement)}°/s</span>
                                    </div>
                                    <Progress value={realTimeMetrics.headMovement} className="h-2" />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-green-200">Eye Tracking Accuracy</span>
                                        <span className="text-green-400">{Math.round(realTimeMetrics.eyeTracking)}%</span>
                                    </div>
                                    <Progress value={realTimeMetrics.eyeTracking} className="h-2" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-200">Posture Stability</span>
                                        <span className="text-purple-400">{Math.round(realTimeMetrics.postureStability)}%</span>
                                    </div>
                                    <Progress value={realTimeMetrics.postureStability} className="h-2" />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-red-200">Motion Sickness Index</span>
                                        <span className="text-red-400">{Math.round(realTimeMetrics.nausea)}%</span>
                                    </div>
                                    <Progress value={realTimeMetrics.nausea} className="h-2" />
                                </div>
                            </div>
                        </div>
                        
                        {realTimeMetrics.nausea > 15 && (
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Comfort Alert</span>
                                </div>
                                <div className="text-sm text-yellow-200 mt-1">
                                    Consider reducing difficulty level or taking a brief break.
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Session Summary */}
            <Card className="bg-white/5 border-gray-400/20">
                <CardHeader>
                    <CardTitle className="text-gray-300">Today's Progress Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-400">3</div>
                            <div className="text-sm text-blue-200">Sessions</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-400">47</div>
                            <div className="text-sm text-green-200">Minutes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-400">+12%</div>
                            <div className="text-sm text-purple-200">Improvement</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-400">0</div>
                            <div className="text-sm text-orange-200">Falls</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VRTherapyInterface;