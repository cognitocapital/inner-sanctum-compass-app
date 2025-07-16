import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, Zap, CheckCircle, XCircle } from "lucide-react";

interface AssessmentQuestion {
    id: string;
    type: "attention" | "memory" | "executive" | "processing";
    question: string;
    options?: string[];
    correctAnswer?: string;
    timeLimit: number;
    difficulty: "easy" | "medium" | "hard";
}

const CognitiveAssessment = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [results, setResults] = useState<any>(null);

    const assessmentQuestions: AssessmentQuestion[] = [
        {
            id: "att1",
            type: "attention",
            question: "Count the number of times the letter 'A' appears in the following sequence:\nABCADEFAGHIJAKLMNOPA",
            timeLimit: 30,
            difficulty: "medium",
            correctAnswer: "5"
        },
        {
            id: "mem1", 
            type: "memory",
            question: "Remember these 5 words: HOUSE, RIVER, MOUNTAIN, BOOK, FLOWER. You will be asked to recall them later.",
            timeLimit: 15,
            difficulty: "easy"
        },
        {
            id: "exec1",
            type: "executive",
            question: "You need to plan a route from home to work with 3 stops. Which stop order is most efficient?",
            options: ["Store → Bank → Pharmacy", "Bank → Store → Pharmacy", "Pharmacy → Store → Bank"],
            timeLimit: 45,
            difficulty: "hard",
            correctAnswer: "Bank → Store → Pharmacy"
        },
        {
            id: "proc1",
            type: "processing",
            question: "Complete the pattern: 2, 4, 8, 16, ?",
            options: ["24", "32", "20", "28"],
            timeLimit: 20,
            difficulty: "medium",
            correctAnswer: "32"
        }
    ];

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [assessmentQuestions[currentQuestion].id]: answer
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < assessmentQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setTimeLeft(assessmentQuestions[currentQuestion + 1].timeLimit);
        } else {
            // Assessment complete - calculate results
            calculateResults();
        }
    };

    const calculateResults = () => {
        const domainScores = {
            attention: 0,
            memory: 0,
            executive: 0,
            processing: 0
        };

        let totalCorrect = 0;
        assessmentQuestions.forEach(q => {
            if (q.correctAnswer && answers[q.id] === q.correctAnswer) {
                domainScores[q.type]++;
                totalCorrect++;
            }
        });

        const overallScore = (totalCorrect / assessmentQuestions.length) * 100;
        
        setResults({
            overall: overallScore,
            domains: domainScores,
            interpretation: getInterpretation(overallScore),
            recommendations: getRecommendations(domainScores)
        });
    };

    const getInterpretation = (score: number): string => {
        if (score >= 85) return "Excellent cognitive function";
        if (score >= 70) return "Good cognitive function with minor areas for improvement";
        if (score >= 55) return "Moderate cognitive function requiring targeted intervention";
        return "Significant cognitive challenges requiring comprehensive rehabilitation";
    };

    const getRecommendations = (domains: any): string[] => {
        const recs = [];
        if (domains.attention === 0) recs.push("Focus on sustained attention training exercises");
        if (domains.memory === 0) recs.push("Implement working memory enhancement protocols");
        if (domains.executive === 0) recs.push("Develop executive function and planning skills");
        if (domains.processing === 0) recs.push("Increase processing speed through targeted drills");
        return recs;
    };

    if (results) {
        return (
            <div className="space-y-6">
                <Card className="bg-green-500/10 border-green-400/30">
                    <CardHeader>
                        <CardTitle className="text-green-300 flex items-center gap-2">
                            <CheckCircle className="h-6 w-6" />
                            Assessment Complete
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-green-400 mb-2">
                                {Math.round(results.overall)}%
                            </div>
                            <div className="text-green-200">{results.interpretation}</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {Object.entries(results.domains).map(([domain, score]) => (
                                <div key={domain} className="text-center p-3 bg-white/5 rounded-lg">
                                    <div className="text-xl font-bold text-blue-400">{score as number}/1</div>
                                    <div className="text-sm text-blue-200 capitalize">{domain}</div>
                                </div>
                            ))}
                        </div>

                        <Card className="bg-blue-500/10 border-blue-400/30">
                            <CardHeader>
                                <CardTitle className="text-blue-300">Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {results.recommendations.map((rec: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2 text-blue-200">
                                            <Target className="h-4 w-4 text-blue-400" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4 justify-center">
                            <Button 
                                onClick={() => {
                                    setCurrentQuestion(0);
                                    setAnswers({});
                                    setResults(null);
                                    setTimeLeft(30);
                                }}
                                className="bg-blue-500/20 hover:bg-blue-500/30"
                            >
                                Retake Assessment
                            </Button>
                            <Button variant="outline" className="border-green-400/30">
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQ = assessmentQuestions[currentQuestion];

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <Card className="bg-white/5 border-blue-400/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-400" />
                            <span className="text-blue-300">Cognitive Assessment</span>
                        </div>
                        <Badge className={`bg-${currentQ.type === 'attention' ? 'red' : currentQ.type === 'memory' ? 'green' : currentQ.type === 'executive' ? 'purple' : 'orange'}-500/20`}>
                            {currentQ.type.charAt(0).toUpperCase() + currentQ.type.slice(1)}
                        </Badge>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
                            <span className="text-gray-400">Difficulty: {currentQ.difficulty}</span>
                        </div>
                        <Progress value={((currentQuestion) / assessmentQuestions.length) * 100} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="bg-white/5 border-blue-400/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-blue-300">Assessment Question</CardTitle>
                        <div className="flex items-center gap-2 text-orange-400">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{timeLeft}s</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-lg text-blue-200 leading-relaxed whitespace-pre-line">
                        {currentQ.question}
                    </div>

                    {currentQ.options && (
                        <div className="space-y-3">
                            {currentQ.options.map((option, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={`w-full text-left justify-start h-auto p-4 ${
                                        answers[currentQ.id] === option 
                                            ? 'border-blue-400 bg-blue-500/20' 
                                            : 'border-gray-400/30 hover:border-blue-400/50'
                                    }`}
                                    onClick={() => handleAnswer(option)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            answers[currentQ.id] === option 
                                                ? 'border-blue-400 bg-blue-400' 
                                                : 'border-gray-400'
                                        }`} />
                                        <span>{option}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    )}

                    {!currentQ.options && (
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-800/50 rounded-lg min-h-20 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <Zap className="h-8 w-8 mx-auto mb-2" />
                                    <p>Cognitive processing in progress...</p>
                                    <p className="text-sm">Mental response recorded</p>
                                </div>
                            </div>
                            <Button 
                                className="w-full bg-blue-500/20 hover:bg-blue-500/30"
                                onClick={() => handleAnswer("processed")}
                            >
                                Continue
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button 
                            variant="outline" 
                            disabled={currentQuestion === 0}
                            className="border-gray-400/30"
                        >
                            Previous
                        </Button>
                        <Button 
                            onClick={nextQuestion}
                            disabled={!answers[currentQ.id]}
                            className="bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            {currentQuestion === assessmentQuestions.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Assessment Info */}
            <Card className="bg-white/5 border-gray-400/20">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-red-400 font-bold">Attention</div>
                            <div className="text-xs text-red-200">Focus & Concentration</div>
                        </div>
                        <div>
                            <div className="text-green-400 font-bold">Memory</div>
                            <div className="text-xs text-green-200">Working & Recall</div>
                        </div>
                        <div>
                            <div className="text-purple-400 font-bold">Executive</div>
                            <div className="text-xs text-purple-200">Planning & Problem-solving</div>
                        </div>
                        <div>
                            <div className="text-orange-400 font-bold">Processing</div>
                            <div className="text-xs text-orange-200">Speed & Accuracy</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CognitiveAssessment;