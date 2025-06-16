
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import useTask from "@/hooks/useTask";
import HistoryStyleTaskList from "@/components/task-list/HistoryStyleTaskList";

const CompletedTasks: React.FC = () => {
  const { getCompletedTasks } = useTask();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      setLoading(true);
      try {
        const response = await getCompletedTasks({
          limit: 50,
          page: 1,
          sort: -1,
          title: "",
          description: "",
        });
        if (response.success && response.data) {
          setTasks(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedTasks();
  }, [getCompletedTasks]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HistoryStyleTaskList
        tasks={tasks}
        loading={loading}
        type="completed"
        header={
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Completed Tasks</h1>
            <p className="text-gray-600 mt-1">Browse your finished work, review payment, difficulty and more.</p>
          </div>
        }
      />
    </div>
  );
};

export default CompletedTasks;
