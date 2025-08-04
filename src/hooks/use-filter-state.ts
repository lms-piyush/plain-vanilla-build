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
    
    // Always show all applied filters, even if they match defaults
    filters.push({ key: "classMode", label: FILTER_LABELS.classMode, value: VALUE_LABELS[classMode] });
    filters.push({ key: "classFormat", label: FILTER_LABELS.classFormat, value: VALUE_LABELS[classFormat] });
    filters.push({ key: "classSize", label: FILTER_LABELS.classSize, value: VALUE_LABELS[classSize] });
    filters.push({ key: "classDuration", label: FILTER_LABELS.classDuration, value: VALUE_LABELS[classDuration] });
    filters.push({ key: "paymentModel", label: FILTER_LABELS.paymentModel, value: VALUE_LABELS[paymentModel] });
    
    return filters;
  }, [filtersApplied, classMode, classFormat, classSize, classDuration, paymentModel]);

  // Remove individual filter
  const removeFilter = useCallback((key: string) => {
    switch (key) {
      case "classMode":
        setClassMode("online");
        break;
      case "classFormat":
        setClassFormat("live");
        break;
      case "classSize":
        setClassSize("group");
        break;
      case "classDuration":
        setClassDuration("finite");
        break;
      case "paymentModel":
        setPaymentModel("one-time");
        break;
    }
    // Keep filters applied - we only removed one specific filter
    // The query will rerun with the remaining active filters
  }, []);

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
    
    const filters: ClassFilters = {
      classMode,
      classFormat,
      classSize,
      classDuration: classDuration === "finite" ? "fixed" as const : "recurring" as const,
      paymentModel
    };
    
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