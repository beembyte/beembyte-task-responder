
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types';
import { useTasks } from '@/context/TaskContext';
import Navbar from '@/components/layout/Navbar';
import { RefreshCw } from 'lucide-react';

const TaskHistory: React.FC = () => {
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'past'>('past');
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    const matchesTab = activeTab === 'pending' 
      ? (task.status === 'pending' || task.status === 'accepted')
      : (task.status === 'completed' || task.status === 'rejected');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Group tasks by month and year
  const groupedTasks: Record<string, Task[]> = {};
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
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}${task.status === 'completed' ? ` · ${formatTime(d)}` : ''}`;
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false 
    });
  };
  
  // Get task icon
  const getTaskIcon = (status: string) => {
    if (status === 'completed') {
      return (
        <div className="rounded-md bg-gray-100 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M16 21h-8a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2z"></path>
            <path d="M12 7v1"></path>
          </svg>
        </div>
      );
    }
    return (
      <div className="rounded-md bg-gray-100 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9L14 3h-4z"></path>
          <path d="M14 3v6h6"></path>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-2 border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-3 text-center font-medium ${
                activeTab === 'pending'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-3 text-center font-medium ${
                activeTab === 'past'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
            >
              Past
            </button>
          </div>
        </div>
        
        <div className="mb-6 flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full max-w-[150px]">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-8">
          {sortedMonths.length > 0 ? (
            sortedMonths.map((monthYear) => (
              <div key={monthYear} className="space-y-4">
                <h2 className="text-xl font-bold">{monthYear}</h2>
                
                <div className="space-y-5">
                  {groupedTasks[monthYear].map((task) => (
                    <div key={task.id} className="flex items-start space-x-4">
                      {getTaskIcon(task.status)}
                      
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{formatDate(task.createdAt)} · {task.status === 'rejected' ? 'Cancelled' : task.status}</div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-700 mt-1">{task.subject}</div>
                        {task.payment && (
                          <div className="font-medium text-sm text-gray-900 mt-1">
                            {task.status === 'rejected' ? 'N0' : `N${task.payment.toLocaleString()}`}
                          </div>
                        )}
                      </div>
                      
                      <Link to={`/task/${task.id}`} className="flex-shrink-0">
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
              No tasks found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
