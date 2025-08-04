import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFilterDisplayProps {
  filters: ActiveFilter[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

const ActiveFilterDisplay = ({ filters, onRemoveFilter, onClearAll }: ActiveFilterDisplayProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/10 rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
      
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
          <span className="text-xs font-medium">{filter.label}:</span>
          <span className="text-xs">{filter.value}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 ml-1 hover:bg-destructive/10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Removing filter:", filter.key);
              onRemoveFilter(filter.key);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clearing all filters");
          onClearAll();
        }}
        className="text-xs h-6"
      >
        Clear All
      </Button>
    </div>
  );
};

export default ActiveFilterDisplay;