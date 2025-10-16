import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const FamilyCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (user?.role !== "parent") {
    navigate("/student/dashboard");
    return null;
  }

  // Get month name and year
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Mock data - replace with real data from hooks
  const sessionsData: { [key: string]: any[] } = {
    "15": [
      { childName: "Sarah", className: "Math 101", time: "10:00 AM" },
      { childName: "John", className: "Science", time: "2:00 PM" },
    ],
    "16": [
      { childName: "Sarah", className: "Art Class", time: "11:00 AM" },
    ],
    "20": [
      { childName: "John", className: "Coding", time: "3:00 PM" },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Family Calendar</h1>
        <p className="text-muted-foreground mt-2">
          View all upcoming classes for your children
        </p>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {currentMonthName} {currentYear}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {blanks.map((blank) => (
              <div key={`blank-${blank}`} className="p-2 h-24" />
            ))}
            {days.map((day) => {
              const dayStr = day.toString();
              const sessions = sessionsData[dayStr] || [];
              const today = new Date();
              const isToday = 
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              return (
                <div
                  key={day}
                  className={`border rounded-lg p-2 h-24 overflow-y-auto ${
                    isToday ? "border-primary bg-primary/5" : "border-border"
                  } ${sessions.length > 0 ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                    {day}
                  </div>
                  {sessions.map((session, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs mb-1 w-full justify-start truncate"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {session.time}
                    </Badge>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions This Week</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(sessionsData).map(([day, sessions]) => (
              <div key={day}>
                {sessions.map((session, idx) => (
                  <Card key={idx} className="mb-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{session.className}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{session.childName}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{session.time}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>
                                {currentMonthName} {day}, {currentYear}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}

            {Object.keys(sessionsData).length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/student/explore")}
                >
                  Browse Classes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyCalendar;