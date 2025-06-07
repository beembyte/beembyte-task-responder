
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskListPage from '@/components/TaskListPage';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const OngoingTasks: React.FC = () => {
  const { isAuthenticated } = useAuthGuard(true);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TaskListPage title="Ongoing Tasks" taskType="ongoing" showCancelButton={true} />
    </div>
  );
};

export default OngoingTasks;
