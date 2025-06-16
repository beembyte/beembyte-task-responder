
import { useEffect, useState } from "react";
import { TaskInfo } from "@/types";
import { taskApi } from "@/services/taskApi";

export function useTaskInfo(taskId: string | undefined) {
  const [task, setTask] = useState<TaskInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setError("Missing taskId");
      return;
    }

    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);
      const response = await taskApi.getOneTaskById(taskId);
      if (response && response.success && response.data) {
        setTask(response.data);
      } else {
        setTask(null);
        setError(response?.message || "Failed to fetch task.");
      }
      setIsLoading(false);
    };

    fetchTask();
  }, [taskId]);

  return { task, isLoading, error };
}
