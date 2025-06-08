
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SimpleCreateClassDialog from '@/components/tutor-dashboard/SimpleCreateClassDialog';
import ClassDetailsDialog from '@/components/tutor-dashboard/ClassDetailsDialog';
import ClassesGrid from '@/components/tutor-dashboard/ClassesGrid';
import ClassesPagination from '@/components/tutor-dashboard/ClassesPagination';
import { useTutorClasses } from '@/hooks/use-tutor-classes';
import { TutorClass } from '@/hooks/use-tutor-classes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Classes = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const classesPerPage = 6;
  const { classes, totalCount, isLoading, error, refetch } = useTutorClasses({
    page: currentPage,
    pageSize: classesPerPage
  });
  
  const totalPages = Math.ceil(totalCount / classesPerPage);
  const { toast } = useToast();

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleEditClass = (classItem: TutorClass) => {
    setSelectedClass(classItem);
    setEditClassDialogOpen(true);
  };

  const handleManageClass = (classItem: TutorClass) => {
    setSelectedClass(classItem);
    setManageDialogOpen(true);
  };

  const handleDeleteClass = async (classItem: TutorClass) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classItem.id);

      if (error) throw error;

      toast({
        title: "Class deleted",
        description: `"${classItem.title}" has been successfully deleted.`,
      });

      // Refetch the classes to update the list
      refetch();
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete the class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClassCreated = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading classes: {error}</p>
        <button onClick={refetch} className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">My Classes</h1>
          <p className="text-gray-600 mt-1">
            Manage all your classes here. You currently have {totalCount} classes
            {totalPages > 1 && ` across ${totalPages} pages`}.
          </p>
        </div>
        <button 
          onClick={handleCreateClass}
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create New Class
        </button>
      </div>

      {/* Create Class Dialog */}
      <SimpleCreateClassDialog
        open={createClassDialogOpen}
        onOpenChange={setCreateClassDialogOpen}
        onClassCreated={handleClassCreated}
      />

      {/* Edit Class Dialog */}
      <SimpleCreateClassDialog
        open={editClassDialogOpen}
        onOpenChange={setEditClassDialogOpen}
        onClassCreated={handleClassCreated}
        editingClass={selectedClass}
      />

      {/* Manage Class Dialog */}
      <ClassDetailsDialog
        open={manageDialogOpen}
        onOpenChange={setManageDialogOpen}
        selectedClass={selectedClass}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading classes...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <ClassesGrid
              classes={classes}
              onEditClass={handleEditClass}
              onManageClass={handleManageClass}
              onCreateClass={handleCreateClass}
              onDeleteClass={handleDeleteClass}
            />
          </div>

          {totalPages > 1 && (
            <ClassesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Classes;
