
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Clock, DollarSign, MapPin } from 'lucide-react';
import useTask, { TaskResponse } from '@/hooks/useTask';
import { getAllunAssignedTaskPayload } from '@/services/taskApi';

interface TaskListPageProps {
  title: string;
  taskType: 'pending' | 'ongoing' | 'completed';
}

const TaskListPage: React.FC<TaskListPageProps> = ({ title, taskType }) => {
  const { isLoading, getPendingUnassignedTask, getOngoingTasks, getCompletedTasks } = useTask();
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const itemsPerPage = 10;

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
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setTotalTasks(response.data.totalTasks);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          {totalTasks} task{totalTasks !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            Search
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-lg">Loading tasks...</div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <Card key={task.id || index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
                        {task.title}
                      </h3>
                      <Badge className={`${getStatusColor(task.status || taskType)} text-white`}>
                        {task.status || taskType}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {formatDate(task.deadline || task.createdAt)}</span>
                      </div>
                      {task.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{task.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:w-48 flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <div className="flex items-center justify-end space-x-1 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {formatPayment(task.payment || 0)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Fixed price</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      {taskType === 'pending' && (
                        <Button size="sm" className="flex-1">
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {totalPages > 1 && (
            <div className="mt-8">
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
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No {taskType} tasks found</h3>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm ? 'Try adjusting your search terms' : `No ${taskType} tasks available at the moment`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
