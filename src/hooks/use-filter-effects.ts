
import { useEffect } from "react";

interface UseFilterEffectsProps {
  classMode: "online" | "offline";
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  classDuration: "finite" | "infinite";
  setClassFormat: (format: "live" | "recorded" | "inbound" | "outbound") => void;
  setClassSize: (size: "group" | "1-on-1") => void;
  setPaymentModel: (model: "one-time" | "subscription") => void;
}

export const useFilterEffects = ({
  classMode,
  classFormat,
  classDuration,
  setClassFormat,
  setClassSize,
  setPaymentModel
}: UseFilterEffectsProps) => {
  // Effect to handle format options based on class mode
  useEffect(() => {
    if (classMode === "online") {
      setClassFormat("live");
    } else {
      setClassFormat("inbound");
    }
  }, [classMode, setClassFormat]);

  // Effect to handle class size options based on format
  useEffect(() => {
    if (classFormat === "outbound") {
      setClassSize("1-on-1");
    }
  }, [classFormat, setClassSize]);

  // Effect to handle payment model based on duration
  useEffect(() => {
    if (classDuration === "infinite") {
      setPaymentModel("subscription");
    }
  }, [classDuration, setPaymentModel]);
};
