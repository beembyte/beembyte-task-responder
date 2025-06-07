
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, Attachment, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  pendingTasks: Task[];
  acceptedTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  acceptTask: (taskId: string) => void;
  rejectTask: (taskId: string) => void;
  completeTask: (taskId: string, attachments?: Attachment[]) => void;
  getCurrentTask: () => Task | null;
  getTaskById: (id: string) => Task | undefined;
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const acceptedTasks = tasks.filter(task => task.status === 'accepted');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Mock API call to fetch tasks
  useEffect(() => {
    const fetchTasks = () => {
      // Simulate API delay
      setTimeout(() => {
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Software Developer at Xanotech',
            subject: 'Web Development',
            description: 'Looking for a skilled developer to create a responsive web application with modern technologies.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: 'pending',
            payment: 4813.17
          },
          {
            id: '2',
            title: 'Mobile App Update',
            subject: 'Mobile Development',
            description: 'Need to update our existing mobile app with new features and UI improvements.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'pending',
            payment: 2500
          },
          {
            id: '3',
            title: 'Website Bug Fixes',
            subject: 'Bug Fixing',
            description: 'Our e-commerce website has several bugs that need to be fixed urgently.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'pending',
            payment: 1200
          }
        ];
        
        setTasks(mockTasks);
        setIsLoading(false);
      }, 1000);
    };

    fetchTasks();
  }, []);

  const getCurrentTask = () => {
    return acceptedTasks.length > 0 ? acceptedTasks[0] : null;
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status, responder: status === 'accepted' ? user : task.responder }
          : task
      )
    );
  };

  const acceptTask = (taskId: string) => {
    const currentTask = getCurrentTask();
    
    if (currentTask) {
      toast({
        title: "Cannot Accept Task",
        description: "You already have an active task. Please complete it first.",
        variant: "destructive"
      });
      return;
    }
    
    updateTaskStatus(taskId, 'accepted');
    
    // Update user availability
    if (user) {
      updateProfile({ availability_status: 'busy' as any });
    }
    
    toast({
      title: "Task Accepted",
      description: "You can now start working on this task."
    });
  };

  const rejectTask = (taskId: string) => {
    updateTaskStatus(taskId, 'rejected');
    toast({
      title: "Task Declined",
      description: "You have declined this task."
    });
  };

  const completeTask = (taskId: string, attachments?: Attachment[]) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed', 
              attachments: [...(task.attachments || []), ...(attachments || [])] 
            }
          : task
      )
    );
    
    // Update user availability
    if (user) {
      updateProfile({ availability_status: 'available' as any });
    }
    
    toast({
      title: "Task Completed",
      description: "Great job! The task has been marked as completed."
    });
  };

  const addAttachment = (taskId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => {
    const newAttachment: Attachment = {
      ...attachment,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, attachments: [...(task.attachments || []), newAttachment] }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      pendingTasks,
      acceptedTasks,
      completedTasks,
      isLoading,
      acceptTask,
      rejectTask,
      completeTask,
      getCurrentTask,
      getTaskById,
      addAttachment,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
