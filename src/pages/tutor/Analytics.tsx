import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTutorAnalytics } from '@/hooks/use-tutor-analytics';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  DollarSign, 
  Star, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Analytics = () => {
  const { data: analytics, isLoading } = useTutorAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      description: 'Total class page views',
    },
    {
      title: 'Total Enrollments',
      value: analytics.totalEnrollments.toLocaleString(),
      icon: Users,
      description: 'Students enrolled',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Views to enrollments',
    },
    {
      title: 'Total Revenue',
      value: `₹${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `₹${analytics.monthlyRevenue.toFixed(2)} this month`,
    },
    {
      title: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      icon: Star,
      description: `${analytics.totalReviews} reviews`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your performance and growth metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Last 6 months enrollment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#8A5BB7" 
                  strokeWidth={2}
                  name="Enrollments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Last 6 months revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  fill="#8A5BB7" 
                  name="Revenue (₹)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance</CardTitle>
          <CardDescription>
            Detailed analytics for each of your classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.classAnalytics.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No classes created yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Enrollments</TableHead>
                  <TableHead className="text-right">Conversion Rate</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.classAnalytics.map((classItem, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {classItem.className}
                    </TableCell>
                    <TableCell className="text-right">
                      {classItem.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {classItem.enrollments.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {classItem.conversionRate.toFixed(1)}%
                        {classItem.conversionRate > analytics.conversionRate ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{classItem.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
