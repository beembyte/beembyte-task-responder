
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, Loader2 } from "lucide-react"
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

  return (
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
                  src={`https://robohash.org/${task.created_by.first_name}?set=set4`}
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

          {/* Deadline Progress Bar */}
          <DeadlineProgressBar task={task} />
          {isTaskAccepted &&
            <Separator />
          }

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
                    className="w-full bg-green-600 hover:bg-green-700 h-10"
                    onClick={handleAcceptClick}
                    disabled={isAccepting || isLoading}
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "Accept Task"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-10"
                    onClick={handleDeclineClick}
                    disabled={isAccepting}
                  >
                    Decline Task
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-10"
                  onClick={handleCancelClick}
                  disabled={isCancelling || isLoading}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        <Card>
          <CardContent className="p-6">
            <Button
              variant="outline"
              className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-10"
              onClick={handleCancelClick}
              disabled={isCancelling || isLoading}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
