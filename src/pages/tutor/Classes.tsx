
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Classes = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const classesPerPage = 6;
  const { classes, totalCount, isLoading, error, refetch } = useTutorClasses({
    page: currentPage,
    pageSize: classesPerPage
  });
  
  const { toast } = useToast();
  const totalPages = Math.ceil(totalCount / classesPerPage);

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

  const handleDeleteClass = (classItem: TutorClass) => {
    setSelectedClass(classItem);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClass = async () => {
    if (!selectedClass) return;

    setIsDeleting(true);
    try {
      // Delete related records first
      await supabase
        .from('class_locations')
        .delete()
        .eq('class_id', selectedClass.id);

      await supabase
        .from('class_time_slots')
        .delete()
        .eq('class_id', selectedClass.id);

      await supabase
        .from('class_schedules')
        .delete()
        .eq('class_id', selectedClass.id);

      await supabase
        .from('class_syllabus')
        .delete()
        .eq('class_id', selectedClass.id);

      // Finally delete the class
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', selectedClass.id);

      if (error) throw error;

      toast({
        title: 'Class deleted',
        description: `"${selectedClass.title}" has been permanently deleted.`,
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the class. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedClass(null);
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{selectedClass?.title}"? 
              This action cannot be undone and will remove all associated data including schedules, locations, and syllabus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClass}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
