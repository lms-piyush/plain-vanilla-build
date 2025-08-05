
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ClassEntry {
  id: string;
  name: string;
  type: "Online" | "Offline";
  status: "Ongoing" | "Completed" | "Upcoming";
  format: "Inbound" | "Outbound" | "Live" | "Recorded";
  time: string;
  isStartable: boolean;
}

interface ClassesTableProps {
  classes: ClassEntry[];
  onStartSession: (classId: string) => void;
}

const ClassesTable = ({ classes, onStartSession }: ClassesTableProps) => {
  const handleStartSession = (classId: string, isStartable: boolean) => {
    if (isStartable) {
      onStartSession(classId);
    } else {
      alert("Please wait for the class to start");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Class Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell className="font-medium">{classItem.name}</TableCell>
              <TableCell>{classItem.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  classItem.status === "Ongoing" 
                    ? "bg-green-100 text-green-800" 
                    : classItem.status === "Upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {classItem.status}
                </span>
              </TableCell>
              <TableCell>{classItem.format}</TableCell>
              <TableCell>{classItem.time}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={classItem.isStartable ? "default" : "outline"}
                  disabled={!classItem.isStartable && classItem.status !== "Completed"}
                  onClick={() => handleStartSession(classItem.id, classItem.isStartable)}
                  className={classItem.isStartable ? "bg-[#8A5BB7] hover:bg-[#8A5BB7]/90" : ""}
                >
                  {classItem.status === "Completed" ? "Review" : 
                   classItem.status === "Upcoming" ? "Join Soon" : "Start Session"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassesTable;
