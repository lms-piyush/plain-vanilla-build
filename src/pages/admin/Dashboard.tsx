import { Users, GraduationCap, BookOpen, TrendingUp, DollarSign, UserCheck } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { useAdminStatistics, usePlatformGrowth } from "@/hooks/use-admin-statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStatistics();
  const { data: growth, isLoading: growthLoading } = usePlatformGrowth();

  const chartData = growth?.map(item => ({
    month: format(new Date(item.month), 'MMM yyyy'),
    students: item.new_students,
    tutors: item.new_tutors,
    classes: item.new_classes,
    enrollments: item.new_enrollments
  })).reverse() || [];

  if (statsLoading || growthLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Students"
            value={stats?.total_students || 0}
            icon={Users}
            description="Registered students"
          />
          <StatCard
            title="Total Tutors"
            value={stats?.total_tutors || 0}
            icon={GraduationCap}
            description="Active tutors"
          />
          <StatCard
            title="Total Classes"
            value={stats?.total_classes || 0}
            icon={BookOpen}
            description={`${stats?.active_classes || 0} active`}
          />
          <StatCard
            title="Total Enrollments"
            value={stats?.total_enrollments || 0}
            icon={UserCheck}
            description={`${stats?.active_enrollments || 0} active`}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${Number(stats?.total_revenue || 0).toLocaleString()}`}
            icon={DollarSign}
            description="All-time earnings"
          />
          <StatCard
            title="Platform Growth"
            value={chartData.length > 0 ? `${chartData.length} months` : "0"}
            icon={TrendingUp}
            description="Historical data"
          />
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="students"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  name="New Students"
                />
                <Area
                  type="monotone"
                  dataKey="tutors"
                  stackId="1"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  name="New Tutors"
                />
                <Area
                  type="monotone"
                  dataKey="classes"
                  stackId="1"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  name="New Classes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Enrollments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
