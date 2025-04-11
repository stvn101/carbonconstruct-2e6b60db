
import React, { useState } from "react";
import { Calendar, Tag, Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SavedProject } from "@/contexts/ProjectContext";
import { toast } from "sonner";

interface ProjectHeaderProps {
  project: SavedProject;
  onUpdateProject: (updatedProject: SavedProject) => Promise<void>;
  onDelete: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onUpdateProject,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    description: project.description || "",
    tags: project.tags || []
  });

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
      await onUpdateProject({
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

  return (
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
              Created on {formatDate(project.created_at)}
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
                <Button variant="destructive" onClick={onDelete}>
                  <span>Delete Project</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProjectHeader;
