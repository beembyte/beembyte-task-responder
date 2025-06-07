
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskListPage from '@/components/TaskListPage';

const CompletedTasks: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TaskListPage title="Completed Tasks" taskType="completed" />
    </div>
  );
};

export default CompletedTasks;
