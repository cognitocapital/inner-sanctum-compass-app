
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Heart, 
  Wind, 
  Snowflake, 
  Target, 
  Gamepad2, 
  BookOpen, 
  Users, 
  Trophy,
  Computer
} from "lucide-react";

const Dashboard = () => {
  const journeyItems = [
    {
      title: "Phoenix Breath Academy",
      description: "Master breathing techniques for recovery and resilience",
      icon: Wind,
      link: "/breathing",
      color: "from-blue-500 to-cyan-500",
      status: "active"
    },
    {
      title: "Cold Forge Mastery",
      description: "Build mental toughness through cold exposure",
      icon: Snowflake,
      link: "/cold-exposure",
      color: "from-cyan-500 to-blue-600",
      status: "active"
    },
    {
      title: "Challenge Tracker",
      description: "Track your daily growth and achievements",
      icon: Target,
      link: "/challenges",
      color: "from-orange-500 to-red-500",
      status: "active"
    },
    {
      title: "Mind Training Grounds",
      description: "Strengthen cognitive abilities and focus",
      icon: Brain,
      link: "/mind",
      color: "from-purple-500 to-indigo-500",
      status: "active"
    },
    {
      title: "Gratitude Journey",
      description: "Cultivate appreciation and positive mindset",
      icon: Heart,
      link: "/gratitude",
      color: "from-pink-500 to-rose-500",
      status: "active"
    },
    {
      title: "TBI Recovery Programs",
      description: "Comprehensive computer-based rehabilitation resources",
      icon: Computer,
      link: "/tbi-programs",
      color: "from-indigo-500 to-purple-500",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-orange-100 mb-4 drop-shadow-lg">
            The Yellow Brick Road
          </h1>
          <p className="text-xl text-orange-200 max-w-3xl mx-auto leading-relaxed">
            Your personal journey to recovery and growth. Each step builds strength, 
            each challenge builds character, each breath builds a better you.
          </p>
        </div>

        {/* Journey Navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {journeyItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link key={index} to={item.link}>
                <Card className="group bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-orange-100 group-hover:text-white transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-center group-hover:text-orange-100 transition-colors">
                      {item.description}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-500/40">
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Book Chapters */}
        <Card className="bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-100 flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              What a Journey - The Story
            </CardTitle>
            <p className="text-orange-200">Follow the complete recovery story from beginning to transformation</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/dedication">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Dedication
                </Button>
              </Link>
              <Link to="/prologue">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Prologue
                </Button>
              </Link>
              <Link to="/introduction">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Introduction
                </Button>
              </Link>
              {Array.from({ length: 21 }, (_, i) => (
                <Link key={i} to={`/chapter-${i + 1}`}>
                  <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                    Chapter {i + 1}
                  </Button>
                </Link>
              ))}
              <Link to="/unwritten">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Unwritten Chapters
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-purple-100 flex items-center gap-3">
                <Users className="h-5 w-5" />
                Community & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 mb-4 text-sm">
                Connect with recovery resources and expert guidance for your journey.
              </p>
              <Link to="/resources">
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                  Explore Resources
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-100 flex items-center gap-3">
                <Trophy className="h-5 w-5" />
                Achievement Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-200 mb-4 text-sm">
                Track your progress and celebrate milestones on your recovery journey.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
