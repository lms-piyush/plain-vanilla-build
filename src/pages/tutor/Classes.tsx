
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateClassDialog from '@/components/tutor-dashboard/class-creation/CreateClassDialog';
import ClassDetailsDialog from '@/components/tutor-dashboard/ClassDetailsDialog';
import ClassesGrid from '@/components/tutor-dashboard/ClassesGrid';
import ClassesPagination from '@/components/tutor-dashboard/ClassesPagination';
import { useTutorClasses } from '@/hooks/use-tutor-classes';
import { TutorClass } from '@/hooks/use-tutor-classes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [editingClass, setEditingClass] = useState<TutorClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMode, setEditMode] = useState<'full' | 'upload'>('full');
  
  const classesPerPage = 6;
  const { classes, totalCount, isLoading, error, refetch } = useTutorClasses({
    page: currentPage,
    pageSize: classesPerPage
  });
  
  const totalPages = Math.ceil(totalCount / classesPerPage);

  const handleCreateClass = () => {
    setEditingClass(null);
    setEditMode('full');
    setCreateClassDialogOpen(true);
  };

  const handleEditClass = (classItem: TutorClass) => {
    // Only allow editing if class is in draft status
    if (classItem.status !== 'draft') {
      toast.error('Only draft classes can be edited');
      return;
    }
    
    setEditingClass(classItem);
    setEditMode('full');
    setCreateClassDialogOpen(true);
  };

  const handleUploadClass = (classItem: TutorClass) => {
    // Only allow upload mode for completed classes
    if (classItem.status !== 'completed') {
      toast.error('Upload option is only available for completed classes');
      return;
    }
    
    setEditingClass(classItem);
    setEditMode('upload');
    setCreateClassDialogOpen(true);
  };

  const handleManageClass = (classItem: TutorClass) => {
    navigate(`/tutor/classes/${classItem.id}`);
  };
  
  const handleDeleteClass = async (classItem: TutorClass) => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classItem.id);

      if (error) {
        console.error('Error deleting class:', error);
        toast.error(`Failed to delete class: ${error.message}`);
        return;
      }

      toast.success(`Class "${classItem.title}" has been deleted successfully`);
      refetch();
    } catch (err: any) {
      console.error('Unexpected error deleting class:', err);
      toast.error('An unexpected error occurred while deleting the class');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClassCreated = () => {
    refetch();
    setEditingClass(null);
    setEditMode('full');
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

      {/* Enhanced Create Class Dialog */}
      <CreateClassDialog
        open={createClassDialogOpen}
        onOpenChange={setCreateClassDialogOpen}
        onClassCreated={handleClassCreated}
        editingClass={editingClass}
        editMode={editMode}
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
              onUploadClass={handleUploadClass}
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
