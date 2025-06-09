
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, Loader2, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { type TaskInfo, TASK_STATUS, ASSIGNED_STATUS } from "@/types"
import DeadlineProgressBar from "../ui/deadline-progress"

interface TaskSidebarProps {
  task: TaskInfo
  isTaskAccepted: boolean
  isAccepting: boolean
  isCancelling: boolean
  isLoading: boolean
  onAcceptTask: () => void
  onCancelTask: () => void
  onDeclineTask: () => void
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  task,
  isTaskAccepted,
  isAccepting,
  isCancelling,
  isLoading,
  onAcceptTask,
  onCancelTask,
  onDeclineTask,
}) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
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

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAcceptTask();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancelTask();
  };

  const handleDeclineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeclineTask();
  };

  const handleChatClick = () => {
    navigate(`/chat/${task._id}`)
  }

  return (
    <div className="space-y-4">
      {/* Price Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-700 mb-1">{formatPayment(task.price)}</div>
            <p className="text-sm text-emerald-600">Fixed Price</p>
          </div>
        </CardContent>
      </Card>

      {/* Creator Information */}
      {task.created_by && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              Task Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://robohash.org/${task.created_by.first_name}?set=set4`}
                  alt={`${task.created_by.first_name} ${task.created_by.last_name}`}
                />
                <AvatarFallback className="text-xs">
                  {task.created_by.first_name?.charAt(0)}
                  {task.created_by.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">
                  {task.created_by.first_name} {task.created_by.last_name}
                </p>
                <p className="text-xs text-gray-600">{task.created_by.email}</p>
              </div>
            </div>

            {isTaskAccepted && (
              <>
                <Separator />
                <Button
                  onClick={handleChatClick}
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700 h-8 text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chat with Client
                </Button>
              </>
            )}

            {task.created_by && (
              <>
                <Separator />
                <div>
                  <p className="font-medium text-gray-700 text-xs">Info</p>
                  <p className="text-xs text-black">{task.created_by.first_name} {task.created_by.last_name}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-xs">Deadline</p>
              <p className="text-xs text-gray-600">{formatDate(task.deadline)}</p>
            </div>
          </div>

          <Separator />

          <DeadlineProgressBar task={task} />
          {isTaskAccepted && <Separator />}

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-xs">Posted</p>
              <p className="text-xs text-gray-600">{formatDate(String(task.createdAt))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {task?.status === TASK_STATUS.PENDING && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              {!isTaskAccepted ? (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-xs"
                    onClick={handleAcceptClick}
                    disabled={isAccepting || isLoading}
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "Accept Task"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-8 text-xs"
                    onClick={handleDeclineClick}
                    disabled={isAccepting}
                  >
                    Decline Task
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-8 text-xs"
                  onClick={handleCancelClick}
                  disabled={isCancelling || isLoading}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Task"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Button for Ongoing Tasks */}
      {task?.status === TASK_STATUS.INPROGRESS && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Button
              variant="outline"
              className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-8 text-xs"
              onClick={handleCancelClick}
              disabled={isCancelling || isLoading}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Task"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TaskSidebar
