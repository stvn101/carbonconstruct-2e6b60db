
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, Image as ImageIcon, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import aiService from "@/services/AIService";
import { useAIService } from "@/components/ai/AIServiceProvider";
import AIConfigModal from "@/components/ai/AIConfigModal";

const MaterialImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { isConfigured } = useAIService();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResults(null);
    }
  };
  
  const analyzeImage = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }
    
    if (!isConfigured) {
      setConfigModalOpen(true);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const results = await aiService.recognizeImage({
        image: selectedFile
      });
      setAnalysisResults(results);
    } catch (error) {
      console.error("Image analysis failed:", error);
      toast.error("Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-carbon-500" /> 
          Material Image Analysis
        </CardTitle>
        <CardDescription>
          Upload a construction site image for AI material identification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResults}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                imagePreview ? 'border-carbon-300' : 'border-gray-300'
              } transition-colors`}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative mx-auto max-w-md">
                    <img 
                      src={imagePreview} 
                      alt="Selected construction site" 
                      className="mx-auto max-h-60 rounded-md" 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        setAnalysisResults(null);
                      }}
                      size="sm"
                    >
                      Change Image
                    </Button>
                    <Button
                      type="button"
                      onClick={analyzeImage}
                      size="sm"
                      className="bg-carbon-600 hover:bg-carbon-700 text-white"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>Analyzing... <Sparkles className="ml-2 h-4 w-4 animate-pulse" /></>
                      ) : (
                        <>Analyze Materials <Sparkles className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop an image, or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Select Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Analyzing image...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            )}
            
            {!isConfigured && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 text-sm">AI Services Not Configured</h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">
                      You need to configure your API key to use material analysis.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2 border-yellow-300 bg-yellow-100/50 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-300"
                      onClick={() => setConfigModalOpen(true)}
                    >
                      Configure AI Services
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {analysisResults && (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    Analysis completed successfully
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <div className="bg-carbon-100 dark:bg-carbon-800 p-2">
                      <h3 className="font-medium text-sm">Detected Objects</h3>
                    </div>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {analysisResults.objects.map((object: any, index: number) => (
                          <li key={index} className="px-4 py-3 flex justify-between items-center">
                            <span>{object.label}</span>
                            <span className="text-sm bg-carbon-100 dark:bg-carbon-800 px-2 py-1 rounded-full">
                              {Math.round(object.confidence * 100)}% confidence
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="bg-carbon-100 dark:bg-carbon-800 p-2">
                      <h3 className="font-medium text-sm">Detected Materials</h3>
                    </div>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {analysisResults.materials.map((material: any, index: number) => (
                          <li key={index} className="px-4 py-3 flex justify-between items-center">
                            <span>{material.label}</span>
                            <span className="text-sm bg-carbon-100 dark:bg-carbon-800 px-2 py-1 rounded-full">
                              {Math.round(material.confidence * 100)}% confidence
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    setAnalysisResults(null);
                  }}
                >
                  Analyze Another Image
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <AIConfigModal open={configModalOpen} onOpenChange={setConfigModalOpen} />
    </Card>
  );
};

export default MaterialImageAnalysis;
