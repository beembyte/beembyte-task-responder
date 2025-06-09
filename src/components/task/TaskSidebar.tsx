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
    <div className="space-y-3">
      {/* Price Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-xl lg:text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              {formatPayment(task.price)}
            </div>
            <p className="text-xs lg:text-sm text-emerald-600 dark:text-emerald-400">Fixed Price</p>
          </div>
        </CardContent>
      </Card>

      {/* Creator Information */}
      {task.created_by && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 p-3 lg:p-4">
            <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
              <User className="w-3 h-3 lg:w-4 lg:h-4" />
              Task Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 lg:p-4 pt-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                <AvatarImage
                  src={`https://robohash.org/${task.created_by.first_name}?set=set4`}
                  alt={`${task.created_by.first_name} ${task.created_by.last_name}`}
                />
                <AvatarFallback className="text-xs">
                  {task.created_by.first_name?.charAt(0)}
                  {task.created_by.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs lg:text-sm text-foreground truncate">
                  {task.created_by.first_name} {task.created_by.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{task.created_by.email}</p>
              </div>
            </div>

            {isTaskAccepted && (
              <>
                <Separator />
                <Button
                  onClick={handleChatClick}
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700 h-7 lg:h-8 text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chat with Client
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 p-3 lg:p-4">
          <CardTitle className="text-sm lg:text-base">Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 lg:p-4 pt-0">
          <div className="flex items-start gap-2">
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs">Deadline</p>
              <p className="text-xs text-muted-foreground truncate">{formatDate(task.deadline)}</p>
            </div>
          </div>

          <Separator />

          <DeadlineProgressBar task={task} />
          
          <Separator />

          <div className="flex items-start gap-2">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs">Posted</p>
              <p className="text-xs text-muted-foreground truncate">{formatDate(String(task.createdAt))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {task?.status === TASK_STATUS.PENDING && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 lg:p-4">
            <div className="space-y-2">
              {!isTaskAccepted ? (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 lg:h-9 text-xs"
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
                    className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs"
                    onClick={handleDeclineClick}
                    disabled={isAccepting}
                  >
                    Decline Task
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs"
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
          <CardContent className="p-3 lg:p-4">
            <Button
              variant="outline"
              className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs"
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
