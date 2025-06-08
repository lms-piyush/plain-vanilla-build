
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClassesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ClassesPagination = ({ currentPage, totalPages, onPageChange }: ClassesPaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end pages
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
      
      // Always show first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Show pages around current page
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span> total pages
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={index} className="px-3 py-2 text-gray-500 text-sm">
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Total Pages Summary */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Total of {totalPages} pages available • Navigate using the controls above
        </div>
      </div>
    </div>
  );
};

export default ClassesPagination;
