
import { taskApi, getAllunAssignedTaskPayload } from "@/services/taskApi"
import { useState } from "react"
import { toast } from "sonner"

export interface TaskResponse {
  success: boolean;
  message: string;
  data?: {
    tasks: any[];
    totalPages: number;
    currentPage: number;
    totalTasks: number;
  };
}

const useTask = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingTasks, setPendingTasks] = useState<any[]>([])
  const [ongoingTasks, setOngoingTasks] = useState<any[]>([])
  const [completedTasks, setCompletedTasks] = useState<any[]>([])

  const getPendingUnassignedTask = async (payload: getAllunAssignedTaskPayload): Promise<TaskResponse> => {
    setIsLoading(true)
    try {
      const response = await taskApi.getAllPendingAndUnassignedTask(payload)
      if (response.success) {
        setPendingTasks(response.data?.tasks || [])
        return response
      }
      toast.error(response.message || "Failed to fetch tasks")
      return response
    } catch (error) {
      console.error("Fetch tasks error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      return {
        success: false,
        message: "An unexpected error occurred"
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getOngoingTasks = async (payload: getAllunAssignedTaskPayload): Promise<TaskResponse> => {
    setIsLoading(true)
    try {
      // You'll need to create a similar endpoint for ongoing tasks
      // For now, returning empty data
      return {
        success: true,
        message: "Success",
        data: {
          tasks: [],
          totalPages: 0,
          currentPage: 1,
          totalTasks: 0
        }
      }
    } catch (error) {
      console.error("Fetch ongoing tasks error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      return {
        success: false,
        message: "An unexpected error occurred"
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getCompletedTasks = async (payload: getAllunAssignedTaskPayload): Promise<TaskResponse> => {
    setIsLoading(true)
    try {
      // You'll need to create a similar endpoint for completed tasks
      // For now, returning empty data
      return {
        success: true,
        message: "Success",
        data: {
          tasks: [],
          totalPages: 0,
          currentPage: 1,
          totalTasks: 0
        }
      }
    } catch (error) {
      console.error("Fetch completed tasks error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      return {
        success: false,
        message: "An unexpected error occurred"
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    pendingTasks,
    ongoingTasks,
    completedTasks,
    getPendingUnassignedTask,
    getOngoingTasks,
    getCompletedTasks
  }
}

export default useTask
