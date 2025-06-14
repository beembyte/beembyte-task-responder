import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Clock, Calendar } from 'lucide-react';
import useTask, { TaskResponse } from '@/hooks/useTask';
import { getAllunAssignedTaskPayload } from '@/services/taskApi';
import { toast } from 'sonner';
import CancelTaskButton from '@/components/task/CancelTaskButton';

interface TaskListPageProps {
  title: string;
  taskType: 'pending' | 'ongoing' | 'completed';
  showCancelButton?: boolean;
}

const TaskListPage: React.FC<TaskListPageProps> = ({ title, taskType, showCancelButton = false }) => {
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
  }, [currentPage, taskType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTasks(1, searchTerm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPayment = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'hard':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        // Remove the accepted task from the list
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
    // Remove the declined task from the list
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handleTaskCancelled = (taskId: string) => {
    // Remove the cancelled task from the list
    setTasks(prev => prev.filter(task => task._id !== taskId));
    toast.success('Task cancelled successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-600">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''} available
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Easy</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Hard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
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
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading tasks...</div>
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden bg-card">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task._id)}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Left side: Title, description, meta */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base text-card-foreground line-clamp-2 flex-1 mr-2 hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                        <Badge className={`text-xs capitalize ${getStatusColor(task.status || taskType)}`}>
                          {task.status || taskType}
                        </Badge>
                        {task.difficulty && (
                          <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-primary font-medium mb-3">
                      {task.subject}
                    </p>

                    <p className="text-muted-foreground mb-4 text-xs leading-relaxed line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formatDate(task.deadline || task.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Posted: {formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right side: Price and Actions */}
                  <div className="w-full sm:w-48 flex flex-col justify-between sm:items-end">
                    <div className="text-left sm:text-right mb-4 sm:mb-2">
                      <div className="text-xl font-bold text-green-600">
                        {formatPayment(task.price || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">Fixed price</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task._id);
                        }}
                      >
                        View Details
                      </Button>
                      {taskType === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
                            onClick={(e) => handleDeclineTask(e, task._id)}
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                            onClick={(e) => handleAcceptTask(e, task._id)}
                            disabled={acceptingTasks.has(task._id)}
                          >
                            {acceptingTasks.has(task._id) ? 'Accepting...' : 'Accept'}
                          </Button>
                        </div>
                      )}
                      {showCancelButton && taskType === 'ongoing' && (
                        <CancelTaskButton
                          taskId={task._id}
                          onTaskCancelled={() => handleTaskCancelled(task._id)}
                          className="w-full h-8"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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
                onClick={() => {
                  setSearchTerm('');
                  fetchTasks(1, '');
                }}
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
