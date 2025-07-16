import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, TrendingUp, Clock, Users, Award, ExternalLink, Filter, Calendar, Star } from "lucide-react";

const ResearchHub = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const researchData = {
        latest: [
            {
                title: "Neuroplasticity-Based Cognitive Rehabilitation in TBI",
                journal: "Nature Neuroscience",
                date: "2024-01-15",
                impact: 9.2,
                authors: "Smith, J. et al.",
                summary: "Comprehensive study on adaptive cognitive training protocols showing 40% improvement in executive function recovery.",
                category: "cognitive",
                tags: ["neuroplasticity", "executive function", "rehabilitation"],
                link: "#"
            },
            {
                title: "VR-Based Vestibular Rehabilitation: Clinical Outcomes",
                journal: "Journal of NeuroEngineering",
                date: "2024-01-10", 
                impact: 7.8,
                authors: "Chen, L. et al.",
                summary: "Multi-center trial demonstrating 65% improvement in balance scores using immersive VR environments.",
                category: "vestibular",
                tags: ["VR", "balance", "clinical trial"],
                link: "#"
            },
            {
                title: "Speech-Language Recovery Patterns in Moderate TBI",
                journal: "Brain Injury Medicine",
                date: "2024-01-08",
                impact: 6.5,
                authors: "Rodriguez, M. et al.",
                summary: "Longitudinal study identifying optimal timing for speech therapy interventions in TBI recovery.",
                category: "speech",
                tags: ["speech therapy", "recovery patterns", "timing"],
                link: "#"
            }
        ],
        protocols: [
            {
                name: "Mayo Clinic TBI Rehabilitation Protocol",
                version: "v2.1 (2024)",
                evidence: "Grade A",
                summary: "Comprehensive interdisciplinary approach to TBI rehabilitation with standardized assessment tools.",
                category: "general",
                phases: ["Acute", "Subacute", "Chronic"],
                outcomes: "85% patient improvement scores"
            },
            {
                name: "ACRM Cognitive Rehabilitation Guidelines",
                version: "v3.0 (2023)",
                evidence: "Grade A",
                summary: "Evidence-based recommendations for cognitive rehabilitation interventions in TBI.",
                category: "cognitive", 
                phases: ["Assessment", "Intervention", "Outcome"],
                outcomes: "Validated across 12 RCTs"
            },
            {
                name: "NIH Vestibular Rehabilitation Standards",
                version: "v1.8 (2024)",
                evidence: "Grade B+",
                summary: "Standardized protocols for balance and vestibular dysfunction in neurological conditions.",
                category: "vestibular",
                phases: ["Evaluation", "Treatment", "Maintenance"],
                outcomes: "70% reduction in fall risk"
            }
        ],
        institutions: [
            {
                name: "Mayo Clinic TBI Research Center",
                location: "Rochester, MN",
                specialties: ["Cognitive Rehabilitation", "Neuroimaging", "Biomarkers"],
                publications: 247,
                trials: 23,
                collaboration: true
            },
            {
                name: "Shepherd Center",
                location: "Atlanta, GA", 
                specialties: ["Comprehensive TBI Care", "Vocational Rehab", "Family Support"],
                publications: 189,
                trials: 18,
                collaboration: true
            },
            {
                name: "NIH NINDS",
                location: "Bethesda, MD",
                specialties: ["Basic Research", "Clinical Trials", "Policy Development"],
                publications: 1456,
                trials: 67,
                collaboration: true
            }
        ],
        trends: [
            { topic: "AI-Powered Rehabilitation", growth: "+45%", papers: 67 },
            { topic: "VR/AR Therapies", growth: "+38%", papers: 89 },
            { topic: "Precision Medicine", growth: "+32%", papers: 134 },
            { topic: "Biomarker Discovery", growth: "+28%", papers: 156 }
        ]
    };

    const filteredResearch = researchData.latest.filter(paper => 
        (selectedCategory === "all" || paper.category === selectedCategory) &&
        (searchTerm === "" || 
         paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search research papers, protocols..."
                        className="pl-10 bg-white/10 border-blue-400/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2">
                    {["all", "cognitive", "vestibular", "speech"].map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={`capitalize ${
                                selectedCategory === category 
                                    ? 'bg-blue-500/30' 
                                    : 'border-blue-400/30 hover:border-blue-400/60'
                            }`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            <Tabs defaultValue="research" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/10">
                    <TabsTrigger value="research" className="data-[state=active]:bg-blue-500/30">Latest Research</TabsTrigger>
                    <TabsTrigger value="protocols" className="data-[state=active]:bg-blue-500/30">Clinical Protocols</TabsTrigger>
                    <TabsTrigger value="institutions" className="data-[state=active]:bg-blue-500/30">Research Centers</TabsTrigger>
                    <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500/30">Trending Topics</TabsTrigger>
                </TabsList>

                <TabsContent value="research" className="space-y-4 mt-6">
                    <div className="grid gap-4">
                        {filteredResearch.map((paper, index) => (
                            <Card key={index} className="bg-white/5 border-blue-400/20 hover:border-blue-400/40 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-blue-300 text-lg leading-tight">
                                                {paper.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="h-3 w-3" />
                                                    {paper.journal}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {paper.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3" />
                                                    Impact: {paper.impact}
                                                </span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-blue-400/30 hover:bg-blue-400/10">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-blue-200 mb-3">{paper.summary}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {paper.tags.map((tag, tagIndex) => (
                                                <Badge key={tagIndex} variant="outline" className="text-xs border-blue-400/30 text-blue-400">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400">by {paper.authors}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="protocols" className="space-y-4 mt-6">
                    <div className="grid gap-4">
                        {researchData.protocols.map((protocol, index) => (
                            <Card key={index} className="bg-white/5 border-green-400/20">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-green-300">{protocol.name}</CardTitle>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                                <span>{protocol.version}</span>
                                                <Badge className="bg-green-500/20 text-green-400">{protocol.evidence}</Badge>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-green-400/30 hover:bg-green-400/10">
                                            Download
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-green-200 mb-3">{protocol.summary}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-green-300 mb-2">Treatment Phases:</h4>
                                            <div className="flex gap-1">
                                                {protocol.phases.map((phase, phaseIndex) => (
                                                    <Badge key={phaseIndex} variant="outline" className="text-xs border-green-400/30 text-green-400">
                                                        {phase}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-green-300 mb-2">Clinical Outcomes:</h4>
                                            <span className="text-sm text-green-200">{protocol.outcomes}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="institutions" className="space-y-4 mt-6">
                    <div className="grid gap-4">
                        {researchData.institutions.map((institution, index) => (
                            <Card key={index} className="bg-white/5 border-purple-400/20">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-purple-300">{institution.name}</CardTitle>
                                            <p className="text-sm text-gray-400">{institution.location}</p>
                                        </div>
                                        <Badge className="bg-purple-500/20 text-purple-400">
                                            {institution.collaboration ? "Partner" : "External"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-purple-300 mb-2">Specialties:</h4>
                                            <div className="space-y-1">
                                                {institution.specialties.map((specialty, specIndex) => (
                                                    <div key={specIndex} className="text-xs text-purple-200">• {specialty}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-400">{institution.publications}</div>
                                            <div className="text-xs text-purple-200">Publications</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-400">{institution.trials}</div>
                                            <div className="text-xs text-purple-200">Active Trials</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {researchData.trends.map((trend, index) => (
                            <Card key={index} className="bg-white/5 border-orange-400/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-orange-300">{trend.topic}</h3>
                                        <Badge className="bg-orange-500/20 text-orange-400">{trend.growth}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-orange-200">{trend.papers} papers this year</span>
                                        <TrendingUp className="h-4 w-4 text-orange-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-white/5 border-orange-400/20">
                        <CardHeader>
                            <CardTitle className="text-orange-300">Research Activity Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-orange-200">Q1 2024 Publications</span>
                                    <span className="text-orange-400">+127 papers</span>
                                </div>
                                <div className="w-full bg-gray-700/50 rounded-full h-2">
                                    <div className="bg-orange-400 h-2 rounded-full" style={{width: '85%'}}></div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-orange-200">Clinical Trials Started</span>
                                    <span className="text-orange-400">+34 trials</span>
                                </div>
                                <div className="w-full bg-gray-700/50 rounded-full h-2">
                                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '70%'}}></div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-orange-200">Technology Integration</span>
                                    <span className="text-orange-400">+67% adoption</span>
                                </div>
                                <div className="w-full bg-gray-700/50 rounded-full h-2">
                                    <div className="bg-green-400 h-2 rounded-full" style={{width: '92%'}}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ResearchHub;