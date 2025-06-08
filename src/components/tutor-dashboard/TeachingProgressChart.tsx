
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeachingProgressChart = () => {
  // Mock data for the chart
  const teachingProgressData = [
    { month: 'Jun', teachingHours: 45, students: 52 },
    { month: 'Jul', teachingHours: 60, students: 45 },
    { month: 'Aug', teachingHours: 65, students: 58 },
    { month: 'Sep', teachingHours: 70, students: 75 },
    { month: 'Oct', teachingHours: 90, students: 100 },
    { month: 'Nov', teachingHours: 110, students: 105 },
    { month: 'Dec', teachingHours: 95, students: 100 },
    { month: 'Jan', teachingHours: 100, students: 120 },
    { month: 'Feb', teachingHours: 120, students: 135 },
    { month: 'Mar', teachingHours: 135, students: 140 },
    { month: 'Apr', teachingHours: 150, students: 180 },
    { month: 'May', teachingHours: 115, students: 190 },
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold mb-4">Teaching Progress</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={teachingProgressData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="teachingHours" name="Teaching Hours" fill="#8A5BB7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="students" name="Students" fill="#BA8DF1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeachingProgressChart;
