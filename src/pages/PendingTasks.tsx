
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskListPage from '@/components/TaskListPage';

const PendingTasks: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TaskListPage title="Available Tasks" taskType="pending" />
    </div>
  );
};

export default PendingTasks;
