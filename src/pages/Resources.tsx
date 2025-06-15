import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Brain, Heart, BookOpen, Users } from "lucide-react";

const Resources = () => {
  const tbiExperts = [
    {
      name: "Dr. Daniel Amen",
      description: "Psychiatrist and brain imaging pioneer. Author of 'Change Your Brain, Change Your Life'",
      website: "https://www.amenclinics.com",
      focus: "Brain SPECT imaging and optimization"
    },
    {
      name: "Dr. Mark Gordon",
      description: "TBI specialist focusing on hormone optimization for brain injury recovery",
      website: "https://www.tbimedlegal.com",
      focus: "Hormonal approaches to TBI treatment"
    },
    {
      name: "Dr. Norman Doidge",
      description: "Neuroplasticity researcher and author of 'The Brain That Changes Itself'",
      website: "https://www.normandoidge.com",
      focus: "Neuroplasticity and brain recovery"
    },
    {
      name: "Dr. Joe Dispenza",
      description: "Neuroscientist researching meditation and brain change",
      website: "https://drjoedispenza.com",
      focus: "Meditation and neuroplasticity"
    }
  ];

  const tbiAdvocates = [
    {
      name: "Amy Zellmer",
      description: "TBI survivor, advocate, and author. Founder of TBI Tribe",
      website: "https://www.amyzellmer.com",
      focus: "TBI awareness and survivor support"
    },
    {
      name: "Cavin Balaster",
      description: "TBI survivor and motivational speaker focusing on resilience",
      website: "https://www.cavinbalaster.com",
      focus: "TBI recovery and motivation"
    },
    {
      name: "Jeff Sebell",
      description: "TBI survivor, author of 'Traumatic Brain Injury: A Survival Guide'",
      website: "https://www.jeffsebell.com",
      focus: "TBI survival strategies"
    }
  ];

  const resilienceExperts = [
    {
      name: "Dr. Rick Hanson",
      description: "Neuropsychologist and author of 'Resilient'",
      website: "https://www.rickhanson.net",
      focus: "Building inner strength and resilience"
    },
    {
      name: "Dr. Martin Seligman",
      description: "Pioneer of positive psychology and resilience research",
      website: "https://www.authentichappiness.sas.upenn.edu",
      focus: "Positive psychology and well-being"
    },
    {
      name: "Dr. Kristin Neff",
      description: "Self-compassion researcher and mindfulness expert",
      website: "https://self-compassion.org",
      focus: "Self-compassion and emotional healing"
    },
    {
      name: "Dr. Jon Kabat-Zinn",
      description: "Creator of Mindfulness-Based Stress Reduction (MBSR)",
      website: "https://www.mindfulnesscds.com",
      focus: "Mindfulness and stress reduction"
    }
  ];

  const organizations = [
    {
      name: "Brain Injury Association of America",
      description: "National organization providing education, advocacy, and support",
      website: "https://www.biausa.org",
      focus: "TBI resources and advocacy"
    },
    {
      name: "TBI Tribe",
      description: "Community and resources for TBI survivors",
      website: "https://www.tbitribe.com",
      focus: "Survivor community and support"
    },
    {
      name: "BrainLine",
      description: "Comprehensive TBI information and resources",
      website: "https://www.brainline.org",
      focus: "TBI education and support"
    },
    {
      name: "Centre for Neuro Skills",
      description: "Specialized brain injury rehabilitation",
      website: "https://www.neuroskills.com",
      focus: "TBI rehabilitation services"
    }
  ];

  const books = [
    {
      title: "The Ghost in My Brain",
      author: "Clark Elliott",
      description: "A scientist's journey through concussion and recovery",
      focus: "Personal TBI recovery story"
    },
    {
      title: "My Stroke of Insight",
      author: "Dr. Jill Bolte Taylor",
      description: "A neuroanatomist's firsthand account of stroke recovery",
      focus: "Brain injury and neuroplasticity"
    },
    {
      title: "The Body Keeps the Score",
      author: "Dr. Bessel van der Kolk",
      description: "Understanding trauma's impact on the brain and body",
      focus: "Trauma recovery and healing"
    },
    {
      title: "Peak Performance",
      author: "Brad Stulberg & Steve Magness",
      description: "Science-based strategies for optimal performance and recovery",
      focus: "Performance optimization and resilience"
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
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Table of Contents
            </Link>
          </Button>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl rounded-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-orange-600 mb-4">
              Resources for Your Journey
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Continue your path to personal growth with these influential voices in TBI recovery, 
              brain resilience, and neuroplasticity research.
            </p>
          </div>

          <div className="grid gap-8">
            {/* TBI Medical Experts */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Brain className="h-5 w-5" />
                  TBI Medical Experts & Researchers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {tbiExperts.map((expert, index) => (
                    <div key={index} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                      <h3 className="font-semibold text-gray-800 mb-2">{expert.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{expert.description}</p>
                      <p className="text-xs text-orange-600 font-medium mb-3">{expert.focus}</p>
                      <a 
                        href={expert.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Visit Website <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TBI Advocates & Survivors */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Users className="h-5 w-5" />
                  TBI Advocates & Survivor Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tbiAdvocates.map((advocate, index) => (
                    <div key={index} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                      <h3 className="font-semibold text-gray-800 mb-2">{advocate.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{advocate.description}</p>
                      <p className="text-xs text-orange-600 font-medium mb-3">{advocate.focus}</p>
                      <a 
                        href={advocate.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Learn More <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resilience & Mental Health */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Heart className="h-5 w-5" />
                  Resilience & Mental Health Experts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {resilienceExperts.map((expert, index) => (
                    <div key={index} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                      <h3 className="font-semibold text-gray-800 mb-2">{expert.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{expert.description}</p>
                      <p className="text-xs text-orange-600 font-medium mb-3">{expert.focus}</p>
                      <a 
                        href={expert.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Explore Work <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Organizations */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Users className="h-5 w-5" />
                  Support Organizations & Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {organizations.map((org, index) => (
                    <div key={index} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                      <h3 className="font-semibold text-gray-800 mb-2">{org.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{org.description}</p>
                      <p className="text-xs text-orange-600 font-medium mb-3">{org.focus}</p>
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Visit Organization <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Reading */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <BookOpen className="h-5 w-5" />
                  Recommended Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {books.map((book, index) => (
                    <div key={index} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
                      <h3 className="font-semibold text-gray-800 mb-1">"{book.title}"</h3>
                      <p className="text-sm font-medium text-gray-700 mb-2">by {book.author}</p>
                      <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                      <p className="text-xs text-orange-600 font-medium">{book.focus}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Note */}
            <Card className="border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-orange-600/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-orange-600 mb-3">
                    Remember: Your Journey is Unique
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    While these resources can provide valuable insights and support, remember that every TBI 
                    recovery journey is different. What works for one person may not work for another. 
                    Always consult with your healthcare team before making significant changes to your recovery plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;