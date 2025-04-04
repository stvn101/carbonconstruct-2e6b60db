
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Tag, Save, FileText, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import { useCalculator } from "@/hooks/useCalculator";
import { toast } from "sonner";
import { MATERIAL_FACTORS, ENERGY_FACTORS } from "@/lib/carbonCalculations";

// Import calculator component sections
import MaterialsInputSection from "@/components/calculator/MaterialsInputSection";
import TransportInputSection from "@/components/calculator/TransportInputSection";
import EnergyInputSection from "@/components/calculator/EnergyInputSection";
import ResultsSection from "@/components/calculator/ResultsSection";
import CalculatorResults from "@/components/CalculatorResults";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProject, updateProject, deleteProject, exportProjectPDF, exportProjectCSV } = useProjects();
  
  // Get the project data
  const project = getProject(projectId || "");
  
  // Add setCalculationInput to calculator hooks
  const calculator = useCalculator();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    tags: [] as string[]
  });
  
  // Redirect if project not found
  useEffect(() => {
    if (!project && !user) {
      toast.error("Project not found");
      navigate("/dashboard");
    }
  }, [project, navigate, user]);
  
  // Load project data into calculator
  useEffect(() => {
    if (project && calculator.setCalculationInput) {
      calculator.setCalculationInput({
        materials: project.materials,
        transport: project.transport,
        energy: project.energy
      });
    }
  }, [project, calculator.setCalculationInput, project?.materials, project?.transport, project?.energy]);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle edit project
  const handleStartEdit = () => {
    setEditData({
      name: project.name,
      description: project.description || "",
      tags: project.tags || []
    });
    setIsEditing(true);
  };
  
  const handleSaveEdit = async () => {
    if (!editData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    try {
      await updateProject({
        ...project,
        name: editData.name,
        description: editData.description,
        tags: editData.tags
      });
      setIsEditing(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };
  
  // Handle delete project
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(project.id);
        toast.success("Project deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };
  
  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim();
      if (!editData.tags.includes(newTag)) {
        setEditData({
          ...editData,
          tags: [...editData.tags, newTag]
        });
      }
      e.currentTarget.value = '';
    }
  };
  
  // Handle remove tag
  const handleRemoveTag = (tag: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter(t => t !== tag)
    });
  };
  
  // Material, transport, and energy data for display
  const materialList = project.materials.map(m => ({
    name: MATERIAL_FACTORS[m.type].name,
    quantity: m.quantity,
    unit: MATERIAL_FACTORS[m.type].unit
  }));
  
  const energyList = project.energy.map(e => ({
    name: ENERGY_FACTORS[e.type].name,
    amount: e.amount,
    unit: ENERGY_FACTORS[e.type].unit
  }));

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{project.name} | CarbonConstruct</title>
        <meta name="description" content={`Details for project: ${project.name}`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          {/* Project Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  {isEditing ? (
                    <Input
                      placeholder="Project Name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                  )}
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created on {formatDate(project.createdAt)}
                  </div>
                  {isEditing ? (
                    <Textarea
                      placeholder="Project Description"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="mt-2"
                    />
                  ) : (
                    project.description && (
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    )
                  )}
                  
                  {/* Tags */}
                  <div className="flex items-center mt-3">
                    {isEditing ? (
                      <>
                        <Input
                          type="text"
                          placeholder="Add tags..."
                          onKeyDown={handleTagInput}
                          className="mr-2 text-sm"
                        />
                        {editData.tags.map(tag => (
                          <Badge key={tag} className="mr-1.5 rounded-full px-2 py-0.5 text-xs">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                              &times;
                            </button>
                          </Badge>
                        ))}
                      </>
                    ) : (
                      project.tags && project.tags.length > 0 && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                          {project.tags.map(tag => (
                            <Badge key={tag} className="mr-1.5 rounded-full px-2 py-0.5 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
                
                {/* Edit/Save & Delete Buttons */}
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleStartEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Project
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {/* Project Tabs */}
          <Tabs defaultValue="details" className="mb-4">
            <TabsList>
              <TabsTrigger value="details" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Project Details
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Calculator
              </TabsTrigger>
            </TabsList>
            
            {/* Project Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    A summary of the materials, transport, and energy used in this project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Materials</h3>
                    <ul className="list-disc pl-5">
                      {materialList.map((material, index) => (
                        <li key={index}>
                          {material.name}: {material.quantity} {material.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Transport</h3>
                    <ul className="list-disc pl-5">
                      {project.transport.map((transport, index) => (
                        <li key={index}>
                          {transport.type}: {transport.distance} km, {transport.weight} kg
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Energy</h3>
                    <ul className="list-disc pl-5">
                      {energyList.map((energy, index) => (
                        <li key={index}>
                          {energy.name}: {energy.amount} {energy.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Export Options */}
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => exportProjectPDF(project)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" onClick={() => exportProjectCSV(project)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </TabsContent>
            
            {/* Calculator Tab */}
            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Calculator</CardTitle>
                  <CardDescription>
                    Modify the project details and recalculate the carbon footprint.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="materials">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                      <TabsTrigger value="transport">Transport</TabsTrigger>
                      <TabsTrigger value="energy">Energy</TabsTrigger>
                      <TabsTrigger value="results">Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="materials">
                      <MaterialsInputSection 
                        materials={calculator.calculationInput.materials}
                        onUpdateMaterial={calculator.handleUpdateMaterial}
                        onAddMaterial={calculator.handleAddMaterial}
                        onRemoveMaterial={calculator.handleRemoveMaterial}
                        onNext={calculator.handleNextTab}
                      />
                    </TabsContent>
                    
                    <TabsContent value="transport">
                      <TransportInputSection 
                        transportItems={calculator.calculationInput.transport}
                        onUpdateTransport={calculator.handleUpdateTransport}
                        onAddTransport={calculator.handleAddTransport}
                        onRemoveTransport={calculator.handleRemoveTransport}
                        onNext={calculator.handleNextTab}
                        onPrev={calculator.handlePrevTab}
                      />
                    </TabsContent>
                    
                    <TabsContent value="energy">
                      <EnergyInputSection 
                        energyItems={calculator.calculationInput.energy}
                        onUpdateEnergy={calculator.handleUpdateEnergy}
                        onAddEnergy={calculator.handleAddEnergy}
                        onRemoveEnergy={calculator.handleRemoveEnergy}
                        onCalculate={calculator.handleNextTab}
                        onPrev={calculator.handlePrevTab}
                      />
                    </TabsContent>
                    
                    <TabsContent value="results">
                      <ResultsSection 
                        calculationResult={calculator.calculationResult}
                        materials={calculator.calculationInput.materials}
                        transport={calculator.calculationInput.transport}
                        energy={calculator.calculationInput.energy}
                        onCalculate={calculator.handleCalculate}
                        onPrev={calculator.handlePrevTab}
                      />
                    </TabsContent>
                  </Tabs>
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

export default ProjectDetail;
