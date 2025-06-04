
import { taskApi, getAllunAssignedTaskPayload, getCompletedTaskPayload } from "@/services/taskApi"
import { TaskInfo } from "@/types";
import { useState } from "react"
import { toast } from "sonner"

export interface TaskResponse {
    success: boolean;
    message: string;
    data?: {
        items: any[];
        meta: {
            total: number
            limit: number
            page: number
        }
    };
}

export interface SingleTaskResponse {
    success: boolean;
    message: string;
    data?: TaskInfo;
}

export interface DashboardStats {
    success: boolean;
    message: string;
    data?: DashStatsData;
}

export interface DashStatsData {
    pendingTasksCount: number | null,
    completedThisMonthCount: number | null,
    inProgressTask: number | null
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
                    items: [],
                    meta: {
                        total: 0,
                        page: 1,
                        limit: 0
                    }
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

    const getCompletedTasks = async (payload: getCompletedTaskPayload): Promise<TaskResponse> => {
        setIsLoading(true)
        try {
            const response = await taskApi.getCompletedTask(payload)
            if (response.success) {
                return response
            }
            toast.error(response.message || "Failed to fetch tasks")
            return response
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


    const getDashboardStats = async (): Promise<DashboardStats> => {
        setIsLoading(true)
        try {
            const response = await taskApi.getDashboardStats()
            if (response.success) {
                return response
            }
            toast.error(response.message || "Failed to fetch tasks")
            return response
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

    const getOneTaskById = async (task_id: string): Promise<SingleTaskResponse> => {
        setIsLoading(true)
        try {
            const response = await taskApi.getOneTaskById(task_id)
            if (response.success) {
                return response
            }
            toast.error(response.message || "Failed to fetch tasks")
            return response
        } catch (error) {
            console.error("Fetch single task error:", error)
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
        getCompletedTasks,
        getDashboardStats,
        getOneTaskById
    }
}

export default useTask
