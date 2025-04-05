
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, GraduationCap, Download } from "lucide-react";

const EducationalResources = () => {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Educational Resources</h1>
        <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
          Learn about carbon footprinting, sustainable construction practices, and how to use our tools effectively.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Tabs defaultValue="guides" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 w-full max-w-3xl mx-auto">
            <TabsTrigger value="guides" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides to help you get the most out of CarbonConstruct.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-40 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Getting Started</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      A comprehensive guide to get you up and running with CarbonConstruct.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-40 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Material Database</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Learn how to use and contribute to our material emissions database.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-40 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Advanced Reporting</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Create detailed reports and visualizations from your project data.
                    </p>
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentation">
            <Card>
              <CardHeader>
                <CardTitle>Technical Documentation</CardTitle>
                <CardDescription>
                  Detailed technical documentation and reference materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <h3 className="text-lg font-medium mb-4 text-carbon-800 dark:text-carbon-200">API Reference</h3>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                        <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Authentication</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-2">
                          Learn how to authenticate with our API and manage API keys.
                        </p>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          View Documentation
                        </Button>
                      </div>
                      
                      <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                        <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Endpoints</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-2">
                          Complete reference of all available API endpoints and methods.
                        </p>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          View Documentation
                        </Button>
                      </div>
                      
                      <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                        <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Data Models</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-2">
                          Detailed description of all data models and structures.
                        </p>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <h3 className="text-lg font-medium mb-4 text-carbon-800 dark:text-carbon-200">Calculation Methodology</h3>
                    <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                      Detailed explanation of our carbon calculation methodologies and data sources.
                    </p>
                    <Button className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Learn visually with our instructional videos and tutorials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-48 rounded-lg flex items-center justify-center mb-4 relative">
                      <Video className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-carbon-600 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-carbon-50 dark:bg-carbon-800 flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full bg-carbon-600 flex items-center justify-center">
                              <span className="border-l-[10px] border-l-white ml-1 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Quick Start Tutorial</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300">
                      Learn the basics of CarbonConstruct in under 10 minutes.
                    </p>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-48 rounded-lg flex items-center justify-center mb-4 relative">
                      <Video className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-carbon-600 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-carbon-50 dark:bg-carbon-800 flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full bg-carbon-600 flex items-center justify-center">
                              <span className="border-l-[10px] border-l-white ml-1 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Advanced Calculation Features</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300">
                      Deep dive into the advanced features of our carbon calculator.
                    </p>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-48 rounded-lg flex items-center justify-center mb-4 relative">
                      <Video className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-carbon-600 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-carbon-50 dark:bg-carbon-800 flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full bg-carbon-600 flex items-center justify-center">
                              <span className="border-l-[10px] border-l-white ml-1 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Project Management</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300">
                      Learn how to efficiently manage multiple projects and teams.
                    </p>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="bg-carbon-100 dark:bg-carbon-700 h-48 rounded-lg flex items-center justify-center mb-4 relative">
                      <Video className="h-12 w-12 text-carbon-600 dark:text-carbon-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-carbon-600 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-carbon-50 dark:bg-carbon-800 flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full bg-carbon-600 flex items-center justify-center">
                              <span className="border-l-[10px] border-l-white ml-1 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-carbon-800 dark:text-carbon-200">Reporting & Analysis</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300">
                      Create comprehensive reports and analyze your carbon data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Programs</CardTitle>
                <CardDescription>
                  Structured training programs to build expertise in carbon footprinting and our platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4 text-carbon-800 dark:text-carbon-200">Certification Courses</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-5 w-5 text-carbon-600 dark:text-carbon-400 mr-2" />
                        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">Fundamentals Certification</h4>
                      </div>
                      <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                        Master the fundamentals of carbon calculation and the CarbonConstruct platform.
                      </p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                    
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-5 w-5 text-carbon-600 dark:text-carbon-400 mr-2" />
                        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">Advanced Certification</h4>
                      </div>
                      <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                        Gain advanced skills in carbon management and optimization strategies.
                      </p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4 text-carbon-800 dark:text-carbon-200">Webinars & Workshops</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Join our regularly scheduled webinars and workshops to enhance your knowledge.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">Introduction to Carbon Footprinting</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300">June 15, 2025 • 2:00 PM AEST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">Advanced Material Selection</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300">June 22, 2025 • 2:00 PM AEST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">Reporting for Compliance</h4>
                        <p className="text-sm text-carbon-600 dark:text-carbon-300">June 29, 2025 • 2:00 PM AEST</p>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4 text-carbon-800 dark:text-carbon-200">Corporate Training</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Customized training programs for your organization's specific needs.
                  </p>
                  <Button>Request Information</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EducationalResources;
