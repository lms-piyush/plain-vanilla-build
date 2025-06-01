
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CourseDistributionChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  totalCourses?: number;
}

const CourseDistributionChart = ({ data, totalCourses }: CourseDistributionChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Course Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  return [`${value} courses`, name];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {totalCourses !== undefined && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-2xl font-bold">{totalCourses}</div>
              <div className="text-xs text-muted-foreground">Total Courses</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseDistributionChart;
