
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressIndicator from './ui/progress-indicator';

interface TaskCardProps {
  task: Task;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  isDetailed?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onAccept, 
  onReject, 
  onComplete,
  isDetailed = false
}) => {
  const isPending = task.status === 'pending';
  const isAccepted = task.status === 'accepted';
  const isCompleted = task.status === 'completed';
  
  // Format deadline
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate days left
  const getDaysLeft = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };
  
  const getStatusBadge = () => {
    switch(task.status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${isDetailed ? '' : 'hover:shadow-md transition-shadow'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-500">{task.subject}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <p className={`text-gray-700 ${isDetailed ? '' : 'line-clamp-2'}`}>{task.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Deadline: {formatDate(task.deadline)}</span>
            <span className={`font-medium ${
              task.status === 'completed' ? 'text-green-600' : 
              getDaysLeft() === 'Overdue' ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {getDaysLeft()}
            </span>
          </div>
          
          {(isAccepted || isCompleted) && (
            <ProgressIndicator 
              startDate={new Date(task.createdAt)} 
              endDate={new Date(task.deadline)} 
              className="mt-4"
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end gap-2">
        {isPending && (
          <>
            <Button 
              variant="outline" 
              onClick={() => onReject?.(task.id)}
            >
              Decline
            </Button>
            <Button 
              onClick={() => onAccept?.(task.id)}
            >
              Accept Task
            </Button>
          </>
        )}
        
        {isAccepted && (
          <Button 
            onClick={() => onComplete?.(task.id)}
          >
            Complete Task
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
