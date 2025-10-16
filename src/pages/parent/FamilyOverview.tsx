import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildren } from "@/hooks/use-children";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { AddChildDialog } from "@/components/parent/AddChildDialog";

const FamilyOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { children, isLoading } = useChildren();
  const [showAddChild, setShowAddChild] = useState(false);

  if (user?.role !== "parent") {
    navigate("/student/dashboard");
    return null;
  }

  // Mock data for overview stats (replace with real hooks later)
  const stats = {
    totalChildren: children.length,
    activeClasses: 0, // TODO: Calculate from enrollments
    upcomingSessions: 0, // TODO: Calculate from schedules
    monthlySpending: 0, // TODO: Calculate from payments
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Family Overview</h1>
          <p className="text-muted-foreground mt-2">
            Manage your children's learning journey
          </p>
        </div>
        <Button onClick={() => setShowAddChild(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Total children added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">Across all children</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlySpending}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Children List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Children</CardTitle>
          <CardDescription>
            View and manage each child's learning profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading children...</p>
          ) : children.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No children added yet</p>
              <Button onClick={() => setShowAddChild(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Child
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{child.name}</h3>
                          <div className="flex gap-2 mt-1">
                            {child.age && (
                              <Badge variant="secondary" className="text-xs">
                                Age: {child.age}
                              </Badge>
                            )}
                            {child.grade_level && (
                              <Badge variant="secondary" className="text-xs">
                                {child.grade_level}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/student/my-children`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/student/explore?childId=${child.id}`)}
                        >
                          Browse Classes
                        </Button>
                      </div>
                    </div>
                    {child.interests && child.interests.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground mr-2">Interests:</span>
                        {child.interests.slice(0, 5).map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => navigate("/student/explore")}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Browse Classes</div>
              <div className="text-xs text-muted-foreground">Find classes for your children</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => navigate("/student/my-classes")}
          >
            <Calendar className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">View Schedule</div>
              <div className="text-xs text-muted-foreground">See all upcoming sessions</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => navigate("/student/subscription")}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Billing</div>
              <div className="text-xs text-muted-foreground">Manage payments</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <AddChildDialog
        open={showAddChild}
        onOpenChange={setShowAddChild}
      />
    </div>
  );
};

export default FamilyOverview;