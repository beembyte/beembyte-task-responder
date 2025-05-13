
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Attachment } from '@/types';
import { useTasks } from '@/context/TaskContext';
import Navbar from '@/components/layout/Navbar';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { useToast } from '@/hooks/use-toast';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, completeTask, acceptTask, rejectTask, addAttachment } = useTasks();
  const { toast } = useToast();
  
  const task = getTaskById(id!);
  
  const [attachmentType, setAttachmentType] = useState<'file' | 'link' | 'text'>('text');
  const [attachmentContent, setAttachmentContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [loading, setLoading] = useState(false);
  
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
  
  const handleComplete = () => {
    if (attachmentType && (attachmentContent || attachmentType === 'file') && attachmentName) {
      const newAttachment: Omit<Attachment, 'id' | 'createdAt'> = {
        name: attachmentName,
        type: attachmentType,
        content: attachmentContent,
      };
      
      completeTask(task.id, [{
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        ...newAttachment
      }]);
      
      navigate('/dashboard');
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide all attachment details before completing the task.",
        variant: "destructive"
      });
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch(task.status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'accepted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
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
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <CardDescription>{task.subject}</CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Description</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Created</h3>
                <p className="text-gray-600">{formatDateTime(task.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Deadline</h3>
                <p className="text-gray-600">{formatDate(task.deadline)}</p>
              </div>
            </div>
            
            {task.payment && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Payment</h3>
                <p className="text-lg font-bold text-green-600">
                  NGN {task.payment.toLocaleString()}
                </p>
              </div>
            )}
            
            {(task.status === 'accepted' || task.status === 'completed') && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Progress</h3>
                <ProgressIndicator 
                  startDate={new Date(task.createdAt)} 
                  endDate={new Date(task.deadline)} 
                />
              </div>
            )}
            
            {task.notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Notes</h3>
                <p className="text-gray-700">{task.notes}</p>
              </div>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Attachments</h3>
                <ul className="space-y-2 mt-2">
                  {task.attachments.map((attachment) => (
                    <li key={attachment.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(attachment.createdAt)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                          {attachment.type}
                        </span>
                      </div>
                      {attachment.type === 'text' && (
                        <p className="text-gray-700 text-sm mt-2">{attachment.content}</p>
                      )}
                      {attachment.type === 'link' && (
                        <a
                          href={attachment.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mt-2 block"
                        >
                          {attachment.content}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="justify-end">
            {task.status === 'pending' && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    rejectTask(task.id);
                    navigate('/dashboard');
                  }}
                >
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    acceptTask(task.id);
                    navigate('/dashboard');
                  }}
                >
                  Accept Task
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        
        {task.status === 'accepted' && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Task</CardTitle>
              <CardDescription>Add any final details and complete this task</CardDescription>
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
                    <Label htmlFor="attachmentName">Attachment Name</Label>
                    <Input
                      id="attachmentName"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="Enter a name for this attachment"
                    />
                  </div>
                  
                  <TabsContent value="text" className="mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="textContent">Text Content</Label>
                      <Textarea
                        id="textContent"
                        value={attachmentContent}
                        onChange={(e) => setAttachmentContent(e.target.value)}
                        placeholder="Enter your text here"
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="link" className="mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="linkContent">Link</Label>
                      <Input
                        id="linkContent"
                        value={attachmentContent}
                        onChange={(e) => setAttachmentContent(e.target.value)}
                        placeholder="https://example.com"
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
                          // In a real app, this would upload the file and get a URL
                          // For now, we'll just use the filename
                          if (e.target.files && e.target.files[0]) {
                            setAttachmentContent(e.target.files[0].name);
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        For this demo, files aren't actually uploaded
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Completing...' : 'Complete Task'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
