
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  PlayCircle, 
  FileText, 
  BookOpen, 
  Clock, 
  Calendar, 
  Download,
  ExternalLink,
  CheckCircle,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample educational content
const EDUCATIONAL_RESOURCES = {
  videos: [
    {
      id: 1,
      title: "Introduction to Sustainable Construction",
      description: "Learn the basics of sustainability in the construction industry.",
      duration: "15 min",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      category: "beginner",
      date: "2023-02-15"
    },
    {
      id: 2,
      title: "Low-Carbon Materials: A Comprehensive Guide",
      description: "Explore a range of sustainable materials and their applications.",
      duration: "22 min",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      category: "intermediate",
      date: "2023-04-10"
    },
    {
      id: 3,
      title: "Reducing Transportation Emissions in Construction",
      description: "Strategies for minimizing the carbon footprint of material transport.",
      duration: "18 min",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      category: "intermediate",
      date: "2023-05-22"
    },
    {
      id: 4,
      title: "Advanced Carbon Calculation Methodologies",
      description: "In-depth look at different approaches to measuring carbon emissions.",
      duration: "30 min",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      category: "advanced",
      date: "2023-06-18"
    },
    {
      id: 5,
      title: "Regulatory Compliance: Meeting Sustainability Standards",
      description: "Navigate the complex landscape of environmental regulations and certifications.",
      duration: "25 min",
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      category: "intermediate",
      date: "2023-07-05"
    },
    {
      id: 6,
      title: "Renewable Energy in Construction Projects",
      description: "Implementing solar, wind, and other renewable energy sources on site.",
      duration: "20 min",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      category: "intermediate",
      date: "2023-08-12"
    }
  ],
  guides: [
    {
      id: 1,
      title: "Beginner's Guide to Carbon Footprint Calculation",
      description: "Step-by-step instructions for calculating your project's carbon footprint.",
      pages: 15,
      format: "PDF",
      category: "beginner",
      date: "2023-03-10"
    },
    {
      id: 2,
      title: "Sustainable Material Selection Framework",
      description: "A comprehensive framework for evaluating and selecting sustainable materials.",
      pages: 28,
      format: "PDF",
      category: "intermediate",
      date: "2023-04-22"
    },
    {
      id: 3,
      title: "Carbon Reduction Strategies: Implementation Handbook",
      description: "Practical strategies and case studies for reducing carbon emissions.",
      pages: 42,
      format: "PDF",
      category: "advanced",
      date: "2023-05-15"
    },
    {
      id: 4,
      title: "Regulatory Compliance Checklist",
      description: "Ensure your projects meet all sustainability regulations and standards.",
      pages: 18,
      format: "PDF",
      category: "beginner",
      date: "2023-06-30"
    },
    {
      id: 5,
      title: "Life Cycle Assessment in Construction",
      description: "Understanding and implementing LCA methodologies in your projects.",
      pages: 35,
      format: "PDF",
      category: "advanced",
      date: "2023-07-22"
    }
  ],
  faq: [
    {
      id: 1,
      question: "What is embodied carbon in construction?",
      answer: "Embodied carbon refers to the total greenhouse gas emissions generated during the manufacturing, transportation, installation, maintenance, and disposal of building materials. Unlike operational carbon (emissions from building operation), embodied carbon is 'locked in' once construction is complete."
    },
    {
      id: 2,
      question: "How is carbon footprint calculated for a construction project?",
      answer: "Carbon footprint for construction projects is calculated by measuring greenhouse gas emissions from three main sources: materials (embodied carbon), transportation of materials and equipment to the site, and energy used during construction. Each component is converted to CO2 equivalent (CO2e) using established emission factors and then summed to get the total carbon footprint."
    },
    {
      id: 3,
      question: "What are the most effective ways to reduce a project's carbon footprint?",
      answer: "The most effective carbon reduction strategies include: 1) Material selection - choosing low-carbon alternatives like timber instead of concrete where possible; 2) Local sourcing - reducing transportation emissions; 3) Waste reduction - minimizing material waste and maximizing recycling; 4) Renewable energy - using clean energy sources for construction operations; 5) Efficient design - optimizing structural efficiency to use fewer materials."
    },
    {
      id: 4,
      question: "What are Environmental Product Declarations (EPDs) and why are they important?",
      answer: "Environmental Product Declarations (EPDs) are standardized documents that provide transparent, verified information about a product's environmental impact throughout its lifecycle. They're important because they allow for fair comparison between materials, help identify high-impact materials, and support informed decision-making for sustainable construction. Many green building certification programs now require or reward the use of materials with EPDs."
    },
    {
      id: 5,
      question: "How do green building certifications like LEED or BREEAM address carbon emissions?",
      answer: "Green building certification systems like LEED (Leadership in Energy and Environmental Design) and BREEAM (Building Research Establishment Environmental Assessment Method) address carbon emissions through various credit categories. These include energy efficiency, materials selection, construction practices, and transportation. Projects can earn points for demonstrating reduced carbon footprints, using materials with Environmental Product Declarations (EPDs), implementing whole-building life cycle assessment, and optimizing energy performance."
    },
    {
      id: 6,
      question: "What is the difference between operational and embodied carbon?",
      answer: "Operational carbon refers to the emissions produced during the building's operation (heating, cooling, lighting, etc.) over its lifetime. Embodied carbon refers to the emissions associated with materials and construction processes throughout the building's life cycle - from resource extraction and manufacturing to transportation, construction, maintenance, and end-of-life disposal. While operational carbon can be reduced over time through efficiency upgrades, embodied carbon is locked in once construction is complete."
    },
    {
      id: 7,
      question: "How can I make my existing construction practices more sustainable?",
      answer: "To make existing construction practices more sustainable: 1) Conduct a carbon footprint assessment to identify high-impact areas; 2) Implement a materials optimization strategy to reduce waste; 3) Establish a sustainable procurement policy; 4) Train workers on sustainable construction practices; 5) Invest in efficient equipment and consider renewable energy sources; 6) Set measurable sustainability targets and track progress; 7) Consider circular economy principles like design for disassembly and material reuse."
    }
  ],
  updates: [
    {
      id: 1,
      title: "New Regulatory Requirements for Carbon Reporting",
      description: "Updates on the latest regulatory changes affecting construction carbon reporting.",
      date: "2023-08-20",
      category: "regulatory"
    },
    {
      id: 2,
      title: "Breakthrough in Low-Carbon Concrete Technology",
      description: "Recent innovations in concrete formulations that significantly reduce carbon emissions.",
      date: "2023-07-15",
      category: "materials"
    },
    {
      id: 3,
      title: "Carbon Taxation Policies: What You Need to Know",
      description: "Overview of emerging carbon tax policies and their impact on construction.",
      date: "2023-06-10",
      category: "policy"
    },
    {
      id: 4,
      title: "Net Zero Construction: Industry Leaders Share Case Studies",
      description: "Learn from successful net zero carbon construction projects around the world.",
      date: "2023-05-05",
      category: "case-studies"
    }
  ]
};

