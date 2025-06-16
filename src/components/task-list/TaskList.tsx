
import React from 'react';
// You could use your previous TaskCard here, but ensure you import the correct one!
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: any[];
  taskType: 'pending' | 'ongoing' | 'completed';
  acceptingTasks: Set<string>;
  onTaskClick: (id: string) => void;
  onAcceptTask: (e: React.MouseEvent, id: string) => void;
  onDeclineTask: (e: React.MouseEvent, id: string) => void;
  showCancelButton: boolean;
  onTaskCancelled: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  taskType,
  acceptingTasks,
  onTaskClick,
  onAcceptTask,
  onDeclineTask,
  showCancelButton,
  onTaskCancelled,
}) => (
  <div className="space-y-7">
    {tasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        taskType={taskType}
        acceptingTasks={acceptingTasks}
        onTaskClick={onTaskClick}
        onAcceptTask={onAcceptTask}
        onDeclineTask={onDeclineTask}
        showCancelButton={showCancelButton}
        onTaskCancelled={() => onTaskCancelled(task._id)}
      />
    ))}
  </div>
);

export default TaskList;

