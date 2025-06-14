
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import useTask from "@/hooks/useTask";
import HistoryStyleTaskList from "@/components/task-list/HistoryStyleTaskList";
import { toast } from "sonner";

const PendingTasks: React.FC = () => {
  const { getPendingUnassignedTask, acceptTask } = useTask();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      setLoading(true);
      try {
        const response = await getPendingUnassignedTask({
          limit: 100,
          page: 1,
          sort: -1,
          title: "",
          description: "",
        });
        if (response.success && response.data) {
          setTasks(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching pending tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingTasks();
  }, [getPendingUnassignedTask]);

  const handleAcceptTask = async (taskId: string) => {
    const res = await acceptTask(taskId);
    if (res.success) {
      toast.success("Task accepted!");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    }
  };

  const handleDeclineTask = (taskId: string) => {
    toast.success("Task declined!");
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HistoryStyleTaskList
        tasks={tasks}
        loading={loading}
        type="pending"
        onAcceptTask={handleAcceptTask}
        onDeclineTask={handleDeclineTask}
        header={
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
            <p className="text-gray-600 mt-1">See all available tasks. Review details and complexity before accepting.</p>
          </div>
        }
      />
    </div>
  );
};

export default PendingTasks;
