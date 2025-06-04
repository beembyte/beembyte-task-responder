
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const SingleTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch task by ID - replace with actual API call
    const fetchTask = async () => {
      setLoading(true);
      try {
        // This would be your actual API call
        // const response = await taskApi.getTaskById(id);
        
        // Mock data for demonstration
        const mockTask = {
          "_id": id,
          "title": "API Service Development",
          "description": "Set up a comprehensive backend system for a banking application with secure authentication, transaction processing, and account management features. This project requires expertise in Node.js, Express, MongoDB, and financial API integrations.",
          "subject": "coding",
          "deadline": "2025-06-13T03:05:00.000Z",
          "files": [],
          "key_notes": ["urgent", "high-priority", "financial"],
          "created_by": "682038f63dc68317f799e7b3",
          "price": 15993.8,
          "difficulty": "hard",
          "status": "pending",
          "assigned_status": "pending",
          "createdAt": "2025-05-17T03:05:31.083Z",
          "updatedAt": "2025-05-17T03:05:31.083Z",
          "__v": 0
        };
        
        setTask(mockTask);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptTask = () => {
    // Add accept task logic here
    console.log('Accept task:', id);
  };

  const handleDeclineTask = () => {
    // Add decline task logic here
    console.log('Decline task:', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading task details...</div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{task.title}</CardTitle>
                    <p className="text-lg text-blue-600 font-medium">{task.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(task.status)}`}>
                      {task.status}
                    </Badge>
                    {task.difficulty && (
                      <Badge className={`${getDifficultyColor(task.difficulty)} font-semibold`}>
                        {task.difficulty.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{task.description}</p>
              </CardContent>
            </Card>

            {/* Key Notes */}
            {task.key_notes && task.key_notes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Key Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.key_notes.map((note: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Files Section */}
            {task.files && task.files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No files attached to this task.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatPayment(task.price)}
                  </div>
                  <p className="text-gray-500">Fixed Price</p>
                </div>
              </CardContent>
            </Card>

            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-sm text-gray-600">{formatDate(task.deadline)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Posted</p>
                    <p className="text-sm text-gray-600">{formatDate(task.createdAt)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Client ID</p>
                    <p className="text-sm text-gray-600 font-mono">{task.created_by}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {task.status === 'pending' && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                      onClick={handleAcceptTask}
                    >
                      Accept Task
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-lg py-6"
                      onClick={handleDeclineTask}
                    >
                      Decline Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
