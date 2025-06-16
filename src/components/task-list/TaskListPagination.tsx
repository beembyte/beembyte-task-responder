
import React from 'react';

interface TaskListPaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

const TaskListPagination: React.FC<TaskListPaginationProps> = ({ totalPages, currentPage, onChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center py-4 gap-2">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded bg-muted hover:bg-primary/10 disabled:opacity-50"
        aria-label="Previous"
      >
        Prev
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded bg-muted hover:bg-primary/10 disabled:opacity-50"
        aria-label="Next"
      >
        Next
      </button>
    </div>
  );
};

export default TaskListPagination;

