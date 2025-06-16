
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Loader2, MessageCircle } from "lucide-react"
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
      <Card className="border border-muted-foreground/10 bg-background rounded-none shadow-none">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              {formatPayment(task.price)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Fixed Price</p>
          </div>
        </CardContent>
      </Card>

      {/* Task Details */}
      <Card className="border border-muted-foreground/10 bg-background rounded-none shadow-none">
        <CardContent className="space-y-3 p-3 lg:p-4 pt-0">
          <div className="flex items-start gap-2">
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs">Deadline</p>
              <p className="text-xs text-muted-foreground truncate">{formatDate(task.deadline)}</p>
            </div>
          </div>

          <Separator />

          {task.status === TASK_STATUS.COMPLETED ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-emerald-600">Task Completed</p>
                <p className="text-xs font-medium text-emerald-600">100%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `100%` }}
                ></div>
              </div>
            </div>
          ) : (
            <DeadlineProgressBar task={task} />
          )}

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

      {/* Chat with Client Button */}
      {isTaskAccepted && task.status !== TASK_STATUS.COMPLETED && (
        <Card className="border border-muted-foreground/10 bg-background rounded-none shadow-none">
          <CardContent className="p-3 lg:p-4">
            <Button
              variant="outline"
              className="w-full h-8 lg:h-9 text-xs rounded-none"
              onClick={handleChatClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with Client
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {task?.status === TASK_STATUS.PENDING && (
        <Card className="border border-muted-foreground/10 bg-background rounded-none shadow-none">
          <CardContent className="p-3 lg:p-4">
            <div className="space-y-2">
              {!isTaskAccepted ? (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 lg:h-9 text-xs rounded-none"
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
                    className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs rounded-none"
                    onClick={handleDeclineClick}
                    disabled={isAccepting}
                  >
                    Decline Task
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs rounded-none"
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
        <Card className="border border-muted-foreground/10 bg-background rounded-none shadow-none">
          <CardContent className="p-3 lg:p-4">
            <Button
              variant="outline"
              className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive h-8 lg:h-9 text-xs rounded-none"
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
