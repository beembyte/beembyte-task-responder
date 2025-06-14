
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CancelTaskButton from '@/components/task/CancelTaskButton';

interface TaskCardProps {
  task: any;
  taskType: 'pending' | 'ongoing' | 'completed';
  acceptingTasks: Set<string>;
  onTaskClick: (taskId: string) => void;
  onAcceptTask: (e: React.MouseEvent, taskId: string) => void;
  onDeclineTask: (e: React.MouseEvent, taskId: string) => void;
  showCancelButton: boolean;
  onTaskCancelled: () => void;
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
      return 'bg-green-500 text-white hover:bg-green-600';
    case 'medium':
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    case 'hard':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return 'bg-gray-500 text-white hover:bg-gray-600';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  taskType,
  acceptingTasks,
  onTaskClick,
  onAcceptTask,
  onDeclineTask,
  showCancelButton,
  onTaskCancelled
}) => (
  <div
    className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer max-w-3xl mx-auto px-0"
    onClick={() => onTaskClick(task._id)}
  >
    <div className="p-6 flex flex-col gap-3">
      {/* Title & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 mb-0.5 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            {task.subject && (
              <span className="font-medium text-blue-600">{task.subject}</span>
            )}
            {task.subject && <span>•</span>}
            <span className="text-gray-500">Posted {formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 mt-2 sm:mt-0">
          <span className="font-bold text-base text-green-600 mb-0.5">
            {formatPayment(task.price || 0)}
          </span>
          <span className="text-xs text-gray-500">Fixed-price</span>
        </div>
      </div>
      {/* Description */}
      <div className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-0">
        {task.description}
      </div>
      {/* Complexity Badge directly under description */}
      {task.difficulty && (
        <Badge className={`w-fit text-xs capitalize mt-1 ${getDifficultyColor(task.difficulty)}`}>
          {task.difficulty}
        </Badge>
      )}
      {/* Actions */}
      <div className="flex flex-row items-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
        {taskType === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              onClick={(e) => onDeclineTask(e, task._id)}
            >
              Decline
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 text-sm bg-green-600 hover:bg-green-700"
              onClick={(e) => onAcceptTask(e, task._id)}
              disabled={acceptingTasks.has(task._id)}
            >
              {acceptingTasks.has(task._id) ? 'Accepting...' : 'Accept'}
            </Button>
          </>
        )}
        {showCancelButton && taskType === 'ongoing' && (
          <CancelTaskButton
            taskId={task._id}
            onTaskCancelled={onTaskCancelled}
            className="h-9"
          />
        )}
        {taskType === 'completed' && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )}
      </div>
    </div>
  </div>
);

export default TaskCard;
