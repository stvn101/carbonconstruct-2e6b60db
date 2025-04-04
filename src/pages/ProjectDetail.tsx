
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import { useCalculator } from "@/hooks/useCalculator";
import CalculatorResults from "@/components/CalculatorResults";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject, exportProjectPDF, exportProjectCSV } = useProjects();
  const { setCalculationInput } = useCalculator();
  const [project, setProject] = useState<SavedProject | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      const foundProject = getProject(id);
      if (foundProject) {
        setProject(foundProject);
        setName(foundProject.name);
        setDescription(foundProject.description || "");
        
        // Load project data into calculator for recalculation
        setCalculationInput({
          materials: foundProject.materials,
          transport: foundProject.transport,
          energy: foundProject.energy
        });
      } else {
        // Project not found
        toast.error("Project not found");
        navigate("/projects");
      }
    }
  }, [id, getProject, navigate, setCalculationInput]);

  const handleSaveChanges = async () => {
    if (project && name.trim()) {
      const updatedProject = {
        ...project,
        name,
        description
      };
      
      await updateProject(updatedProject);
      setProject(updatedProject);
      setIsEditing(false);
      toast.success("Project updated successfully");
    } else {
      toast.error("Please provide a project name");
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{project.name} | CarbonConstruct</title>
        <meta name="description" content={project.description || `Details for project ${project.name}`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          {/* Back button and project header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              asChild 
              className="mb-4"
              size={isMobile ? "sm" : "default"}
            >
              <Link to="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>

            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project Name"
                  className="text-xl font-bold"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project Description (optional)"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveChanges}
                    className="bg-carbon-600 hover:bg-carbon-700 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setName(project.name);
                      setDescription(project.description || "");
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{project.name}</h1>
                    <p className="text-muted-foreground">{project.description || "No description provided"}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                    <ExportMenu 
                      onExportPDF={() => exportProjectPDF(project)}
                      onExportCSV={() => exportProjectCSV(project)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="results" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="results" className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Results
              </TabsTrigger>
              <TabsTrigger value="inputs" className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Inputs
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="mt-6">
              {project.result ? (
                <CalculatorResults 
                  result={project.result} 
                  materials={project.materials}
                  transport={project.transport}
                  energy={project.energy}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h2 className="text-xl font-medium mb-1">No calculation results available</h2>
                  <p className="text-muted-foreground mb-4">
                    This project doesn't have any calculation results yet.
                  </p>
                  <Button 
                    asChild
                    className="bg-carbon-600 hover:bg-carbon-700 text-white"
                  >
                    <Link to="/calculator">
                      Recalculate Now
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inputs" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputSummaryCard 
                  title="Materials" 
                  items={project.materials.map(m => ({
                    name: m.type,
                    quantity: `${m.quantity} ${m.unit}`
                  }))} 
                />
                <InputSummaryCard 
                  title="Transport" 
                  items={project.transport.map(t => ({
                    name: t.type,
                    quantity: `${t.distance} km, ${t.weight} tons`
                  }))} 
                />
                <InputSummaryCard 
                  title="Energy" 
                  items={project.energy.map(e => ({
                    name: e.type,
                    quantity: `${e.amount} ${e.unit}`
                  }))} 
                />
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  asChild
                  className="bg-carbon-600 hover:bg-carbon-700 text-white"
                >
                  <Link to="/calculator">
                    Edit Inputs
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>
                    Based on your project inputs, here are suggestions to reduce carbon emissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {generateRecommendations(project).map((rec, index) => (
                      <li key={index} className="bg-carbon-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-1">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-carbon-200 px-2 py-1 rounded-full font-medium">
                            {rec.impact} Impact
                          </span>
                          <span className="text-xs bg-carbon-200 px-2 py-1 rounded-full font-medium">
                            {rec.effort} Effort
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

interface InputSummaryCardProps {
  title: string;
  items: Array<{ name: string; quantity: string }>;
}

const InputSummaryCard = ({ title, items }: InputSummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="divide-y">
            {items.map((item, index) => (
              <li key={index} className="py-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.quantity}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No {title.toLowerCase()} data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ExportMenuProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
}

const ExportMenu = ({ onExportPDF, onExportCSV }: ExportMenuProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-carbon-600 hover:bg-carbon-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Project</DialogTitle>
          <DialogDescription>
            Choose a format to export your project data
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={onExportPDF}
          >
            <FileText className="h-8 w-8 mb-2" />
            <span>Export as PDF</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center"
            onClick={onExportCSV}
          >
            <Download className="h-8 w-8 mb-2" />
            <span>Export as CSV</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to generate personalized recommendations based on project data
const generateRecommendations = (project: SavedProject) => {
  const recommendations = [
    {
      title: "Switch to Low-Carbon Concrete",
      description: "Replace standard concrete with low-carbon alternatives to reduce material emissions by up to 50%.",
      impact: "High",
      effort: "Medium"
    },
    {
      title: "Optimize Transportation Routes",
      description: "Reduce transport emissions by optimizing delivery routes and consolidating shipments.",
      impact: "Medium",
      effort: "Low"
    },
    {
      title: "Implement Renewable Energy Sources",
      description: "Use solar or wind power for construction equipment and site operations.",
      impact: "High",
      effort: "Medium"
    },
    {
      title: "Source Materials Locally",
      description: "Reduce transportation emissions by sourcing materials within a 100km radius when possible.",
      impact: "Medium",
      effort: "Low"
    },
    {
      title: "Use Recycled Steel",
      description: "Incorporate recycled steel to reduce material emissions by approximately 70%.",
      impact: "High",
      effort: "Low"
    }
  ];

  // In a real application, you would customize these based on actual project data
  return recommendations;
};

export default ProjectDetail;