// Category badges
const CategoryBadge = ({ category }: { category: string }) => {
  let color = "";
  
  switch(category) {
    case "beginner":
      color = "bg-green-500 hover:bg-green-600 text-white";
      break;
    case "intermediate":
      color = "bg-yellow-500 hover:bg-yellow-600 text-white";
      break;
    case "advanced":
      color = "bg-red-500 hover:bg-red-600 text-white";
      break;
    case "regulatory":
      color = "bg-blue-500 hover:bg-blue-600 text-white";
      break;
    case "materials":
      color = "bg-purple-500 hover:bg-purple-600 text-white";
      break;
    case "policy":
      color = "bg-orange-500 hover:bg-orange-600 text-white";
      break;
    case "case-studies":
      color = "bg-cyan-500 hover:bg-cyan-600 text-white";
      break;
    default:
      color = "bg-carbon-500 hover:bg-carbon-600 text-white";
  }
  
  return (
    <Badge className={color}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
};

const EducationalResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter resources based on search term
  const filteredVideos = EDUCATIONAL_RESOURCES.videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGuides = EDUCATIONAL_RESOURCES.guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFaqs = EDUCATIONAL_RESOURCES.faq.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUpdates = EDUCATIONAL_RESOURCES.updates.filter(update => 
    update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100 dark:bg-carbon-800">
              <GraduationCap className="h-6 w-6 text-carbon-700 dark:text-carbon-200" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Educational Resources</h1>
          <p className="text-lg text-muted-foreground">
            Learn about sustainable construction practices through our comprehensive educational materials
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text" 
              placeholder="Search resources..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Learning Path - Fixed at top */}
        <Card className="mb-8 border-carbon-200 bg-carbon-50 dark:bg-carbon-900 dark:border-carbon-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Your Sustainability Learning Path
            </CardTitle>
            <CardDescription>
              Track your progress through our educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg bg-white dark:bg-carbon-800 dark:border-carbon-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Fundamentals</span>
                    <Badge className="bg-green-500">75% Complete</Badge>
                  </div>
                  <Progress value={75} className="h-1.5 mb-2" indicatorClassName="bg-green-500" />
                  <span className="text-xs text-muted-foreground">3 of 4 modules completed</span>
                </div>
                
                <div className="p-3 border rounded-lg bg-white dark:bg-carbon-800 dark:border-carbon-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Advanced Topics</span>
                    <Badge className="bg-yellow-500">30% Complete</Badge>
                  </div>
                  <Progress value={30} className="h-1.5 mb-2" indicatorClassName="bg-yellow-500" />
                  <span className="text-xs text-muted-foreground">2 of 6 modules completed</span>
                </div>
                
                <div className="p-3 border rounded-lg bg-white dark:bg-carbon-800 dark:border-carbon-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Certification</span>
                    <Badge className="bg-red-500">0% Complete</Badge>
                  </div>
                  <Progress value={0} className="h-1.5 mb-2" indicatorClassName="bg-red-500" />
                  <span className="text-xs text-muted-foreground">0 of 3 modules completed</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto">
              Continue Learning
            </Button>
          </CardFooter>
        </Card>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="videos">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="videos" className="flex items-center">
              <PlayCircle className="h-4 w-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Updates
            </TabsTrigger>
          </TabsList>
          
          {/* Video Tutorials Tab */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden bg-carbon-100 dark:bg-carbon-800 relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button className="bg-carbon-600 hover:bg-carbon-700">
                        <PlayCircle className="h-5 w-5 mr-2" />
                        Watch Now
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{video.title}</CardTitle>
                      <CategoryBadge category={video.category} />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      {new Date(video.date).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No video tutorials found matching your search.</p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Guides Tab */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="flex md:flex-row flex-col hover:shadow-md transition-shadow">
                  <div className="md:w-1/3 bg-carbon-100 dark:bg-carbon-800 flex items-center justify-center p-6">
                    <FileText className="h-12 w-12 text-carbon-600 dark:text-carbon-300" />
                  </div>
                  <div className="md:w-2/3 flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{guide.title}</CardTitle>
                        <CategoryBadge category={guide.category} />
                      </div>
                      <CardDescription className="line-clamp-2">
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {guide.pages} pages
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(guide.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      <Button className="w-full flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download {guide.format}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
              
              {filteredGuides.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No guides found matching your search.</p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about sustainable construction and carbon footprinting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No FAQs found matching your search.</p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">
                  Submit a Question
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Updates Tab */}
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Updates</CardTitle>
                <CardDescription>
                  Stay informed with the latest developments in sustainable construction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUpdates.map((update) => (
                    <div key={update.id} className="p-4 border rounded-lg hover:border-carbon-300 dark:hover:border-carbon-600 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{update.title}</h3>
                        <CategoryBadge category={update.category} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {update.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          Published: {new Date(update.date).toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredUpdates.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No updates found matching your search.</p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-4">
                <div className="w-full flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">
                      Subscribe to receive updates via email
                    </span>
                  </div>
                  <Button className="w-full sm:w-auto">
                    Subscribe
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducationalResources;
