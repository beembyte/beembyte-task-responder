
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types';
import { useTasks } from '@/context/TaskContext';
import useTask from '@/hooks/useTask';
import Navbar from '@/components/layout/Navbar';
import { RefreshCw } from 'lucide-react';

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
          sort: -1, // Latest first
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
  }, []);
  
  const filteredTasks = completedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Group tasks by month and year
  const groupedTasks: Record<string, any[]> = {};
  filteredTasks.forEach(task => {
    const date = new Date(task.createdAt);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!groupedTasks[monthYear]) {
      groupedTasks[monthYear] = [];
    }
    
    groupedTasks[monthYear].push(task);
  });

  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Format date
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} · ${formatTime(d)}`;
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const formatPayment = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };
  
  // Get task icon
  const getTaskIcon = () => {
    return (
      <div className="rounded-md bg-green-100 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M9 11l3 3l8-8"></path>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
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
        
        {loading ? (
          <div className="text-center py-8">Loading completed tasks...</div>
        ) : (
          <div className="space-y-8">
            {sortedMonths.length > 0 ? (
              sortedMonths.map((monthYear) => (
                <div key={monthYear} className="space-y-4">
                  <h2 className="text-xl font-bold">{monthYear}</h2>
                  
                  <div className="space-y-5">
                    {groupedTasks[monthYear].map((task) => (
                      <div key={task._id} className="flex items-start space-x-4">
                        {getTaskIcon()}
                        
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">
                            {formatDate(task.createdAt)} · Completed
                          </div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-700 mt-1">{task.subject}</div>
                          <div className="font-medium text-sm text-gray-900 mt-1">
                            {formatPayment(task.price || 0)}
                          </div>
                        </div>
                        
                        <Link to={`/task/${task._id}`} className="flex-shrink-0">
                          <button className="p-2 rounded-full hover:bg-gray-100">
                            <RefreshCw size={18} className="text-gray-500" />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                {searchQuery ? 'No completed tasks found matching your search' : 'No completed tasks found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
