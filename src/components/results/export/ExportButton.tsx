
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface ExportButtonProps {
  onClick: () => void;
  icon?: "file" | "download";
  disabled?: boolean;
  variant?: "default" | "outline";
  children: React.ReactNode;
}

const ExportButton = ({ 
  onClick, 
  icon = "file",
  disabled = false,
  variant = "outline",
  children 
}: ExportButtonProps) => {
  const Icon = icon === "file" ? FileText : Download;
  
  return (
    <Button
      onClick={onClick}
      className="flex-1"
      variant={variant}
      disabled={disabled}
    >
      <Icon className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
};

export default ExportButton;
