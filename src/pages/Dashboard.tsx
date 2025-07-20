import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AVAILABILITY_STATUS, User, USER_STATUS } from '@/types';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import useTask, { DashStatsData } from '@/hooks/useTask';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CompactTaskCard from '@/components/CompactTaskCard';
import RankingBadge from '@/components/RankingBadge';
import AccountActivationBanner from '@/components/AccountActivationBanner';

const getDicebearUrl = (firstName: string) => {
  const seed = firstName ? firstName.trim() : "user";
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthGuard(true); // Require auth and get user from server
  const { isLoading, getPendingUnassignedTask, getOngoingTasks, getDashboardStats } = useTask()
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [ongoingTask, setOngoingTask] = useState<any>(null)
  const [dashboardStats, setDashStats] = useState<DashStatsData | null>(null)

  // Redirect non-vetted users to vetting page
  useEffect(() => {
    if (user && user.is_vetted === false) {
      navigate('/vetting');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Only fetch tasks if user is activated (not pending) and vetted
    if (user && user.is_vetted === true && user.status !== USER_STATUS.PENDING) {
      const fetchRecentTasks = async () => {
        try {
          console.log('Fetching recent tasks...');
          const response = await getPendingUnassignedTask({
            limit: 6,
            page: 1,
            sort: 1,
            title: '',
            description: ''
          });

          console.log('Tasks response:', response);
          if (response.success && response.data) {
            setRecentTasks(response.data.items || []);
          } else {
            console.log('No tasks data or failed response');
            setRecentTasks([]);
          }
        } catch (error) {
          console.error('Error fetching recent tasks:', error);
          setRecentTasks([]);
        }
      };

      fetchRecentTasks();
    }
  }, [user]);

  useEffect(() => {
    // Only fetch stats if user is activated (not pending) and vetted
    if (user && user.is_vetted === true && user.status !== USER_STATUS.PENDING) {
      const getStats = async () => {
        try {
          console.log('Fetching dashboard stats...');
          const response = await getDashboardStats()
          console.log('Dashboard stats response:', response);
          if (response.success && response.data) {
            setDashStats(response.data)
          } else {
            console.log('No dashboard stats or failed response');
            setDashStats(null);
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          setDashStats(null);
        }
      }
      getStats()
    }
  }, [user])

  // Don't render anything if user is not vetted (they'll be redirected)
  if (user && user.is_vetted === false) {
    return null;
  }

  // Show loading if no user data yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  const handleOngoingTaskClick = () => {
    if (dashboardStats?.inProgressTask) {
      navigate(`/task/${dashboardStats?.inProgressTask._id}`);
    }
  };

  // Check if user is pending approval (vetted but status is pending)
  const isPendingApproval = user?.is_vetted === true && user?.status === USER_STATUS.PENDING;

  // Extract responder data safely from the new API structure
  const responderData = user?.responder_id;
  const responderId = responderData?.responder_id || null;
  const rankStatus = responderData?.rank_status || null;
  const rankCriteria = responderData?.rank_criteria || null;
  const availabilityStatus = responderData?.availability_status || user?.availability_status;

  // Add logging to debug the responder data structure
  console.log('Dashboard - User data:', user);
  console.log('Dashboard - Responder data:', responderData);
  console.log('Dashboard - Responder ID:', responderId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-6">
        {/* User Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage 
                src={getDicebearUrl(user?.first_name || 'user')} 
                alt={user?.first_name || 'User'} 
              />
              <AvatarFallback>{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900">
                Welcome, {user?.first_name || 'User'}!
              </h1>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-gray-500">
                    <span className="mr-2">ResponderId:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {responderId || 'N/A'}
                    </span>
                  </span>
                  {!isPendingApproval && rankStatus && (
                    <div className="flex-shrink-0">
                      <RankingBadge 
                        rankStatus={rankStatus}
                        userCriteria={rankCriteria}
                        completedTasks={dashboardStats?.completedThisMonthCount || 0} 
                        size="sm" 
                      />
                    </div>
                  )}
                </div>
                {!isPendingApproval && (
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${availabilityStatus === AVAILABILITY_STATUS.AVAILABLE ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={`text-sm font-medium ${availabilityStatus === AVAILABILITY_STATUS.AVAILABLE ? 'text-green-600' : 'text-red-600'}`}>
                      {availabilityStatus === AVAILABILITY_STATUS.AVAILABLE ? 'Available' : 'Busy'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Show Account Activation Banner for pending approval users */}
        {isPendingApproval && (
          <AccountActivationBanner isActivated={false} />
        )}

        {/* Only show task-related content if user is approved */}
        {!isPendingApproval && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Available Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{dashboardStats?.pendingTasksCount || 0}</div>
                  <p className="text-xs text-gray-500">Ready to apply</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{dashboardStats?.inProgressTask ? 1 : 0}</div>
                  <p className="text-xs text-gray-500">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{dashboardStats?.completedThisMonthCount || 0}</div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Ongoing Task */}
            {dashboardStats?.inProgressTask && (
              <div className="mb-8">
                <h2 className="text-base font-semibold flex items-center mb-4">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Current Task
                </h2>
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleOngoingTaskClick}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">
                              {dashboardStats.inProgressTask.title}
                            </h3>
                            <p className="text-xs text-blue-600 font-medium mb-2">
                              {dashboardStats.inProgressTask.subject}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              In Progress
                            </Badge>
                            {dashboardStats.inProgressTask.difficulty && (
                              <Badge className={`${getDifficultyColor(dashboardStats.inProgressTask.difficulty)} font-semibold`}>
                                {dashboardStats.inProgressTask.difficulty.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 text-xs leading-relaxed line-clamp-2">
                          {dashboardStats.inProgressTask.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Due: {formatDate(String(dashboardStats.inProgressTask.deadline || dashboardStats.inProgressTask.createdAt))}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Started: {formatDate(String(dashboardStats.inProgressTask.createdAt))}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-64 flex flex-col justify-between">
                        <div className="text-center lg:text-right mb-6">
                          <div className="text-lg font-bold text-green-600 mb-1">
                            {formatPayment(dashboardStats.inProgressTask.price || 0)}
                          </div>
                          <p className="text-xs text-gray-500">Fixed price</p>
                        </div>

                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/task/${dashboardStats.inProgressTask._id}`);
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
                <h2 className="text-base font-semibold flex items-center">
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
                  {recentTasks.map((task) => (
                    <CompactTaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <h3 className="text-base font-medium text-gray-900">No tasks available</h3>
                  <p className="text-xs text-gray-500 mt-2">New tasks will appear here when available</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-dashed border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-semibold mb-2">Browse Available Tasks</h3>
                  <p className="text-xs text-gray-600 mb-4">Find and apply for new tasks</p>
                  <Link to="/pending-tasks">
                    <Button className="w-full">Browse Tasks</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-semibold mb-2">Work History</h3>
                  <p className="text-xs text-gray-600 mb-4">Review completed projects</p>
                  <Link to="/completed-tasks">
                    <Button variant="outline" className="w-full">View History</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Show different content for pending approval users */}
        {isPendingApproval && (
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Account is Under Review
            </h2>
            <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for completing your vetting application! Our team is currently reviewing your profile. 
              You'll receive an email notification once your account is approved and you can start accepting tasks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-semibold mb-2">Update Profile</h3>
                  <p className="text-xs text-gray-600 mb-4">Make changes to your profile information</p>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-semibold mb-2">Wallet</h3>
                  <p className="text-xs text-gray-600 mb-4">Check your wallet and earnings</p>
                  <Link to="/wallet">
                    <Button variant="outline" className="w-full">View Wallet</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
