
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import Navbar from '@/components/layout/Navbar';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { pendingTasks, acceptedTasks, completedTasks, acceptTask, rejectTask, completeTask, isLoading } = useTasks();
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const currentTask = acceptedTasks.length > 0 ? acceptedTasks[0] : null;
  const responderId = user?.firstName ? `${user.firstName.toLowerCase()}${Math.floor(10000 + Math.random() * 90000)}` : 'user12345';
  const isAvailable = user?.availability === 'available';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={`https://robohash.org/${user?.firstName || 'user'}?set=set4`} alt={user?.firstName} />
              <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.firstName}!
              </h1>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  <span className="mr-2">ResponderId:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {responderId}
                  </span>
                </span>
                <span className="flex items-center mt-1">
                  <span className={`w-2 h-2 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable ? 'Available' : 'Busy'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {currentTask && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Current Task
            </h2>
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{currentTask.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{currentTask.subject}</p>
                  
                  <div className="mb-6">
                    <ProgressIndicator 
                      startDate={new Date(currentTask.createdAt)} 
                      endDate={new Date(currentTask.deadline)} 
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/task/${currentTask.id}`}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 text-sm"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/chat/${currentTask.id}`}
                      className="bg-secondary text-gray-700 px-4 py-2 rounded hover:bg-secondary/70 text-sm flex items-center"
                    >
                      <span>Chat with Client</span>
                    </Link>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 flex flex-col justify-center">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Payment Amount</h4>
                    <p className="text-2xl font-bold text-green-600">
                      NGN {currentTask.payment?.toLocaleString() || '0.00'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-1">Deadline</h4>
                    <p className="text-base text-gray-700">
                      {new Date(currentTask.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Available Tasks
          </h2>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="pending" className="flex-grow-0">Pending</TabsTrigger>
              <TabsTrigger value="in-progress" className="flex-grow-0">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="flex-grow-0">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {isLoading ? (
                <div className="text-center py-8">Loading tasks...</div>
              ) : pendingTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onAccept={acceptTask}
                      onReject={rejectTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">No pending tasks</h3>
                  <p className="text-sm text-gray-500 mt-2">New tasks will appear here when available</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress">
              {acceptedTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acceptedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">No tasks in progress</h3>
                  <p className="text-sm text-gray-500 mt-2">Accept new tasks to see them here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">No completed tasks</h3>
                  <p className="text-sm text-gray-500 mt-2">Completed tasks will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
