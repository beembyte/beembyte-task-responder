
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTask, { TaskResponse } from '@/hooks/useTask';
import { getAllunAssignedTaskPayload } from '@/services/taskApi';
import { toast } from 'sonner';
import TaskListHeader from './task-list/TaskListHeader';
import TaskListSearch from './task-list/TaskListSearch';
import TaskCard from './task-list/TaskCard';
import TaskListPagination from './task-list/TaskListPagination';
import CancelTaskButton from '@/components/task/CancelTaskButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TaskListPageProps {
  title: string;
  taskType: 'pending' | 'ongoing' | 'completed';
  showCancelButton?: boolean;
}

const TaskListPage: React.FC<TaskListPageProps> = ({
  title,
  taskType,
  showCancelButton = false
}) => {
  const navigate = useNavigate();
  const { isLoading, getPendingUnassignedTask, getOngoingTasks, getCompletedTasks, acceptTask } = useTask();
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [acceptingTasks, setAcceptingTasks] = useState<Set<string>>(new Set());
  const itemsPerPage = 12;

  const fetchTasks = async (page: number = 1, search: string = '') => {
    const payload: getAllunAssignedTaskPayload = {
      limit: itemsPerPage,
      page: page,
      sort: 1,
      title: search,
      description: search
    };

    let response: TaskResponse;

    switch (taskType) {
      case 'pending':
        response = await getPendingUnassignedTask(payload);
        break;
      case 'ongoing':
        response = await getOngoingTasks(payload);
        break;
      case 'completed':
        response = await getCompletedTasks(payload);
        break;
      default:
        return;
    }

    if (response.success && response.data) {
      setTasks(response.data.items);
      setTotalPages(response.data.meta.page);
      setTotalTasks(response.data.meta.total);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, searchTerm);
    // eslint-disable-next-line
  }, [currentPage, taskType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTasks(1, searchTerm);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const handleAcceptTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setAcceptingTasks(prev => new Set(prev).add(taskId));
    try {
      const response = await acceptTask(taskId);
      if (response.success) {
        toast.success('Task accepted successfully!');
        setTasks(prev => prev.filter(task => task._id !== taskId));
      } else {
        toast.error(response.message || 'Failed to accept task');
      }
    } catch (error) {
      console.error('Accept task error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setAcceptingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleDeclineTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    toast.success('Task declined');
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handleTaskCancelled = (taskId: string) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
    toast.success('Task cancelled successfully!');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchTasks(1, '');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <TaskListHeader title={title} totalTasks={totalTasks} taskType={taskType} />
      <div className="mb-8">
        <TaskListSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          handleSearch={handleSearch}
        />
      </div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading tasks...</div>
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-7">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              taskType={taskType}
              acceptingTasks={acceptingTasks}
              onTaskClick={handleTaskClick}
              onAcceptTask={handleAcceptTask}
              onDeclineTask={handleDeclineTask}
              showCancelButton={showCancelButton}
              onTaskCancelled={() => handleTaskCancelled(task._id)}
            />
          ))}
          {totalPages > 1 &&
            <TaskListPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={setCurrentPage}
            />
          }
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl dark:bg-gray-900/50">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-card-foreground mb-3">No {taskType} tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms or browse all available tasks.' : `No ${taskType} tasks available at the moment. Check back later for new opportunities.`}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
