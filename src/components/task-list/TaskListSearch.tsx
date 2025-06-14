
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TaskListSearchProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isLoading: boolean;
  handleSearch: () => void;
}

const TaskListSearch: React.FC<TaskListSearchProps> = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  handleSearch
}) => (
  <div className="flex gap-3 max-w-2xl">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder="Search tasks by title or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="pl-12 h-12 text-base"
      />
    </div>
    <Button onClick={handleSearch} disabled={isLoading} size="lg" className="px-8">
      Search
    </Button>
  </div>
);

export default TaskListSearch;
