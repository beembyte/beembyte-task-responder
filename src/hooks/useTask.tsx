import { taskApi, getAllunAssignedTaskPayload, getCompletedTaskPayload } from "@/services/taskApi"
import { TaskInfo } from "@/types";
import { handleApiErrors, handleNetworkError } from "@/utils/apiResponse";
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
    inProgressTask: TaskInfo | null
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
                console.log('Task fetched successfully')
                return response
            } else {
                console.log('Failed to fetch task')
                handleApiErrors(response);
            }
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

    const acceptTask = async (task_id: string): Promise<SingleTaskResponse> => {
        try {
            const response = await taskApi.acceptTask(task_id)
            console.log("Accept task response:", response);

            // Check if response exists and has success property
            if (response && response.success === true) {
                toast.success(response.message || "Task accepted successfully!")
                return response
            } else {
                // Handle error cases
                console.log("Accept task failed:", response);
                if (response) {
                    handleApiErrors(response);
                } else {
                    toast.error("Failed to accept task. Please try again.");
                }

                return {
                    success: false,
                    message: response?.message || "Failed to accept task"
                }
            }
        } catch (error) {
            console.error("Accept task error:", error)
            handleNetworkError(error);
            return {
                success: false,
                message: "An unexpected error occurred"
            }
        }
    }

    const cancelTask = async (task_id: string): Promise<SingleTaskResponse> => {
        try {
            const response = await taskApi.cancelTask(task_id)
            console.log("Cancel task response:", response);

            // Check if response exists and has success property
            if (response && response.success === true) {
                toast.success(response.message || "Task cancelled successfully!")
                return response
            } else {
                // Handle error cases
                console.log("Cancel task failed:", response);
                if (response) {
                    handleApiErrors(response);
                } else {
                    toast.error("Failed to cancel task. Please try again.");
                }

                return {
                    success: false,
                    message: response?.message || "Failed to cancel task"
                }
            }
        } catch (error) {
            console.error("Cancel task error:", error)
            handleNetworkError(error);
            return {
                success: false,
                message: "An unexpected error occurred"
            }
        }
    }

    // --- Add submitTask to hook ---
    const submitTask = async ({
        task_id,
        description,
        link,
        files_urls,
    }: {
        task_id: string
        description: string
        link?: string
        files_urls: string[]
    }) => {
        try {
            const response = await taskApi.submitTask({
                task_id,
                description,
                link,
                files_urls,
            });
            if (response && response.success) {
                toast.success(response.message || "Task submitted successfully!");
                return response;
            } else {
                toast.error(response.message || "Failed to submit task.");
                return {
                    success: false,
                    message: response?.message || "Failed to submit task",
                };
            }
        } catch (error) {
            console.error("Submit task error:", error);
            toast.error("An unexpected error occurred while submitting your task.");
            return {
                success: false,
                message: "An unexpected error occurred.",
            };
        }
    };

    return {
        isLoading,
        pendingTasks,
        ongoingTasks,
        completedTasks,
        getPendingUnassignedTask,
        getOngoingTasks,
        getCompletedTasks,
        getDashboardStats,
        getOneTaskById,
        acceptTask,
        cancelTask,
        submitTask
    }
}

export default useTask
