
import React, { useState } from 'react';
import SimpleCreateClassDialog from '@/components/tutor-dashboard/SimpleCreateClassDialog';
import WelcomeSection from '@/components/tutor-dashboard/WelcomeSection';
import StatsGrid from '@/components/tutor-dashboard/StatsGrid';
import TeachingProgressChart from '@/components/tutor-dashboard/TeachingProgressChart';
import SessionsSection from '@/components/tutor-dashboard/SessionsSection';
import { useTutorClasses } from '@/hooks/use-tutor-classes';

const Dashboard = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<'today' | 'all'>('today');
  const [currentPage, setCurrentPage] = useState(1);
  
  const classesPerPage = 6;
  const { classes, totalCount, refetch } = useTutorClasses({
    page: currentPage,
    pageSize: classesPerPage
  });
  
  const totalPages = Math.ceil(totalCount / classesPerPage);

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleClassCreated = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: 'today' | 'all') => {
    setSessionFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  // Get today's date for filtering
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Filter classes based on the session filter and check schedule dates
  const getFilteredClasses = () => {
    if (sessionFilter === 'today') {
      return classes.filter(classItem => {
        // Check if any schedule includes today's date
        if (classItem.class_schedules && classItem.class_schedules.length > 0) {
          return classItem.class_schedules.some(schedule => {
            const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
            
            if (startDate) {
              // Check if today matches the start date
              return startDate.toISOString().split('T')[0] === todayDateString;
            }
            return false;
          });
        }
        return false;
      });
    }
    return classes;
  };

  const allFilteredClasses = getFilteredClasses();

  // Calculate pagination for filtered classes
  const startIndex = (currentPage - 1) * classesPerPage;
  const endIndex = startIndex + classesPerPage;
  const paginatedFilteredClasses = allFilteredClasses.slice(startIndex, endIndex);

  // Count today's sessions based on schedule dates
  const getTodaysSessionsCount = () => {
    return classes.filter(classItem => {
      if (classItem.class_schedules && classItem.class_schedules.length > 0) {
        return classItem.class_schedules.some(schedule => {
          const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
          
          if (startDate) {
            return startDate.toISOString().split('T')[0] === todayDateString;
          }
          return false;
        });
      }
      return false;
    }).length;
  };

  // Calculate pagination info for filtered classes
  const getFilteredPaginationInfo = () => {
    const totalFilteredCount = allFilteredClasses.length;
    const totalFilteredPages = Math.ceil(totalFilteredCount / classesPerPage);
    
    return {
      totalFilteredCount,
      totalFilteredPages,
      shouldShowPagination: totalFilteredPages > 1
    };
  };

  const paginationInfo = getFilteredPaginationInfo();

  return (
    <div>
      <WelcomeSection onCreateClass={handleCreateClass} />
      
      {/* Create Class Dialog */}
      <SimpleCreateClassDialog
        open={createClassDialogOpen}
        onOpenChange={setCreateClassDialogOpen}
        onClassCreated={handleClassCreated}
      />
      
      <StatsGrid 
        totalClasses={totalCount}
        activeClasses={classes.filter(c => c.status === 'active').length}
        todaysSessionsCount={getTodaysSessionsCount()}
      />
      
      <TeachingProgressChart />
      
      <SessionsSection
        sessionFilter={sessionFilter}
        onFilterChange={handleFilterChange}
        filteredClasses={paginatedFilteredClasses}
        todaysSessionsCount={getTodaysSessionsCount()}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        paginationInfo={paginationInfo}
        onCreateClass={handleCreateClass}
      />
    </div>
  );
};

export default Dashboard;
