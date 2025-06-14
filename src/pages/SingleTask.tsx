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
import TaskSubmissionDisplay from "@/components/task/TaskSubmissionDisplay"
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
  const [submissionData, setSubmissionData] = useState<{
    description?: string;
    link?: string;
    files_urls?: string[];
  } | null>(null);

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

  // Update submission data if task has submission in its data
  useEffect(() => {
    if (task && task.submit) {
      setSubmissionData({
        description: task.submit.description,
        link: task.submit.link,
        files_urls: task.submit.files_urls,
      })
    } else {
      setSubmissionData(null)
    }
  }, [task])

  const handleAcceptTask = async () => {
    if (!id) return

    setIsAccepting(true)
    try {
      const response = await acceptTask(id)

      if (response.success) {
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

  const handleTaskSubmission = (updatedTaskData?: any) => {
    // updatedTaskData is passed by TaskSubmission component after submission
    if (updatedTaskData && updatedTaskData.submit) {
      setSubmissionData({
        description: updatedTaskData.submit.description,
        link: updatedTaskData.submit.link,
        files_urls: updatedTaskData.submit.files_urls,
      })
      setTask(updatedTaskData)
    } else if (typeof updatedTaskData === "undefined" && task?._id) {
      // fallback: Refetch task
      const fetchUpdatedTask = async () => {
        const response = await getOneTaskById(task._id)
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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xl text-muted-foreground">Loading task details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (taskNotFound || !task) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
            <p className="text-muted-foreground mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-4 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Content - Takes 2/3 on desktop, full width on mobile */}
          <div className="lg:col-span-2 space-y-4">
            <TaskHeader task={task} />
            <TaskDescription description={task.description} />
            <TaskKeyNotes keyNotes={task.key_notes} />
            <TaskAttachments fileUrls={task.file_urls} />
            
            {/* ------- Move submission data display HERE ------- */}
            {submissionData && (
              <TaskSubmissionDisplay
                description={submissionData.description}
                link={submissionData.link}
                files_urls={submissionData.files_urls}
              />
            )}

            {isTaskAccepted && (
              <TaskSubmission 
                taskId={task._id} 
                onSubmit={handleTaskSubmission}
                onCancel={handleCancelTask}
              />
            )}
          </div>

          {/* Sidebar - Takes 1/3 on desktop, full width on mobile */}
          <div className="lg:col-span-1 lg:sticky lg:top-4 lg:h-fit">
            {/* ---- REMOVE submission display from here ---- */}

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
    </div>
  )
}

export default SingleTask
