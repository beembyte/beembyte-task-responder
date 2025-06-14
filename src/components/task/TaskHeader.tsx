
import React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type TaskInfo, TASK_STATUS, TASK_DIFFICULTY } from "@/types"

interface TaskHeaderProps {
  task: TaskInfo
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
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

  return (
    <Card className="rounded-none shadow-none">
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
  )
}

export default TaskHeader
