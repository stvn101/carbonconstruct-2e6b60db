
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  FileCheck2, 
  Upload, 
  Download, 
  Link, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EasyIntegration = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100 dark:bg-carbon-800">
              <FileCheck2 className="h-6 w-6 text-carbon-700 dark:text-carbon-200" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Easy Integration</h1>
          <p className="text-lg text-muted-foreground">
            Seamlessly integrate with your existing construction management tools and processes
          </p>
        </div>
        
        <Tabs defaultValue="import" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Data Import</TabsTrigger>
            <TabsTrigger value="export">Data Export</TabsTrigger>
          </TabsList>
          
          {/* Import Tab */}
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Import Your Data
                </CardTitle>
                <CardDescription>
                  Bring your existing project data into CarbonConstruct
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 bg-carbon-50 dark:bg-carbon-900 rounded-lg p-4 border border-carbon-100 dark:border-carbon-800">
                  <h3 className="font-medium mb-2">Supported File Formats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="py-2 px-3 bg-white dark:bg-carbon-800 rounded border text-center text-sm">CSV</div>
                    <div className="py-2 px-3 bg-white dark:bg-carbon-800 rounded border text-center text-sm">XLS/XLSX</div>
                    <div className="py-2 px-3 bg-white dark:bg-carbon-800 rounded border text-center text-sm">JSON</div>
                    <div className="py-2 px-3 bg-white dark:bg-carbon-800 rounded border text-center text-sm">XML</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 px-4 mb-6 dark:border-carbon-700">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-center mb-4">
                    Drag and drop your files here, or click to browse
                  </p>
                  <Button>Select Files</Button>
                </div>
                
                <h3 className="font-medium mb-3">Integration with Popular Software</h3>
                <Table>
                  <TableCaption>
                    Direct connections to common construction management software
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Software</TableHead>
                      <TableHead>Integration Type</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">BIM 360</TableCell>
                      <TableCell>Direct API Connection</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Connect</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Procore</TableCell>
                      <TableCell>Direct API Connection</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Connect</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PlanGrid</TableCell>
                      <TableCell>File Import</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Import</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Revit</TableCell>
                      <TableCell>Plugin Available</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Get Plugin</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Export Your Results
                </CardTitle>
                <CardDescription>
                  Share your carbon footprint data with others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Export Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-carbon-50 dark:bg-carbon-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Full Report</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3">
                          Complete carbon analysis with charts and recommendations
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> PDF
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> DOCX
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-carbon-50 dark:bg-carbon-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Raw Data</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3">
                          Numerical data in spreadsheet format
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> CSV
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> XLSX
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-carbon-50 dark:bg-carbon-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Charts Only</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3">
                          Visual data for presentations
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> PNG
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Download className="h-4 w-4 mr-1" /> SVG
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <h3 className="font-medium mb-3">Direct Integration Options</h3>
                <Table>
                  <TableCaption>
                    Send data directly to other systems
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Sustainability Dashboard</TableCell>
                      <TableCell>Send to organization's ESG reporting platform</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Send Data</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">LEED Submission</TableCell>
                      <TableCell>Format data for LEED certification</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Prepare</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Client Portal</TableCell>
                      <TableCell>Share results with project stakeholders</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Share</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Integration Workflow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integration Workflow</CardTitle>
            <CardDescription>
              How CarbonConstruct works with your existing processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[42px] w-0.5 bg-carbon-100 dark:bg-carbon-700"></div>
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="h-8 w-8 rounded-full bg-carbon-100 dark:bg-carbon-700 border-4 border-background dark:border-card flex items-center justify-center z-10">
                      <span className="font-medium text-carbon-700 dark:text-carbon-200">1</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <h3 className="font-semibold text-lg mb-1">Import Project Data</h3>
                    <p className="text-muted-foreground mb-2">
                      Import material quantities, transportation details, and energy usage from your existing systems.
                    </p>
                    <div className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-lg border dark:border-carbon-700 inline-block">
                      <div className="flex items-center text-sm">
                        <Upload className="h-4 w-4 mr-2 text-carbon-500 dark:text-carbon-400" />
                        Automatic data extraction from BIM models, spreadsheets, or project management software
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="h-8 w-8 rounded-full bg-carbon-100 dark:bg-carbon-700 border-4 border-background dark:border-card flex items-center justify-center z-10">
                      <span className="font-medium text-carbon-700 dark:text-carbon-200">2</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <h3 className="font-semibold text-lg mb-1">Calculate Carbon Footprint</h3>
                    <p className="text-muted-foreground mb-2">
                      Our system automatically calculates emissions based on imported data.
                    </p>
                    <div className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-lg border dark:border-carbon-700 inline-block">
                      <div className="flex items-center text-sm">
                        <ArrowRight className="h-4 w-4 mr-2 text-carbon-500 dark:text-carbon-400" />
                        No manual data re-entry required, reducing errors and saving time
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="h-8 w-8 rounded-full bg-carbon-100 dark:bg-carbon-700 border-4 border-background dark:border-card flex items-center justify-center z-10">
                      <span className="font-medium text-carbon-700 dark:text-carbon-200">3</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <h3 className="font-semibold text-lg mb-1">Generate Reports</h3>
                    <p className="text-muted-foreground mb-2">
                      Create detailed sustainability reports and visualizations.
                    </p>
                    <div className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-lg border dark:border-carbon-700 inline-block">
                      <div className="flex items-center text-sm">
                        <FileCheck2 className="h-4 w-4 mr-2 text-carbon-500 dark:text-carbon-400" />
                        Reports designed to meet regulatory requirements and stakeholder expectations
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="h-8 w-8 rounded-full bg-carbon-100 dark:bg-carbon-700 border-4 border-background dark:border-card flex items-center justify-center z-10">
                      <span className="font-medium text-carbon-700 dark:text-carbon-200">4</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <h3 className="font-semibold text-lg mb-1">Export or Share Results</h3>
                    <p className="text-muted-foreground mb-2">
                      Send results back to your existing systems or share with stakeholders.
                    </p>
                    <div className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-lg border dark:border-carbon-700 inline-block">
                      <div className="flex items-center text-sm">
                        <Download className="h-4 w-4 mr-2 text-carbon-500 dark:text-carbon-400" />
                        Export in multiple formats or use direct integrations to update project systems
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Compatibility Statement */}
        <Alert className="border-carbon-200 bg-carbon-50 dark:bg-carbon-900 dark:border-carbon-700">
          <CheckCircle className="h-4 w-4 text-carbon-600 dark:text-carbon-300" />
          <AlertTitle>Zero Workflow Disruption</AlertTitle>
          <AlertDescription>
            CarbonConstruct works alongside your existing software without requiring any changes to your established workflows. 
            Our system adapts to your processes, not the other way around.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default EasyIntegration;
