
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import useTask, { DashStatsData } from '@/hooks/useTask';
import CompactTaskCard from '@/components/CompactTaskCard';
import { ArrowRight, Clock, Calendar, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { loggedInUser } = useAuth()
  const { isLoading, getPendingUnassignedTask, getOngoingTasks, getDashboardStats } = useTask()
  const [user, setUser] = useState<User>(null)
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [ongoingTask, setOngoingTask] = useState<any>(null)
  const [dashboardStats, setDashStats] = useState<DashStatsData>(null)

  useEffect(() => {
    const userFromStorage = loggedInUser();
    setUser(userFromStorage);
  }, []);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      const response = await getPendingUnassignedTask({
        limit: 6, // Fetch only 6 for dashboard overview
        page: 1,
        sort: 1,
        title: '',
        description: ''
      });

      if (response.success && response.data) {
        setRecentTasks(response.data.items);
      }
    };

    fetchRecentTasks();
  }, []);

  useEffect(() => {
    const fetchOngoingTask = async () => {
      const response = await getOngoingTasks({
        limit: 1, // Only fetch one ongoing task
        page: 1,
        sort: 1,
        title: '',
        description: ''
      });

      if (response.success && response.data && response.data.items.length > 0) {
        setOngoingTask(response.data.items[0]);
      }
    };

    fetchOngoingTask();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      const response = await getDashboardStats()
      setDashStats(response.data)
    }
    getStats()
  }, [])

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
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'hard':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  console.log(dashboardStats)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`} alt={user?.first_name} />
              <AvatarFallback>{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.first_name}!
              </h1>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  <span className="mr-2">ResponderId:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {user?.responder_id}
                  </span>
                </span>
                <span className="flex items-center mt-1">
                  <span className={`w-2 h-2 rounded-full mr-2 ${user?.availability_status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-sm font-medium ${user?.availability_status ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.availability_status ? 'Available' : 'Busy'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats && dashboardStats?.pendingTasksCount}</div>
              <p className="text-xs text-gray-500">Ready to apply</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingTask ? 1 : 0}</div>
              <p className="text-xs text-gray-500">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats && dashboardStats?.completedThisMonthCount}</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Ongoing Task */}
        {ongoingTask && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Current Task
            </h2>
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/task/${ongoingTask._id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {ongoingTask.title}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {ongoingTask.subject}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                        {ongoingTask.difficulty && (
                          <Badge className={`${getDifficultyColor(ongoingTask.difficulty)} font-semibold`}>
                            {ongoingTask.difficulty.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 text-base leading-relaxed line-clamp-2">
                      {ongoingTask.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Due: {formatDate(ongoingTask.deadline || ongoingTask.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Started: {formatDate(ongoingTask.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col justify-between">
                    <div className="text-center lg:text-right mb-6">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {formatPayment(ongoingTask.price || 0)}
                      </div>
                      <p className="text-sm text-gray-500">Fixed price</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/task/${ongoingTask._id}`;
                      }}
                    >
                      Continue Work
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Available Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Recent Available Tasks
            </h2>
            <Link to="/pending-tasks">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : recentTasks && recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map((task, index) => (
                <CompactTaskCard
                  key={task._id || index}
                  task={task}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">No tasks available</h3>
              <p className="text-sm text-gray-500 mt-2">New tasks will appear here when available</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Browse Available Tasks</h3>
              <p className="text-sm text-gray-600 mb-4">Find and apply for new tasks</p>
              <Link to="/pending-tasks">
                <Button className="w-full">Browse Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Work History</h3>
              <p className="text-sm text-gray-600 mb-4">Review completed projects</p>
              <Link to="/completed-tasks">
                <Button variant="outline" className="w-full">View History</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
