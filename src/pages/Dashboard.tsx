
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import Navbar from '@/components/layout/Navbar';
import ProgressIndicator from '@/components/ui/progress-indicator';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { pendingTasks, acceptedTasks, completedTasks, acceptTask, rejectTask, completeTask, isLoading } = useTasks();
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const currentTask = acceptedTasks.length > 0 ? acceptedTasks[0] : null;
  
  const getAvailabilityBadge = () => {
    const isAvailable = user?.availability === 'available';
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isAvailable ? 'Available' : 'Busy'}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your dashboard
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{acceptedTasks.length}</div>
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{completedTasks.length}</div>
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{pendingTasks.length}</div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAvailabilityBadge()}
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {currentTask && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Current Task</h2>
            <div className="bg-white border rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-medium">{currentTask.title}</h3>
                <p className="text-sm text-gray-500">{currentTask.subject}</p>
              </div>
              
              <ProgressIndicator 
                startDate={new Date(currentTask.createdAt)} 
                endDate={new Date(currentTask.deadline)} 
              />
              
              <div className="mt-4 flex justify-end">
                <Link 
                  to={`/task/${currentTask.id}`}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Tasks</h2>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
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
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No pending tasks available</p>
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
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tasks in progress</p>
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
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No completed tasks</p>
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
