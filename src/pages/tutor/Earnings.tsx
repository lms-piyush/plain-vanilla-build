
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
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { useTutorEarningsClasses } from "@/hooks/use-tutor-earnings-classes";
import { format } from "date-fns";

const Earnings = () => {
  const [deliveryMode, setDeliveryMode] = useState<'online' | 'offline' | null>(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useTutorEarningsClasses({
    deliveryMode,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize
  });

  console.log("Earnings page debug:", {
    isLoading,
    error: error?.message,
    data,
    deliveryMode,
    sortBy,
    sortOrder,
    currentPage
  });

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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      running: 'secondary',
      completed: 'outline',
      draft: 'destructive',
      inactive: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency === 'INR' ? '₹' : '$'}${amount?.toLocaleString() || 0}`;
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Earnings</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading earnings data: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Earnings</h1>
        <p className="text-muted-foreground">Manage and view your class earnings and student enrollment data.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
          <CardDescription>
            Filter your classes by delivery mode and sort by different criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Mode</label>
              <Select 
                value={deliveryMode || 'all'} 
                onValueChange={(value) => {
                  setDeliveryMode(value === 'all' ? null : value as 'online' | 'offline');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="online">Online Only</SelectItem>
                  <SelectItem value="offline">Offline Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select 
                value={`${sortBy}-${sortOrder}`} 
                onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
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
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Overview</CardTitle>
          <CardDescription>
            {data ? `Showing ${data.classes.length} of ${data.totalCount} classes` : 'Loading classes...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading classes...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('title')}
                      >
                        Class Title {getSortIcon('title')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('class_format')}
                      >
                        Format {getSortIcon('class_format')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('class_size')}
                      >
                        Size {getSortIcon('class_size')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('duration_type')}
                      >
                        Duration {getSortIcon('duration_type')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('amount')}
                      >
                        Amount {getSortIcon('amount')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('created_at')}
                      >
                        Purchase Date {getSortIcon('created_at')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('status')}
                      >
                        Status {getSortIcon('status')}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.classes?.length ? (
                    data.classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">
                          {classItem.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {classItem.class_format.charAt(0).toUpperCase() + classItem.class_format.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {classItem.class_size === 'group' ? 'Group' : '1-on-1'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={classItem.duration_type === 'recurring' ? 'default' : 'outline'}>
                            {classItem.duration_type === 'recurring' ? 'Recurring' : 'Fixed'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatAmount(classItem.amount, classItem.currency)}
                          {classItem.duration_type === 'recurring' && (
                            <span className="text-xs text-muted-foreground ml-1">/month</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(classItem.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {classItem.student_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(classItem.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-muted-foreground">No classes found</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalCount > pageSize && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.totalCount)} of {data.totalCount} classes
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
                  <span className="font-semibold">{Math.ceil(data.totalCount / pageSize)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(data.totalCount / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
