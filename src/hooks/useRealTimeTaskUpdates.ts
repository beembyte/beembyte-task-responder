
import { useEffect, useCallback } from 'react';
import { socket } from '@/services/socket';
import { toast } from 'sonner';

interface UseRealTimeTaskUpdatesProps {
  onNewTask?: (task: any) => void;
  onTaskUpdate?: (task: any) => void;
  onTaskStatusChange?: (taskId: string, status: string) => void;
}

export const useRealTimeTaskUpdates = ({
  onNewTask,
  onTaskUpdate,
  onTaskStatusChange
}: UseRealTimeTaskUpdatesProps) => {
  
  const handleNewTask = useCallback((task: any) => {
    console.log('New task received:', task);
    toast.success('New task available!', {
      description: task.title
    });
    onNewTask?.(task);
  }, [onNewTask]);

  const handleTaskUpdate = useCallback((task: any) => {
    console.log('Task updated:', task);
    onTaskUpdate?.(task);
  }, [onTaskUpdate]);

  const handleTaskStatusChange = useCallback((data: { taskId: string; status: string }) => {
    console.log('Task status changed:', data);
    onTaskStatusChange?.(data.taskId, data.status);
  }, [onTaskStatusChange]);

  useEffect(() => {
    // Listen for new tasks
    socket.on('new_task', handleNewTask);
    
    // Listen for task updates
    socket.on('task_updated', handleTaskUpdate);
    
    // Listen for task status changes
    socket.on('task_status_changed', handleTaskStatusChange);

    // Cleanup listeners on unmount
    return () => {
      socket.off('new_task', handleNewTask);
      socket.off('task_updated', handleTaskUpdate);
      socket.off('task_status_changed', handleTaskStatusChange);
    };
  }, [handleNewTask, handleTaskUpdate, handleTaskStatusChange]);
};
