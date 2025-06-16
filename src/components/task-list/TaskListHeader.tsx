
import React from 'react';

interface TaskListHeaderProps {
  title: string;
  totalTasks: number;
  taskType: 'pending' | 'ongoing' | 'completed';
}

const titleMap: Record<string, string> = {
  pending: 'Available Tasks',
  ongoing: 'Ongoing Tasks',
  completed: 'Completed Tasks',
};

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ title, totalTasks, taskType }) => (
  <div className="mb-2">
    <h1 className="text-2xl font-bold text-gray-900">
      {titleMap[taskType] ?? title}
    </h1>
    <div className="text-sm text-muted-foreground mt-1">{totalTasks} {taskType} task{totalTasks === 1 ? '' : 's'}</div>
  </div>
);

export default TaskListHeader;

