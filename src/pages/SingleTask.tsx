
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import { useAuth } from "@/hooks/useAuth"
import useTask from "@/hooks/useTask"
import { type TaskInfo, TASK_STATUS, ASSIGNED_STATUS } from "@/types"
import TaskHeader from "@/components/task/TaskHeader"
import TaskDescription from "@/components/task/TaskDescription"
import TaskKeyNotes from "@/components/task/TaskKeyNotes"
import TaskAttachments from "@/components/task/TaskAttachments"
import TaskSidebar from "@/components/task/TaskSidebar"
import TaskSubmission from "@/components/task/TaskSubmission"
import { toast } from "sonner"

const SingleTask: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOneTaskById, acceptTask, cancelTask } = useTask()
  const { verifyAuthToken } = useAuth()
  const [task, setTask] = useState<TaskInfo | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isLoadingTask, setIsLoadingTask] = useState(true)
  const [taskNotFound, setTaskNotFound] = useState(false)

  // Verify auth token on component mount
  useEffect(() => {
    verifyAuthToken()
  }, [verifyAuthToken])

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        setIsLoadingTask(true)
        setTaskNotFound(false)
        const response = await getOneTaskById(id)
        if (response.success && response.data) {
          setTask(response.data)
          setTaskNotFound(false)
        } else {
          setTask(null)
          setTaskNotFound(true)
          if (response.message) {
            toast.error(response.message)
          }
        }
        setIsLoadingTask(false)
      }
    }

    fetchTask()
  }, [id])

  const handleAcceptTask = async () => {
    if (!id) return

    setIsAccepting(true)
    try {
      const response = await acceptTask(id)

      if (response.success) {
        // Refresh task data to get updated status
        const updatedResponse = await getOneTaskById(id)
        if (updatedResponse.success && updatedResponse.data) {
          setTask(updatedResponse.data)
        }
      }
    } catch (error) {
      console.error("Accept task error:", error)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleCancelTask = async () => {
    if (!id) return

    setIsCancelling(true)
    try {
      const response = await cancelTask(id)
      if (response.success) {
        // Refresh task data to get updated status
        const updatedResponse = await getOneTaskById(id)
        if (updatedResponse.success && updatedResponse.data) {
          setTask(updatedResponse.data)
        }
      }
    } catch (error) {
      console.error("Cancel task error:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDeclineTask = () => {
    toast.success("Task declined successfully")
    navigate("/dashboard")
  }

  const handleTaskSubmission = () => {
    // Refresh task data after submission
    if (id) {
      const fetchUpdatedTask = async () => {
        const response = await getOneTaskById(id)
        if (response.success && response.data) {
          setTask(response.data)
        }
      }
      fetchUpdatedTask()
    }
  }

  const isTaskAccepted = task?.assigned_status === ASSIGNED_STATUS.ASSIGNED || task?.status === TASK_STATUS.INPROGRESS

  if (isLoadingTask) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xl text-gray-600">Loading task details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (taskNotFound || !task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TaskHeader task={task} />
            <TaskDescription description={task.description} />
            <TaskKeyNotes keyNotes={task.key_notes} />
            <TaskAttachments fileUrls={task.file_urls} />
            
            {/* Task Submission Component for Accepted Tasks */}
            {isTaskAccepted && (
              <TaskSubmission taskId={task.id} onSubmit={handleTaskSubmission} />
            )}
          </div>

          {/* Sidebar */}
          <TaskSidebar
            task={task}
            isTaskAccepted={isTaskAccepted}
            isAccepting={isAccepting}
            isCancelling={isCancelling}
            isLoading={false}
            onAcceptTask={handleAcceptTask}
            onCancelTask={handleCancelTask}
            onDeclineTask={handleDeclineTask}
          />
        </div>
      </div>
    </div>
  )
}

export default SingleTask
