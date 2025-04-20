
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, FolderPlus, Grid3X3 } from "lucide-react";

const ProjectsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
        <p className="text-muted-foreground">Manage your carbon footprint calculations</p>
      </div>
      <div className="mt-4 md:mt-0 space-x-2">
        <Button asChild variant="outline">
          <Link to="/projects/browse">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Browse All
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/projects/new">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
        <Button asChild className="bg-carbon-600 hover:bg-carbon-700 text-white">
          <Link to="/calculator">
            <Calculator className="h-4 w-4 mr-2" />
            New Calculation
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectsHeader;
