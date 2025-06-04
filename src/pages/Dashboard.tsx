
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
import { ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { loggedInUser } = useAuth()
  const { isLoading, getPendingUnassignedTask, getDashboardStats } = useTask()
  const [user, setUser] = useState<User>(null)
  const [recentTasks, setRecentTasks] = useState<any[]>([])
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
    const getStats = async () => {
      const response = await getDashboardStats()
      setDashStats(response.data)
    }
    getStats()
  }, [])

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
              <CardTitle className="text-sm font-medium text-gray-600">Ongoing Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats && dashboardStats?.inProgressTask}</div>
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

        {/* Recent Available Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
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
                  key={task.id || index}
                  task={task}
                  onClick={() => {/* Navigate to task detail */ }}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Pending Tasks</h3>
              <p className="text-sm text-gray-600 mb-4">Browse and apply for available tasks</p>
              <Link to="/pending-tasks">
                <Button className="w-full">Browse Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Ongoing Work</h3>
              <p className="text-sm text-gray-600 mb-4">Track your current projects</p>
              <Link to="/ongoing-tasks">
                <Button variant="outline" className="w-full">View Progress</Button>
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
