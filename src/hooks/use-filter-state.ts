import { useState, useCallback, useMemo } from "react";
import { ClassFilters } from "./use-filtered-classes";

interface FilterLabels {
  [key: string]: string;
}

const FILTER_LABELS: FilterLabels = {
  classMode: "Class Mode",
  classFormat: "Class Format", 
  classSize: "Class Size",
  classDuration: "Class Duration",
  paymentModel: "Payment Model"
};

const VALUE_LABELS: FilterLabels = {
  online: "Online",
  offline: "Offline",
  live: "Live",
  recorded: "Recorded",
  inbound: "Inbound",
  outbound: "Outbound",
  group: "Group",
  "1-on-1": "1-on-1",
  finite: "Finite",
  infinite: "Infinite",
  "one-time": "One-time",
  subscription: "Subscription"
};

export interface UseFilterStateReturn {
  // Filter values
  classMode: "online" | "offline";
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  classSize: "group" | "1-on-1"; 
  classDuration: "finite" | "infinite";
  paymentModel: "one-time" | "subscription";
  
  // Setters
  setClassMode: (value: "online" | "offline") => void;
  setClassFormat: (value: "live" | "recorded" | "inbound" | "outbound") => void;
  setClassSize: (value: "group" | "1-on-1") => void;
  setClassDuration: (value: "finite" | "infinite") => void;
  setPaymentModel: (value: "one-time" | "subscription") => void;
  
  // Filter state management
  filtersApplied: boolean;
  setFiltersApplied: (applied: boolean) => void;
  
  // Active filters display
  activeFilters: Array<{ key: string; label: string; value: string }>;
  
  // Filter management functions
  removeFilter: (key: string) => void;
  clearAllFilters: () => void;
  
  // Get current filter values for queries
  getFilterValues: () => ClassFilters;
}

export const useFilterState = (): UseFilterStateReturn => {
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  const [paymentModel, setPaymentModel] = useState<"one-time" | "subscription">("one-time");
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Generate active filters array - only show non-default values
  const activeFilters = useMemo(() => {
    if (!filtersApplied) return [];
    
    const filters = [];
    
    // Only show filters that are not at their default values
    if (classMode !== "online") {
      filters.push({ key: "classMode", label: FILTER_LABELS.classMode, value: VALUE_LABELS[classMode] });
    }
    if (classFormat !== "live") {
      filters.push({ key: "classFormat", label: FILTER_LABELS.classFormat, value: VALUE_LABELS[classFormat] });
    }
    if (classSize !== "group") {
      filters.push({ key: "classSize", label: FILTER_LABELS.classSize, value: VALUE_LABELS[classSize] });
    }
    if (classDuration !== "finite") {
      filters.push({ key: "classDuration", label: FILTER_LABELS.classDuration, value: VALUE_LABELS[classDuration] });
    }
    if (paymentModel !== "one-time") {
      filters.push({ key: "paymentModel", label: FILTER_LABELS.paymentModel, value: VALUE_LABELS[paymentModel] });
    }
    
    return filters;
  }, [filtersApplied, classMode, classFormat, classSize, classDuration, paymentModel]);

  // Remove individual filter
  const removeFilter = useCallback((key: string) => {
    console.log("removeFilter called with key:", key);
    switch (key) {
      case "classMode":
        console.log("Resetting classMode to online");
        setClassMode("online");
        break;
      case "classFormat":
        console.log("Resetting classFormat to live");
        setClassFormat("live");
        break;
      case "classSize":
        console.log("Resetting classSize to group");
        setClassSize("group");
        break;
      case "classDuration":
        console.log("Resetting classDuration to finite");
        setClassDuration("finite");
        break;
      case "paymentModel":
        console.log("Resetting paymentModel to one-time");
        setPaymentModel("one-time");
        break;
    }
    
    // Check if all filters are now back to defaults after this removal
    setTimeout(() => {
      const allDefaults = (
        (key === "classMode" ? "online" : classMode) === "online" &&
        (key === "classFormat" ? "live" : classFormat) === "live" &&
        (key === "classSize" ? "group" : classSize) === "group" &&
        (key === "classDuration" ? "finite" : classDuration) === "finite" &&
        (key === "paymentModel" ? "one-time" : paymentModel) === "one-time"
      );
      
      console.log("All filters at defaults after removal:", allDefaults);
      if (allDefaults) {
        console.log("All filters are at defaults, setting filtersApplied to false");
        setFiltersApplied(false);
      }
    }, 0);
  }, [classMode, classFormat, classSize, classDuration, paymentModel]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setClassMode("online");
    setClassFormat("live");
    setClassSize("group");
    setClassDuration("finite");
    setPaymentModel("one-time");
    setFiltersApplied(false);
  }, []);

  // Get current filter values for queries
  const getFilterValues = useCallback((): ClassFilters => {
    console.log("getFilterValues called, filtersApplied:", filtersApplied);
    if (!filtersApplied) return {};
    
    const filters: ClassFilters = {};
    
    // Only include filters that are different from default values
    if (classMode !== "online") {
      filters.classMode = classMode;
    }
    if (classFormat !== "live") {
      filters.classFormat = classFormat;
    }
    if (classSize !== "group") {
      filters.classSize = classSize;
    }
    if (classDuration !== "finite") {
      filters.classDuration = "recurring" as const;
    }
    if (paymentModel !== "one-time") {
      filters.paymentModel = paymentModel;
    }
    
    console.log("Returning filter values:", filters);
    return filters;
  }, [filtersApplied, classMode, classFormat, classSize, classDuration, paymentModel]);

  return {
    classMode,
    classFormat,
    classSize,
    classDuration,
    paymentModel,
    setClassMode,
    setClassFormat,
    setClassSize,
    setClassDuration,
    setPaymentModel,
    filtersApplied,
    setFiltersApplied,
    activeFilters,
    removeFilter,
    clearAllFilters,
    getFilterValues
  };
};