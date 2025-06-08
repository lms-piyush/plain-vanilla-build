
import React, { useState } from 'react';
import { Plus, Calendar, Users, Globe, MapPin, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import SimpleCreateClassDialog from '@/components/tutor-dashboard/SimpleCreateClassDialog';
import { useTutorClasses } from '@/hooks/use-tutor-classes';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TutorClass } from '@/hooks/use-tutor-classes';

const Classes = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const [editClassDialogOpen, setEditClassDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { classes, isLoading, error, refetch } = useTutorClasses();
  
  const classesPerPage = 10;
  const totalPages = Math.ceil(classes.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const endIndex = startIndex + classesPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);

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

  const handleClassCreated = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDeliveryIcon = (deliveryMode: string) => {
    return deliveryMode === 'online' ? (
      <Globe className="h-4 w-4 text-blue-600" />
    ) : (
      <MapPin className="h-4 w-4 text-green-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStudentLimit = (classSize: string, maxStudents: number | null) => {
    if (classSize === 'one-on-one') {
      return '1 student';
    }
    return maxStudents ? `Max ${maxStudents} students` : 'No limit';
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
          <p className="text-gray-600 mt-1">Manage all your classes here. You currently have {classes.length} classes.</p>
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
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">Class Details</DialogTitle>
          </DialogHeader>
          
          {selectedClass && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedClass.title}</h3>
                <p className="text-gray-600">{selectedClass.description || "No description available"}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Class Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      {getDeliveryIcon(selectedClass.delivery_mode)}
                      <span className="ml-2 capitalize">{selectedClass.delivery_mode}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{getStudentLimit(selectedClass.class_size, selectedClass.max_students)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2">{getStatusBadge(selectedClass.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Additional Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedClass.subject && (
                      <div>
                        <span className="text-gray-500">Subject:</span>
                        <span className="ml-2">{selectedClass.subject}</span>
                      </div>
                    )}
                    {selectedClass.price && (
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2">{selectedClass.currency || 'USD'} {selectedClass.price}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2">{new Date(selectedClass.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedClass.class_locations && selectedClass.class_locations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Location Details</h4>
                  {selectedClass.class_locations.map((location, index) => (
                    <div key={index} className="text-sm space-y-1">
                      {location.meeting_link && (
                        <div>
                          <span className="text-gray-500">Meeting Link:</span>
                          <span className="ml-2 text-blue-600">{location.meeting_link}</span>
                        </div>
                      )}
                      {(location.street || location.city || location.state) && (
                        <div>
                          <span className="text-gray-500">Address:</span>
                          <span className="ml-2">
                            {[location.street, location.city, location.state, location.zip_code].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">No classes found. Create your first class to get started!</p>
          <button 
            onClick={handleCreateClass}
            className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Your First Class
          </button>
        </div>
      ) : (
        <>
          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gradient-to-br from-primary to-purple-600">
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(classItem.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center text-sm">
                      {getDeliveryIcon(classItem.delivery_mode)}
                      <span className="ml-2 capitalize">{classItem.delivery_mode} • {classItem.class_size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{classItem.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description || "No description available"}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Created {new Date(classItem.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{getStudentLimit(classItem.class_size, classItem.max_students)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleManageClass(classItem)}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Manage
                    </button>
                    <button 
                      onClick={() => handleEditClass(classItem)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Classes;
