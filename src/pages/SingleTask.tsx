"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Clock, User } from "lucide-react"
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

  // Helper: Build the job stats row (like Upwork reference)
  const JobStatsRow = () => (
    <div className="flex flex-wrap items-center justify-between border-t border-b border-muted-foreground/20 py-4 px-4 bg-background rounded-lg shadow-sm">
      {/* Customize these according to task properties as needed */}
      <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2 border-r border-muted-foreground/10 last:border-none">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <div>
          <div className="text-xs font-semibold text-foreground">Deadline</div>
          <div className="text-sm text-muted-foreground">{task?.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</div>
        </div>
      </div>
      <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2 border-r border-muted-foreground/10 last:border-none">
        <User className="w-5 h-5 text-muted-foreground" />
        <div>
          <div className="text-xs font-semibold text-foreground">Client</div>
          <div className="text-sm text-muted-foreground truncate">{task?.created_by?.first_name} {task?.created_by?.last_name}</div>
        </div>
      </div>
      <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2 border-r border-muted-foreground/10 last:border-none">
        <Loader2 className="w-5 h-5 text-muted-foreground" />
        <div>
          <div className="text-xs font-semibold text-foreground">Status</div>
          <div className="text-sm text-muted-foreground">{task?.status}</div>
        </div>
      </div>
      <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2">
        <span className="text-emerald-600 font-semibold">₦{task?.price?.toLocaleString("en-NG")}</span>
        <span className="text-xs text-muted-foreground">Fixed</span>
      </div>
    </div>
  )

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

      <div className="flex-1 container mx-auto px-1 py-4 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Outer Card Wrap */}
        <div className="flex flex-col lg:flex-row gap-0 bg-card/80 rounded-xl border border-muted-foreground/20 shadow-sm overflow-hidden">

          {/* Left/main content with vertical divider on large screens */}
          <div className="flex-1 px-0 py-6 lg:px-6 border-b lg:border-b-0 lg:border-r border-muted-foreground/10">
            <div className="space-y-4">

              <TaskHeader task={task} />
              <TaskDescription description={task.description} />
              <TaskKeyNotes keyNotes={task.key_notes} />
              <TaskAttachments fileUrls={task.file_urls} />

              {/* Job/Task Stats Row */}
              <JobStatsRow />

              {submissionData && (
                <TaskSubmissionDisplay
                  description={submissionData.description}
                  link={submissionData.link}
                  files_urls={submissionData.files_urls}
                />
              )}

              {/* Submit area: only if accepted but not yet submitted */}
              {isTaskAccepted && !submissionData && (
                <TaskSubmission 
                  taskId={task._id} 
                  onSubmit={handleTaskSubmission}
                  onCancel={handleCancelTask}
                />
              )}
            </div>
          </div>

          {/* Sidebar: no border on bottom in desktop */}
          <div className="w-full lg:max-w-[340px] flex-shrink-0 bg-background p-4">
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
