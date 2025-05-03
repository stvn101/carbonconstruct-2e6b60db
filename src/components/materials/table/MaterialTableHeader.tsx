
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const MaterialTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Material</TableHead>
        <TableHead className="text-right">Carbon Factor</TableHead>
        <TableHead>Region</TableHead>
        <TableHead>Alternative For</TableHead>
        <TableHead>Sustainability</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead>Details</TableHead>
      </TableRow>
    </TableHeader>
  );
};
