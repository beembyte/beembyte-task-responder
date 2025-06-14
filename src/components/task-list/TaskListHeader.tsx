
import React from 'react';

interface TaskListHeaderProps {
  title: string;
  totalTasks: number;
  taskType: 'pending' | 'ongoing' | 'completed';
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ title, totalTasks }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
    <div className="flex items-center justify-between">
      <p className="text-lg text-gray-600">
        {totalTasks} task{totalTasks !== 1 ? 's' : ''} available
      </p>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Easy</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Hard</span>
        </div>
      </div>
    </div>
  </div>
);

export default TaskListHeader;
