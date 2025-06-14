
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TaskListSearchProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isLoading: boolean;
  handleSearch: () => void;
}

const TaskListSearch: React.FC<TaskListSearchProps> = ({ searchTerm, setSearchTerm, isLoading, handleSearch }) => (
  <form
    className="flex gap-2 w-full max-w-lg"
    onSubmit={e => {
      e.preventDefault();
      handleSearch();
    }}
  >
    <Input
      placeholder="Search by title or description..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="flex-1"
      disabled={isLoading}
    />
    <Button type="submit" variant="outline" disabled={isLoading}>
      Search
    </Button>
  </form>
);

export default TaskListSearch;

