
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { useTutorEarningsClasses } from "@/hooks/use-tutor-earnings-classes";
import { useTutorEarningsStats } from "@/hooks/use-tutor-earnings-stats";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Earnings = () => {
  const [deliveryMode, setDeliveryMode] = useState<'online' | 'offline' | null>(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("online");
  const pageSize = 10;

  // Separate queries for online and offline classes
  const { data: onlineData, isLoading: onlineLoading, error: onlineError } = useTutorEarningsClasses({
    deliveryMode: 'online',
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize
  });

  const { data: offlineData, isLoading: offlineLoading, error: offlineError } = useTutorEarningsClasses({
    deliveryMode: 'offline',
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize
  });

  const { data: allData, isLoading: allLoading, error: allError } = useTutorEarningsClasses({
    deliveryMode: null,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize
  });

  // Get real earnings statistics
  const { data: earningsStats, isLoading: statsLoading, error: statsError } = useTutorEarningsStats();

  // Use real data or fallback to dummy data
  const {
    totalEarnings = 0,
    thisMonth = 0,
    previousMonth = 0,
    thisMonthClasses = { online: 0, offline: 0 },
    previousMonthClasses = { online: 0, offline: 0 },
    monthlyData = []
  } = earningsStats || {};

  // Fallback monthly data if no real data
  const displayMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: "Jun 24", value: 20000, count: 3 },
    { month: "Jul 24", value: 15000, count: 2 },
    { month: "Aug 24", value: 20000, count: 4 },
    { month: "Sep 24", value: 55000, count: 8 },
    { month: "Oct 24", value: 20000, count: 3 },
    { month: "Nov 24", value: 18000, count: 2 },
    { month: "Dec 24", value: 30000, count: 5 },
    { month: "Jan 25", value: 50000, count: 7 },
    { month: "Feb 25", value: 20000, count: 3 },
    { month: "Mar 25", value: 15000, count: 2 },
    { month: "Apr 25", value: 22000, count: 4 },
    { month: "May 25", value: 25000, count: 4 }
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      'active': 'Published',
      'draft': 'Unpublished', 
      'running': 'Ongoing',
      'completed': 'Completed',
      'inactive': 'Cancelled'
    };
    
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusVariant = (status: string) => {
    const variantMap = {
      'active': 'bg-green-100 text-green-800 hover:bg-green-100',
      'draft': 'bg-red-100 text-red-800 hover:bg-red-100',
      'running': 'bg-purple-100 text-purple-800 hover:bg-purple-100', 
      'completed': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'inactive': 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    };
    
    return variantMap[status as keyof typeof variantMap] || 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency === 'INR' ? '₹' : '$'}${amount?.toLocaleString() || 0}`;
  };

  if (allError || onlineError || offlineError || statsError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Earnings</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading earnings data: {(allError || onlineError || offlineError || statsError)?.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentData = selectedTab === "online" ? onlineData : offlineData;
  const isCurrentLoading = selectedTab === "online" ? onlineLoading : offlineLoading;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">Manage and track your teaching revenue</p>
        </div>
      </div>

      {/* Revenue Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Total Earnings Card */}
        <Card className="bg-white shadow-sm md:col-span-5 rounded-xl">
          <CardContent className="p-6">
            <div>
              <h2 className="text-5xl font-bold text-gray-900">
                ₹{totalEarnings >= 100000 ? (totalEarnings / 100000).toFixed(2) + ' Lac' : totalEarnings.toLocaleString()}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Earned Till Now</p>
            </div>

            <div className="mt-6 mb-3 h-16 relative">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayMonthlyData.slice(-6).map((item, index) => ({
                    x: index + 1, 
                    y: item.value / 1000
                  }))}>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="y"
                      stroke="#000"
                      strokeWidth={2}
                      fill="url(#gradient)"
                    />
                    <circle cx="83%" cy="32%" r="4" fill="#4ADE80" stroke="#fff" strokeWidth="2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-0 right-0 bg-white rounded-lg border border-green-100 px-2 py-1">
                <span className="text-green-500 text-sm font-medium">
                  {previousMonth > 0 ? `+${Math.round(((thisMonth - previousMonth) / previousMonth) * 100)}%` : '+0%'}
                </span>
              </div>
            </div>

            <div className="flex items-center text-green-500 text-sm font-medium">
              <span className="mr-1">
                {previousMonth > 0 ? `+${Math.round(((thisMonth - previousMonth) / previousMonth) * 100)}%` : '+0%'} Sales
              </span>
              <span className="text-gray-500 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Sales Overview Chart */}
        <Card className="bg-white shadow-sm md:col-span-7 rounded-xl">
          <CardContent className="p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Monthly Sales Overview</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayMonthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `₹ ${value / 1000}k`}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip
                    formatter={(value) => [`₹ ${value}`, "Revenue"]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "0.375rem",
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* This Month Card */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <div className="mt-1">
                  <h2 className="text-2xl font-bold">₹ {thisMonth.toLocaleString()}</h2>
                  <p className="text-xs text-gray-500 mt-1">{thisMonthClasses.offline} Offline, {thisMonthClasses.online} Online</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <CalendarIcon className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Month Card */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Previous Month</h3>
                <div className="mt-1">
                  <h2 className="text-2xl font-bold">₹ {previousMonth.toLocaleString()}</h2>
                  <p className="text-xs text-gray-500 mt-1">{previousMonthClasses.offline} Offline, {previousMonthClasses.online} Online</p>
                </div>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Revenue Section */}
      <div className="mb-8">
        <Card className="bg-white shadow-sm rounded-xl">
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                  <TabsList className="rounded-full h-10 grid w-auto auto-cols-max">
                    <TabsTrigger 
                      value="online" 
                      className="px-6 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"
                    >
                      Online Classes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="offline" 
                      className="px-6 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"
                    >
                      Offline Classes
                    </TabsTrigger>
                  </TabsList>
                  
                  <Select 
                    value={`${sortBy}-${sortOrder}`} 
                    onValueChange={(value) => {
                      const [field, order] = value.split('-');
                      setSortBy(field);
                      setSortOrder(order as 'asc' | 'desc');
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9 bg-white border border-gray-200 rounded-lg">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount-desc">Amount: High → Low</SelectItem>
                      <SelectItem value="amount-asc">Amount: Low → High</SelectItem>
                      <SelectItem value="created_at-desc">Most Recent</SelectItem>
                      <SelectItem value="created_at-asc">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title: A → Z</SelectItem>
                      <SelectItem value="title-desc">Title: Z → A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="online" className="m-0">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Online Classes ({onlineData?.totalCount || 0})
                    </h3>
                  </div>

                  {onlineLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-500">Loading online classes...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-medium text-gray-700">Class Title</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Format</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Size</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Duration</TableHead>
                            <TableHead className="font-medium text-gray-700">Amount</TableHead>
                            <TableHead className="font-medium text-gray-700">Purchase Date</TableHead>
                            <TableHead className="font-medium text-gray-700 text-center">Students</TableHead>
                            <TableHead className="font-medium text-gray-700">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {onlineData?.classes?.length ? (
                            onlineData.classes.map((classItem) => (
                              <TableRow key={classItem.id}>
                                <TableCell className="font-medium">{classItem.title}</TableCell>
                                <TableCell>{classItem.class_format.charAt(0).toUpperCase() + classItem.class_format.slice(1)}</TableCell>
                                <TableCell>{classItem.class_size === 'group' ? 'Group' : '1-on-1'}</TableCell>
                                <TableCell>{classItem.duration_type === 'recurring' ? 'Infinite Classes' : 'Finite Classes'}</TableCell>
                                <TableCell>{formatAmount(classItem.amount, classItem.currency)}{classItem.duration_type === 'recurring' && '/month'}</TableCell>
                                <TableCell>{format(new Date(classItem.created_at), 'dd-MM-yyyy')}</TableCell>
                                <TableCell className="text-center">{classItem.student_count}</TableCell>
                                <TableCell>
                                  <Badge 
                                    className={getStatusVariant(classItem.status)}
                                    variant="outline"
                                  >
                                    {getStatusDisplay(classItem.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                <div className="text-gray-500">No online classes found</div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="offline" className="m-0">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Offline Classes ({offlineData?.totalCount || 0})
                    </h3>
                  </div>

                  {offlineLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-500">Loading offline classes...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-medium text-gray-700">Class Title</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Format</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Size</TableHead>
                            <TableHead className="font-medium text-gray-700">Class Duration</TableHead>
                            <TableHead className="font-medium text-gray-700">Amount</TableHead>
                            <TableHead className="font-medium text-gray-700">Purchase Date</TableHead>
                            <TableHead className="font-medium text-gray-700 text-center">Students</TableHead>
                            <TableHead className="font-medium text-gray-700">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {offlineData?.classes?.length ? (
                            offlineData.classes.map((classItem) => (
                              <TableRow key={classItem.id}>
                                <TableCell className="font-medium">{classItem.title}</TableCell>
                                <TableCell>{classItem.class_format.charAt(0).toUpperCase() + classItem.class_format.slice(1)}</TableCell>
                                <TableCell>{classItem.class_size === 'group' ? 'Group' : '1-on-1'}</TableCell>
                                <TableCell>{classItem.duration_type === 'recurring' ? 'Infinite Classes' : 'Finite Classes'}</TableCell>
                                <TableCell>{formatAmount(classItem.amount, classItem.currency)}{classItem.duration_type === 'recurring' && '/month'}</TableCell>
                                <TableCell>{format(new Date(classItem.created_at), 'dd-MM-yyyy')}</TableCell>
                                <TableCell className="text-center">{classItem.student_count}</TableCell>
                                <TableCell>
                                  <Badge 
                                    className={getStatusVariant(classItem.status)}
                                    variant="outline"
                                  >
                                    {getStatusDisplay(classItem.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                <div className="text-gray-500">No offline classes found</div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {currentData && currentData.totalCount > pageSize && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, currentData.totalCount)} of {currentData.totalCount} classes
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">Page</span>
                    <span className="font-semibold">{currentPage}</span>
                    <span className="text-sm">of</span>
                    <span className="font-semibold">{Math.ceil(currentData.totalCount / pageSize)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(currentData.totalCount / pageSize)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Earnings;
