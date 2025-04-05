
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Upload, 
  ImageIcon, 
  BarChart2, 
  MessagesSquare, 
  Search, 
  Sparkles, 
  Leaf,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface AIResponse {
  content: string;
  loading: boolean;
}

const AIFeatures = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [materialQuery, setMaterialQuery] = useState<string>("");
  const [constructionData, setConstructionData] = useState<string>("");
  const [response, setResponse] = useState<AIResponse>({
    content: "",
    loading: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset response
      setResponse({
        content: "",
        loading: false
      });
    }
  };

  const analyzeImage = () => {
    if (!imageFile) {
      toast.error("Please upload an image first");
      return;
    }
    
    setResponse({
      content: "",
      loading: true
    });
    
    // Simulate analysis
    setTimeout(() => {
      const analyses = [
        "This appears to be reinforced concrete construction with visible steel rebar. The concrete has an estimated carbon footprint of approximately 180-220 kg CO₂e per cubic meter. Consider alternatives like geopolymer concrete which could reduce emissions by up to 80%.",
        "This image shows a steel frame structure. Based on standard emission factors, this type of steel construction typically generates about 1.46 kg CO₂e per kg of steel. Low-carbon alternatives like recycled or electric arc furnace steel could reduce the carbon footprint by 30-40%.",
        "The image shows traditional brick masonry. Each brick approximately contributes 0.22 kg CO₂e. Consider alternatives like rammed earth or hempcrete which can provide net carbon sequestration.",
        "This construction site shows heavy machinery operations. The diesel consumption from this equipment typically generates 2.68 kg CO₂e per liter. Consider hybrid or electric equipment which could reduce emissions by 40-60%."
      ];
      
      setResponse({
        content: analyses[Math.floor(Math.random() * analyses.length)],
        loading: false
      });
      
      toast.success("Image successfully analyzed!");
    }, 2000);
  };

  const generateOptimizations = () => {
    if (!constructionData) {
      toast.error("Please enter your construction data first");
      return;
    }
    
    setResponse({
      content: "",
      loading: true
    });
    
    // Simulate optimization suggestions
    setTimeout(() => {
      setResponse({
        content: `Based on your construction data, here are optimization recommendations:
        
1. Material Substitution: Replace standard concrete with low-carbon alternatives like geopolymer concrete or concrete with supplementary cementitious materials. This could reduce concrete-related emissions by 30-50%.

2. Transport Optimization: Source materials locally to reduce transport emissions. Materials transported from over 500km away are contributing approximately 15% of your total carbon footprint.

3. Construction Methods: Implementing prefabrication for structural elements could reduce waste by approximately 40% and lower associated emissions.

4. Equipment Efficiency: Your diesel equipment usage accounts for approximately 22% of project emissions. Consider using hybrid machinery or optimizing operation schedules to reduce idle time.

5. Renewable Energy: Implementing on-site renewable energy could offset approximately 35% of energy-related emissions during construction.`,
        loading: false
      });
      
      toast.success("Optimization recommendations generated!");
    }, 2500);
  };

  const askAboutMaterials = () => {
    if (!materialQuery) {
      toast.error("Please enter your question about materials");
      return;
    }
    
    setResponse({
      content: "",
      loading: true
    });
    
    // Simulate material responses
    setTimeout(() => {
      setResponse({
        content: `Here's information about "${materialQuery}":
        
${materialQuery.toLowerCase().includes("concrete") ? 
  "Concrete is one of the most carbon-intensive materials in construction, primarily due to the production of cement. Traditional concrete has an embodied carbon footprint of approximately 100-150 kg CO₂e per cubic meter. Low-carbon alternatives include:  \n\n1. Geopolymer concrete: Uses industrial by-products instead of cement, reducing carbon footprint by up to 80%\n2. Concrete with supplementary cementitious materials (SCMs): Partially replaces cement with fly ash or slag\n3. Carbon-cured concrete: Injects CO₂ during curing, sequestering carbon\n4. Hempcrete: A biocomposite material that can actually sequester carbon" 
  : 
  materialQuery.toLowerCase().includes("wood") || materialQuery.toLowerCase().includes("timber") ?
  "Wood is generally considered a low-carbon and sustainable construction material when sourced responsibly. Timber has the unique ability to sequester carbon, with approximately 1 tonne of CO₂ stored per cubic meter of wood. Cross-laminated timber (CLT) and other engineered wood products can replace carbon-intensive materials like concrete and steel in many structural applications, reducing the carbon footprint by 40-60%. Always ensure wood is sourced from certified sustainable forests."
  :
  materialQuery.toLowerCase().includes("steel") ?
  "Traditional steel production is carbon-intensive, generating approximately 1.85 kg CO₂e per kg of steel. However, recyclability makes steel more sustainable over multiple life cycles. Low-carbon alternatives include:\n\n1. Electric Arc Furnace (EAF) steel: Uses primarily recycled content and electricity\n2. Green steel: Produced using hydrogen instead of coal for reduction\n3. High-strength steel: Allows for less material use while maintaining structural integrity"
  :
  "This material has varying carbon impacts depending on production methods, transportation distances, and life cycle considerations. Consider the following for sustainable material selection:\n\n1. Locally sourced materials to reduce transportation emissions\n2. Materials with high recycled content\n3. Materials with Environmental Product Declarations (EPDs)\n4. Bio-based alternatives where structurally appropriate\n5. Materials designed for disassembly and future reuse"}`,
        loading: false
      });
      
      toast.success("Material information retrieved!");
    }, 2000);
  };
  
  const chatWithAI = () => {
    if (!query) {
      toast.error("Please enter your question");
      return;
    }
    
    setResponse({
      content: "",
      loading: true
    });
    
    // Simulate chat responses
    setTimeout(() => {
      const responses = [
        `To reduce the carbon footprint of your construction project, consider these key strategies:

1. Material selection: Choose low-carbon alternatives like mass timber instead of concrete or steel where structurally appropriate
2. Design optimization: Use generative design to minimize material quantities while maintaining structural integrity
3. Construction methods: Implement prefabrication to reduce waste and improve efficiency
4. Local sourcing: Source materials locally to minimize transportation emissions
5. Equipment efficiency: Use electric or hybrid construction equipment where possible
6. Renewable energy: Power your construction site with renewable energy sources`,
        
        `The most significant contributors to a building's embodied carbon are typically:

1. Structural elements (40-60%): Concrete foundations and frames, steel structures
2. Envelope materials (20-30%): Cladding, insulation, windows
3. Internal finishes (10-15%): Flooring, wall coverings, ceilings
4. MEP systems (5-10%): Mechanical, electrical, and plumbing components

Focus first on optimizing structural materials since they represent the largest percentage of embodied carbon.`,
        
        `The Australian National Construction Code (NCC) is beginning to address embodied carbon through:

1. The introduction of whole-life carbon assessments in future code revisions
2. Material efficiency requirements in Section J
3. Recognition of sustainably sourced timber and innovative low-carbon materials
4. Incentives for designs that facilitate future adaptation and material reuse
5. Provisions for integrated design approaches that optimize both operational and embodied carbon

Australia is also developing a National Carbon Offset Standard for Buildings to standardize carbon neutral claims.`
      ];
      
      setResponse({
        content: responses[Math.floor(Math.random() * responses.length)],
        loading: false
      });
      
      toast.success("Response generated!");
    }, 1800);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-carbon-600" />
          <h1 className="text-3xl md:text-4xl font-bold">AI-Powered Features</h1>
        </div>
        <p className="text-muted-foreground">
          Leverage artificial intelligence to optimize your carbon footprint calculations and discover sustainable alternatives
        </p>
      </div>
      
      <Tabs defaultValue="image-analysis" className="max-w-5xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="image-analysis" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image Analysis
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Carbon Optimization
          </TabsTrigger>
          <TabsTrigger value="materials" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
            <Leaf className="h-4 w-4 mr-2" />
            Material Intelligence
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
            <MessagesSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TabsContent value="image-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-carbon-600" />
                  Construction Material Analysis
                </CardTitle>
                <CardDescription>
                  Upload an image of your construction site or materials to get AI-powered carbon footprint analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <div className="flex items-center justify-center">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        {!imagePreview ? (
                          <div className="h-64 w-full border-2 border-dashed border-carbon-300 dark:border-carbon-600 rounded-lg flex items-center justify-center bg-carbon-100 dark:bg-carbon-700">
                            <div className="text-center p-4">
                              <Upload className="h-10 w-10 text-carbon-400 dark:text-carbon-500 mx-auto mb-2" />
                              <p className="text-sm text-carbon-600 dark:text-carbon-400">
                                Click or drop image here
                              </p>
                              <p className="text-xs text-carbon-500 dark:text-carbon-500 mt-1">
                                Supported formats: JPG, PNG, WEBP
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-64 w-full">
                            <img 
                              src={imagePreview} 
                              alt="Construction preview" 
                              className="h-full w-full object-cover rounded-lg" 
                            />
                            <button 
                              onClick={() => {
                                setImagePreview(null);
                                setImageFile(null);
                              }}
                              className="absolute top-2 right-2 bg-carbon-800/60 text-white p-1 rounded-full hover:bg-carbon-900/60"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                          </div>
                        )}
                        <input 
                          type="file" 
                          id="image-upload" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                        />
                      </div>
                    </label>
                  </div>
                </div>
                
                <Button 
                  onClick={analyzeImage}
                  disabled={!imageFile || response.loading}
                  className="w-full bg-carbon-600 hover:bg-carbon-700"
                >
                  {response.loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Construction Materials
                    </>
                  )}
                </Button>
                
                {response.content && (
                  <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <h3 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">AI Analysis Results:</h3>
                    <p className="text-carbon-600 dark:text-carbon-300 whitespace-pre-line">
                      {response.content}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="optimization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-carbon-600" />
                  Carbon Optimization Recommendations
                </CardTitle>
                <CardDescription>
                  Input your project details to get AI-generated optimization suggestions to reduce carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="construction-data" className="text-sm font-medium text-carbon-700 dark:text-carbon-300">
                    Enter your construction project details:
                  </label>
                  <Textarea 
                    id="construction-data" 
                    placeholder="Describe your project, including materials, construction methods, equipment used, and project location..." 
                    className="min-h-[200px] resize-none dark:bg-carbon-900 dark:border-carbon-700"
                    value={constructionData}
                    onChange={(e) => setConstructionData(e.target.value)}
                  />
                  <p className="text-xs text-carbon-500 dark:text-carbon-400">
                    The more details you provide, the more accurate our recommendations will be
                  </p>
                </div>
                
                <Button 
                  onClick={generateOptimizations}
                  disabled={!constructionData || response.loading}
                  className="w-full bg-carbon-600 hover:bg-carbon-700"
                >
                  {response.loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Generate Optimization Recommendations
                    </>
                  )}
                </Button>
                
                {response.content && (
                  <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <h3 className="font-medium mb-2 text-carbon-800 dark:text-carbon-200">Optimization Recommendations:</h3>
                    <p className="text-carbon-600 dark:text-carbon-300 whitespace-pre-line">
                      {response.content}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-carbon-600" />
                  Material Intelligence Database
                </CardTitle>
                <CardDescription>
                  Ask about construction materials and their environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="material-query" className="text-sm font-medium text-carbon-700 dark:text-carbon-300">
                    What would you like to know about construction materials?
                  </label>
                  <Input 
                    id="material-query" 
                    placeholder="e.g., What are alternatives to concrete? What's the carbon footprint of steel?" 
                    className="dark:bg-carbon-900 dark:border-carbon-700"
                    value={materialQuery}
                    onChange={(e) => setMaterialQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={askAboutMaterials}
                  disabled={!materialQuery || response.loading}
                  className="w-full bg-carbon-600 hover:bg-carbon-700"
                >
                  {response.loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrieving Information...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Get Material Information
                    </>
                  )}
                </Button>
                
                {response.content && (
                  <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <p className="text-carbon-600 dark:text-carbon-300 whitespace-pre-line">
                      {response.content}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessagesSquare className="h-5 w-5 text-carbon-600" />
                  Carbon Construction AI Assistant
                </CardTitle>
                <CardDescription>
                  Chat with our AI assistant to get answers to your sustainable construction questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="ai-query" className="text-sm font-medium text-carbon-700 dark:text-carbon-300">
                    Your question:
                  </label>
                  <Input 
                    id="ai-query" 
                    placeholder="e.g., How can I reduce the carbon footprint of my construction project?" 
                    className="dark:bg-carbon-900 dark:border-carbon-700"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={chatWithAI}
                  disabled={!query || response.loading}
                  className="w-full bg-carbon-600 hover:bg-carbon-700"
                >
                  {response.loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Response...
                    </>
                  ) : (
                    <>
                      <MessagesSquare className="h-4 w-4 mr-2" />
                      Ask Question
                    </>
                  )}
                </Button>
                
                {response.content && (
                  <div className="bg-white dark:bg-carbon-900 p-4 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <p className="text-carbon-600 dark:text-carbon-300 whitespace-pre-line">
                      {response.content}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-carbon-500 dark:text-carbon-400">
                The AI assistant uses advanced natural language processing to provide information about sustainable construction practices
              </CardFooter>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default AIFeatures;
