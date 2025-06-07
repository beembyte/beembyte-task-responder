
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import useTask from '@/hooks/useTask';
import { toast } from 'sonner';

interface CancelTaskButtonProps {
  taskId: string;
  onTaskCancelled?: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const CancelTaskButton: React.FC<CancelTaskButtonProps> = ({
  taskId,
  onTaskCancelled,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const { cancelTask } = useTask();

  const handleCancelTask = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCancelling(true);
    try {
      const response = await cancelTask(taskId);
      if (response.success) {
        onTaskCancelled?.();
      }
    } catch (error) {
      console.error('Cancel task error:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`hover:bg-red-50 hover:border-red-300 hover:text-red-600 ${className}`}
      onClick={handleCancelTask}
      disabled={isCancelling}
    >
      {isCancelling ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cancelling...
        </>
      ) : (
        'Cancel Task'
      )}
    </Button>
  );
};

export default CancelTaskButton;
