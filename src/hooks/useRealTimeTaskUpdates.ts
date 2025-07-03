
import { useEffect, useCallback } from 'react';
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
    // Auto-refresh removed - real-time updates handled by manual refresh only
    console.log('Real-time task updates configured without auto-refresh');
    
    return () => {
      // Cleanup if needed
    };
  }, [handleNewTask, handleTaskUpdate, handleTaskStatusChange]);
};
