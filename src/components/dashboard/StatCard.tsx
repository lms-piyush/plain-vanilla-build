
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard = ({ title, value, icon, delta, onClick }: StatCardProps) => {
  return (
    <Card 
      className={cn("h-full transition-all", onClick && "cursor-pointer hover:shadow-md")}
      onClick={onClick}
    >
      <CardContent className="flex flex-col p-6 h-full">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="text-[#8A5BB7]">{icon}</div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold">{value}</p>
          {delta && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  delta.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {delta.isPositive ? "+" : "-"}
                {Math.abs(delta.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                vs {title.includes("Today") ? "yesterday" : "last month"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
