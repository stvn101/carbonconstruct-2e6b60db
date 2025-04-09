
import { useState } from 'react';
import { 
  Calculator, 
  Save, 
  FolderPlus, 
  FileSpreadsheet, 
  BookmarkCheck,
  ListFilter,
  Search,
  Tag,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HelpTutorial = () => {
  const [showAllSteps, setShowAllSteps] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">How to Use Carbon Calculator</h1>
        <p className="text-muted-foreground">A step-by-step guide to help you make the most of our carbon calculator</p>
      </div>

      <div className="helper-tip mb-8">
        <div className="helper-tip-title">Quick Start Guide</div>
        <div className="helper-tip-content">
          <p>The Carbon Calculator helps you track and measure the carbon footprint of your construction projects. 
          Follow this tutorial to learn how to create, save, and manage your projects.</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-carbon-600" />
            Using the Carbon Calculator
          </CardTitle>
          <CardDescription>Learn how to calculate emissions for your construction projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="tutorial-step">
              <div className="tutorial-step-number">1</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Name Your Project</div>
                <div className="tutorial-step-description">
                  Start by giving your project a name at the top of the calculator page. This will help you identify it later in your projects list.
                </div>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="tutorial-step-number">2</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Add Materials</div>
                <div className="tutorial-step-description">
                  In the Materials tab, select material types and enter quantities. Click "Add Material" for additional materials.
                </div>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="tutorial-step-number">3</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Enter Transport Details</div>
                <div className="tutorial-step-description">
                  Move to the Transport tab to add transportation methods, distances, and weights.
                </div>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="tutorial-step-number">4</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Include Energy Usage</div>
                <div className="tutorial-step-description">
                  Add energy consumption details in the Energy tab.
                </div>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="tutorial-step-number">5</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Calculate Results</div>
                <div className="tutorial-step-description">
                  Once all data is entered, click "Calculate Results" to view your project's carbon footprint.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-carbon-600" />
            Saving & Managing Projects
          </CardTitle>
          <CardDescription>Learn how to save, access, and manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="tutorial-step">
              <div className="tutorial-step-number">1</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Save Your Project</div>
                <div className="tutorial-step-description">
                  After naming your project, click the "Save Project" button at the top of the calculator. This saves all materials, transport, and energy data.
                </div>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="tutorial-step-number">2</div>
              <div className="tutorial-step-content">
                <div className="tutorial-step-title">Access Your Projects</div>
                <div className="tutorial-step-description">
                  View all your saved projects by clicking on "Projects" in the navigation menu. From there, you can view, edit, or delete projects.
                </div>
              </div>
            </div>

            {showAllSteps && (
              <>
                <div className="tutorial-step">
                  <div className="tutorial-step-number">3</div>
                  <div className="tutorial-step-content">
                    <div className="tutorial-step-title">Filter & Search Projects</div>
                    <div className="tutorial-step-description">
                      Use the search bar and tag filters on the Projects page to quickly find specific projects.
                    </div>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="tutorial-step-number">4</div>
                  <div className="tutorial-step-content">
                    <div className="tutorial-step-title">Edit Project Details</div>
                    <div className="tutorial-step-description">
                      Click on any project card to view and edit all project details, including materials, transport, and energy inputs.
                    </div>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="tutorial-step-number">5</div>
                  <div className="tutorial-step-content">
                    <div className="tutorial-step-title">Export Results</div>
                    <div className="tutorial-step-description">
                      Export your project results to PDF or CSV format for reporting and documentation.
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAllSteps(!showAllSteps)}
              >
                {showAllSteps ? "Show Less" : "Show More Steps"} 
                <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showAllSteps ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          className="bg-carbon-600 hover:bg-carbon-700 text-white" 
          asChild
        >
          <a href="/projects">
            View Your Projects
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default HelpTutorial;
