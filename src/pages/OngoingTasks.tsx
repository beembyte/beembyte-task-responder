
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskListPage from '@/components/TaskListPage';

const OngoingTasks: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TaskListPage title="Ongoing Tasks" taskType="ongoing" />
    </div>
  );
};

export default OngoingTasks;
