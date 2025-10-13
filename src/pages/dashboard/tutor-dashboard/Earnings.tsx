import { useState } from "react";
import { 
  Calendar as CalendarIcon,
  DollarSign,
  Wallet
} from "lucide-react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { useAvailableBalance } from "@/hooks/use-withdrawal";
import BankAccountManagement from "@/components/tutor/BankAccountManagement";
import WithdrawalRequestDialog from "@/components/tutor/WithdrawalRequestDialog";
import WithdrawalHistory from "@/components/tutor/WithdrawalHistory";

// Revenue data for the chart
const monthlyRevenueData = [
  { month: "Jun 24", value: 20000 },
  { month: "Jul 24", value: 15000 },
  { month: "Aug 24", value: 20000 },
  { month: "Sep 24", value: 55000 },
  { month: "Oct 24", value: 20000 },
  { month: "Nov 24", value: 18000 },
  { month: "Dec 24", value: 30000 },
  { month: "Jan 25", value: 50000 },
  { month: "Feb 25", value: 20000 },
  { month: "Mar 25", value: 15000 },
  { month: "Apr 25", value: 22000 },
  { month: "May 25", value: 25000 }
];

// Recent transactions data
const recentTransactions = [
  { 
    id: 1, 
    classTitle: "Algebra", 
    format: "Live", 
    size: "Group", 
    duration: "Infinite Classes", 
    amount: "Rs. 500/month", 
    date: "12-07-2024", 
    students: 3, 
    status: "Ongoing" 
  },
  { 
    id: 2, 
    classTitle: "Imaginary Numbers", 
    format: "Recorded", 
    size: "Group", 
    duration: "Finite Classes", 
    amount: "Rs. 2000", 
    date: "09-07-2024", 
    students: 7, 
    status: "Published" 
  },
  { 
    id: 3, 
    classTitle: "Slope of Line and Tangents : Parts 1", 
    format: "Live", 
    size: "Group", 
    duration: "Finite Classes", 
    amount: "Rs. 799", 
    date: "28-06-2024", 
    students: 34, 
    status: "Unpublished"
  },
  { 
    id: 4, 
    classTitle: "Calculus for class XI", 
    format: "Live", 
    size: "1-on-1", 
    duration: "Infinite Classes", 
    amount: "Rs. 1500/month", 
    date: "17-06-2024", 
    students: 1, 
    status: "Ongoing"
  },
  { 
    id: 5, 
    classTitle: "Integers", 
    format: "Recorded", 
    size: "1-on-1", 
    duration: "Finite Classes", 
    amount: "Rs. 299/month", 
    date: "16-06-2024", 
    students: 1, 
    status: "Upcoming"
  }
];

const Earnings = () => {
  const [selectedTab, setSelectedTab] = useState("online");
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const { data: availableBalance } = useAvailableBalance();

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-500 mt-1">Manage and track your teaching revenue</p>
          </div>
          <Button onClick={() => setWithdrawalDialogOpen(true)} size="lg" className="mt-4 md:mt-0">
            <Wallet className="h-4 w-4 mr-2" />
            Withdraw Funds
          </Button>
        </div>

        {/* Revenue Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Available Balance Card */}
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg md:col-span-5 rounded-xl text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Available Balance</p>
                  <h2 className="text-4xl font-bold">₹{availableBalance?.toFixed(2) || '0.00'}</h2>
                  <p className="text-sm opacity-75 mt-2">Ready to withdraw</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <Button 
                onClick={() => setWithdrawalDialogOpen(true)}
                variant="secondary"
                className="w-full mt-4 bg-white text-emerald-600 hover:bg-gray-50"
              >
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Sales Overview Chart */}
          <Card className="bg-white shadow-sm md:col-span-7 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Monthly Sales Overview</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                      domain={[0, 100000]}
                      ticks={[0, 25000, 50000, 75000, 100000]}
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
                    <h2 className="text-2xl font-bold">₹ 25,000</h2>
                    <p className="text-xs text-gray-500 mt-1">3 Offline, 20 Online</p>
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
                    <h2 className="text-2xl font-bold">₹ 17,500</h2>
                    <p className="text-xs text-gray-500 mt-1">4 Offline, 10 Online</p>
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
              <Tabs defaultValue="online" className="w-full">
                <div className="px-6 pt-6 pb-2">
                  <div className="flex items-center space-x-3">
                    <TabsList className="rounded-full h-10 grid w-auto auto-cols-max">
                      <TabsTrigger 
                        value="online" 
                        onClick={() => setSelectedTab("online")}
                        className="px-6 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"
                      >
                        Online Classes
                      </TabsTrigger>
                      <TabsTrigger 
                        value="offline" 
                        onClick={() => setSelectedTab("offline")}
                        className="px-6 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"
                      >
                        Offline Classes
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <TabsContent value="online" className="m-0">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Online Classes</h3>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[120px] h-9 bg-white border border-gray-200 rounded-lg">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Sort by</SelectItem>
                          <SelectItem value="amount-high">Amount High-Low</SelectItem>
                          <SelectItem value="amount-low">Amount Low-High</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-medium text-gray-700">Class Title</TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Format
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Size
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Duration
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Amount
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Purchase Date
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 text-center">Students</TableHead>
                            <TableHead className="font-medium text-gray-700">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.classTitle}</TableCell>
                              <TableCell>{transaction.format}</TableCell>
                              <TableCell>{transaction.size}</TableCell>
                              <TableCell>{transaction.duration}</TableCell>
                              <TableCell>{transaction.amount}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell className="text-center">{transaction.students}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={`
                                    ${transaction.status === 'Published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                    ${transaction.status === 'Unpublished' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                                    ${transaction.status === 'Ongoing' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : ''}
                                    ${transaction.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                                  `}
                                  variant="outline"
                                >
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="offline" className="m-0">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Offline Classes</h3>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[120px] h-9 bg-white border border-gray-200 rounded-lg">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Sort by</SelectItem>
                          <SelectItem value="amount-high">Amount High-Low</SelectItem>
                          <SelectItem value="amount-low">Amount Low-High</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-medium text-gray-700">Class Title</TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Format
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Size
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Class Duration
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Amount
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700">
                              Purchase Date
                              <span className="inline-block ml-1">↑↓</span>
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 text-center">Students</TableHead>
                            <TableHead className="font-medium text-gray-700">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.filter(t => t.format === "Inbound" || t.format === "Outbound").length > 0 ? (
                            recentTransactions.filter(t => t.format === "Inbound" || t.format === "Outbound").map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.classTitle}</TableCell>
                                <TableCell>{transaction.format}</TableCell>
                                <TableCell>{transaction.size}</TableCell>
                                <TableCell>{transaction.duration}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell className="text-center">{transaction.students}</TableCell>
                                <TableCell>
                                  <Badge 
                                    className={`
                                      ${transaction.status === 'Published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                      ${transaction.status === 'Unpublished' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                                      ${transaction.status === 'Ongoing' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : ''}
                                      ${transaction.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                                    `}
                                    variant="outline"
                                  >
                                    {transaction.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                No offline classes found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Management Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <BankAccountManagement />
          <WithdrawalHistory />
        </div>

        <WithdrawalRequestDialog 
          open={withdrawalDialogOpen} 
          onClose={() => setWithdrawalDialogOpen(false)} 
        />
      </div>
    </>
  );
};

export default Earnings;