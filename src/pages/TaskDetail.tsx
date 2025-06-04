
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TaskInfo, TASK_STATUS, TASK_DIFFICULTY } from '@/types';
import Navbar from '@/components/layout/Navbar';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { useToast } from '@/hooks/use-toast';
import useTask from '@/hooks/useTask';
import { Calendar, Clock, DollarSign, User, FileText, AlertTriangle } from 'lucide-react';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOneTaskById, isLoading } = useTask();
  const { toast } = useToast();

  const [attachmentType, setAttachmentType] = useState<'file' | 'link' | 'text'>('text');
  const [attachmentContent, setAttachmentContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState<TaskInfo | null>(null);

  useEffect(() => {
    const getTask = async () => {
      if (id) {
        const response = await getOneTaskById(id);
        if (response.success && response.data) {
          setTask(response.data);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch task details",
            variant: "destructive"
          });
        }
      }
    };
    getTask();
  }, [id, getOneTaskById, toast]);

  if (isLoading) {
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

  const handleComplete = async () => {
    if (attachmentType && (attachmentContent || attachmentType === 'file') && attachmentName) {
      setSubmitting(true);
      
      // In a real implementation, you would call an API to complete the task
      // For now, we'll just show a success message and navigate back
      
      setTimeout(() => {
        toast({
          title: "Task Completed",
          description: "Your task has been marked as complete with the provided deliverables.",
        });
        navigate('/dashboard');
      }, 1000);
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide all attachment details before completing the task.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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

  const getDifficultyColor = (difficulty: TASK_DIFFICULTY) => {
    switch (difficulty) {
      case TASK_DIFFICULTY.EASY:
        return 'bg-green-100 text-green-800';
      case TASK_DIFFICULTY.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TASK_DIFFICULTY.HARD:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case TASK_STATUS.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case TASK_STATUS.INPROGRESS:
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case TASK_STATUS.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case TASK_STATUS.CLANCELLED:
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
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
                    {task.subject && (
                      <CardDescription className="text-lg text-blue-600 font-medium">
                        {task.subject}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge()}
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty.toUpperCase()}
                    </Badge>
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
                <p className="text-gray-700 leading-relaxed text-lg">
                  {task.description || 'No description provided'}
                </p>
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
            {task.file_urls && task.file_urls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.file_urls.map((fileUrl, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <a 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          File {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Section */}
            {task.status === TASK_STATUS.INPROGRESS && (
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Project Budget
                </CardTitle>
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
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDateTime(task.createdAt)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Created By</p>
                    <p className="text-sm text-gray-600 font-mono">{task.created_by}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {task.status === TASK_STATUS.PENDING && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                      onClick={() => {
                        // Handle accept task
                        toast({
                          title: "Task Accepted",
                          description: "You have accepted this task.",
                        });
                      }}
                    >
                      Accept Task
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-lg py-6"
                      onClick={() => {
                        // Handle decline task
                        toast({
                          title: "Task Declined",
                          description: "You have declined this task.",
                        });
                        navigate('/dashboard');
                      }}
                    >
                      Decline Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Complete Task Section */}
        {task.status === TASK_STATUS.INPROGRESS && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Complete Task</CardTitle>
              <CardDescription>Add your deliverables and complete this task</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" onValueChange={(v) => setAttachmentType(v as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="text">Add Text</TabsTrigger>
                  <TabsTrigger value="link">Add Link</TabsTrigger>
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attachmentName">Deliverable Name</Label>
                    <Input
                      id="attachmentName"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="Enter a name for this deliverable"
                    />
                  </div>

                  <TabsContent value="text" className="mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="textContent">Text Content</Label>
                      <Textarea
                        id="textContent"
                        value={attachmentContent}
                        onChange={(e) => setAttachmentContent(e.target.value)}
                        placeholder="Enter your deliverable content here"
                        rows={5}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="link" className="mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="linkContent">Link URL</Label>
                      <Input
                        id="linkContent"
                        value={attachmentContent}
                        onChange={(e) => setAttachmentContent(e.target.value)}
                        placeholder="https://example.com/deliverable"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="fileUpload">Upload File</Label>
                      <Input
                        id="fileUpload"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachmentContent(e.target.files[0].name);
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        File upload is simulated in this demo
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleComplete} 
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Complete Task'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
