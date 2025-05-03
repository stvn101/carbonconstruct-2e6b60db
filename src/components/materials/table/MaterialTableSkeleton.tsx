
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export const MaterialTableSkeleton: React.FC = () => {
  return (
    <div>
      <Table>
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
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={`loading-${i}`}>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground mt-2 flex items-center">
        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
        Loading materials...
      </p>
    </div>
  );
};
