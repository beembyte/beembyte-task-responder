import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import useTask from '@/hooks/useTask';
import HistoryStyleTaskList from "@/components/task-list/HistoryStyleTaskList";
import { Input } from '@/components/ui/input';

const TaskHistory: React.FC = () => {
  const { getCompletedTasks } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      setLoading(true);
      try {
        const response = await getCompletedTasks({
          limit: 50,
          page: 1,
          sort: -1,
          title: '',
          description: ''
        });

        if (response.success && response.data) {
          setCompletedTasks(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [getCompletedTasks]);
  
  const filteredTasks = completedTasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.title?.toLowerCase().includes(query) ||
      task.subject?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-gray-600 mt-1">View your task completion history</p>
        </div>
        <div className="mb-6">
          <Input
            placeholder="Search completed tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <HistoryStyleTaskList
          tasks={filteredTasks}
          loading={loading}
          type="completed"
        />
      </div>
    </div>
  );
};

export default TaskHistory;
