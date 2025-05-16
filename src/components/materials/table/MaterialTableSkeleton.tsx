
import React from "react";
import { TableCell, TableRow, TableHead, TableHeader, TableBody, Table } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const MaterialTableSkeleton: React.FC = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Material</TableHead>
            <TableHead className="hidden sm:table-cell w-[20%]">Category</TableHead>
            <TableHead className="w-[25%]">Carbon Footprint</TableHead>
            <TableHead className="hidden md:table-cell">Region</TableHead>
            <TableHead className="hidden lg:table-cell">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-6 w-full max-w-[200px]" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
