
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Download, Upload, Database, Server } from "lucide-react";

const EasyIntegration = () => {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Seamless Integration</h1>
        <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
          Connect CarbonConstruct with your existing tools and software to streamline your workflow.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Tabs defaultValue="data-import" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 w-full max-w-3xl mx-auto">
            <TabsTrigger value="data-import" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <Upload className="h-4 w-4 mr-2" />
              Data Import
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <Code className="h-4 w-4 mr-2" />
              API Access
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <Download className="h-4 w-4 mr-2" />
              Data Export
            </TabsTrigger>
            <TabsTrigger value="software" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
              <Server className="h-4 w-4 mr-2" />
              Software
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-import">
            <Card>
              <CardHeader>
                <CardTitle>Import Project Data</CardTitle>
                <CardDescription>
                  Import data from various sources to get started with your carbon calculations quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Database className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Excel/CSV Import</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Import your material quantities and specifications from spreadsheets.
                    </p>
                    <Button variant="outline" className="w-full">Import Spreadsheet</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Server className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">BIM Model Import</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Extract material data directly from your BIM models.
                    </p>
                    <Button variant="outline" className="w-full">Import BIM Data</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Upload className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Project Templates</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Use pre-built templates for common construction project types.
                    </p>
                    <Button variant="outline" className="w-full">Browse Templates</Button>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-2">Supported File Formats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-white dark:bg-carbon-900 p-3 rounded-lg border border-carbon-200 dark:border-carbon-700 mb-2">
                        <p className="font-bold text-carbon-700 dark:text-carbon-300">.xlsx</p>
                      </div>
                      <p className="text-xs text-carbon-600 dark:text-carbon-400">Excel</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white dark:bg-carbon-900 p-3 rounded-lg border border-carbon-200 dark:border-carbon-700 mb-2">
                        <p className="font-bold text-carbon-700 dark:text-carbon-300">.csv</p>
                      </div>
                      <p className="text-xs text-carbon-600 dark:text-carbon-400">CSV</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white dark:bg-carbon-900 p-3 rounded-lg border border-carbon-200 dark:border-carbon-700 mb-2">
                        <p className="font-bold text-carbon-700 dark:text-carbon-300">.ifc</p>
                      </div>
                      <p className="text-xs text-carbon-600 dark:text-carbon-400">IFC</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white dark:bg-carbon-900 p-3 rounded-lg border border-carbon-200 dark:border-carbon-700 mb-2">
                        <p className="font-bold text-carbon-700 dark:text-carbon-300">.json</p>
                      </div>
                      <p className="text-xs text-carbon-600 dark:text-carbon-400">JSON</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Connect your systems directly to CarbonConstruct using our comprehensive API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700 mb-6">
                  <h3 className="text-lg font-medium mb-4">API Documentation</h3>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                      <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Authentication</h4>
                      <div className="bg-carbon-100 dark:bg-carbon-700 p-3 rounded font-mono text-sm overflow-x-auto">
                        <code className="text-carbon-800 dark:text-carbon-300">
                          POST /api/auth/token<br />
                          {`{ "api_key": "your_api_key" }`}
                        </code>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                      <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Get Materials</h4>
                      <div className="bg-carbon-100 dark:bg-carbon-700 p-3 rounded font-mono text-sm overflow-x-auto">
                        <code className="text-carbon-800 dark:text-carbon-300">
                          GET /api/v1/materials<br />
                          Authorization: Bearer {`{token}`}
                        </code>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                      <h4 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Calculate Emissions</h4>
                      <div className="bg-carbon-100 dark:bg-carbon-700 p-3 rounded font-mono text-sm overflow-x-auto">
                        <code className="text-carbon-800 dark:text-carbon-300">
                          POST /api/v1/calculate<br />
                          Authorization: Bearer {`{token}`}<br />
                          {`{ "materials": [...], "transport": [...], "energy": [...] }`}
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>Full API Documentation</Button>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">API Keys</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Generate and manage API keys to connect your systems with CarbonConstruct.
                  </p>
                  <Button>Generate API Key</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>
                  Export your project data and results in various formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Download className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Report Generation</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Generate comprehensive reports of your carbon calculations and analysis.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Database className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Data Export</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Export raw data for use in other systems or for backup purposes.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        XML
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        SQL
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">Scheduled Exports</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Set up automatic exports of your data on a regular schedule.
                  </p>
                  <Button>Configure Scheduled Exports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="software">
            <Card>
              <CardHeader>
                <CardTitle>Software Integrations</CardTitle>
                <CardDescription>
                  Connect CarbonConstruct with other software tools in your workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-white dark:bg-carbon-700 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-carbon-600 dark:text-carbon-400">A</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Autodesk</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Connect with Revit, AutoCAD, and other Autodesk software.
                    </p>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-white dark:bg-carbon-700 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-carbon-600 dark:text-carbon-400">T</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Trimble</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Integrate with SketchUp, Tekla, and other Trimble products.
                    </p>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-white dark:bg-carbon-700 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-carbon-600 dark:text-carbon-400">G</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Graphisoft</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Connect with ArchiCAD and BIMcloud.
                    </p>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">Custom Integrations</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Need to connect with another system? Our team can help build custom integrations.
                  </p>
                  <Button>Request Custom Integration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EasyIntegration;
