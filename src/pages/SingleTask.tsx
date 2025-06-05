"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, User, FileText, AlertTriangle } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import { useToast } from "@/hooks/use-toast"
import useTask from "@/hooks/useTask"
import { type TaskInfo, TASK_STATUS, TASK_DIFFICULTY, ASSIGNED_STATUS } from "@/types"

const SingleTask: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOneTaskById, acceptTask, cancelTask, isLoading } = useTask()
  const { toast } = useToast()
  const [task, setTask] = useState<TaskInfo | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        const response = await getOneTaskById(id)
        if (response.success && response.data) {
          setTask(response.data)
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch task details",
            variant: "destructive",
          })
        }
      }
    }

    fetchTask()
  }, [id, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPayment = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getDifficultyColor = (difficulty: TASK_DIFFICULTY) => {
    switch (difficulty) {
      case TASK_DIFFICULTY.EASY:
        return "bg-green-500 text-white"
      case TASK_DIFFICULTY.MEDIUM:
        return "bg-yellow-500 text-white"
      case TASK_DIFFICULTY.HARD:
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: TASK_STATUS) => {
    switch (status) {
      case TASK_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case TASK_STATUS.INPROGRESS:
        return "bg-blue-100 text-blue-800"
      case TASK_STATUS.COMPLETED:
        return "bg-green-100 text-green-800"
      case TASK_STATUS.CLANCELLED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAcceptTask = async () => {
    if (!id) return
    
    setIsAccepting(true)
    try {
      const response = await acceptTask(id)
      if (response.success) {
        toast({
          title: "Task Accepted",
          description: "You have successfully accepted this task.",
        })
        // Refresh task data to get updated status
        const updatedResponse = await getOneTaskById(id)
        if (updatedResponse.success && updatedResponse.data) {
          setTask(updatedResponse.data)
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to accept task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Accept task error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
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
        toast({
          title: "Task Cancelled",
          description: "You have successfully cancelled this task.",
        })
        // Refresh task data to get updated status
        const updatedResponse = await getOneTaskById(id)
        if (updatedResponse.success && updatedResponse.data) {
          setTask(updatedResponse.data)
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Cancel task error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDeclineTask = () => {
    toast({
      title: "Task Declined",
      description: "You have declined this task.",
    })
    navigate("/dashboard")
  }

  const isTaskAccepted = task?.assigned_status === ASSIGNED_STATUS.ASSIGNED || task?.status === TASK_STATUS.INPROGRESS

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading task details...</div>
        </div>
      </div>
    )
  }

  if (!task) {
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
            {/* Task Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{task.title}</CardTitle>
                    <p className="text-lg text-blue-600 font-medium">{task.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(task.status)}`}>{task.status}</Badge>
                    {task.difficulty && (
                      <Badge className={`${getDifficultyColor(task.difficulty)} font-semibold`}>
                        {task.difficulty.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{task.description}</p>
              </CardContent>
            </Card>

            {/* Key Notes */}
            {task.key_notes && task.key_notes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Key Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.key_notes.map((note: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Files Section */}
            {task.file_urls && task.file_urls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.file_urls.map((fileUrl, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          File {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{formatPayment(task.price)}</div>
                  <p className="text-gray-500">Fixed Price</p>
                </div>
              </CardContent>
            </Card>

            {/* Creator Information */}
            {task.created_by && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Task Creator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          `https://robohash.org/${task.created_by.first_name}?set=set4`
                        }
                        alt={`${task.created_by.first_name} ${task.created_by.last_name}`}
                      />
                      <AvatarFallback>
                        {task.created_by.first_name?.charAt(0)}
                        {task.created_by.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.created_by.first_name} {task.created_by.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{task.created_by.email}</p>
                    </div>
                  </div>

                  {task.created_by && (
                    <>
                      <Separator />
                      <div>
                        <p className="font-medium text-gray-700">Info</p>
                        <p className="text-sm text-black">{task.created_by.first_name} {task.created_by.last_name}</p>
                      </div>
                    </>
                  )}

                </CardContent>
              </Card>
            )}

            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-sm text-gray-600">{formatDate(task.deadline)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Posted</p>
                    <p className="text-sm text-gray-600">{formatDate(String(task.createdAt))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {task?.status === TASK_STATUS.PENDING && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {!isTaskAccepted ? (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" 
                          onClick={handleAcceptTask}
                          disabled={isAccepting || isLoading}
                        >
                          {isAccepting ? "Accepting..." : "Accept Task"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-lg py-6"
                          onClick={handleDeclineTask}
                        >
                          Decline Task
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-lg py-6"
                        onClick={handleCancelTask}
                        disabled={isCancelling || isLoading}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Task"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleTask
