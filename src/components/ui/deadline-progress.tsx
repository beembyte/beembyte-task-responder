"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import { type TaskInfo, ASSIGNED_STATUS, TASK_STATUS } from "@/types"

interface DeadlineProgressBarProps {
    task: TaskInfo
}

const DeadlineProgressBar: React.FC<DeadlineProgressBarProps> = ({ task }) => {
    // Don't show progress bar if task isn't accepted/assigned
    if (task.assigned_status !== ASSIGNED_STATUS.ASSIGNED && task.status !== TASK_STATUS.INPROGRESS) {
        return null
    }

    const calculateProgress = () => {
        const now = new Date()
        const deadline = new Date(task.deadline)
        const startDate = new Date(task.updatedAt) // Assuming updatedAt reflects when task was accepted

        // If we don't have a proper start date, use creation date
        const acceptedDate = startDate > new Date(task.createdAt) ? startDate : new Date(task.createdAt)

        const totalDuration = deadline.getTime() - acceptedDate.getTime()
        const elapsed = now.getTime() - acceptedDate.getTime()

        if (totalDuration <= 0) return 100 // Invalid dates

        const progress = (elapsed / totalDuration) * 100
        return Math.max(0, progress) // Don't allow negative progress
    }

    const getProgressGradient = (progress: number) => {
        if (progress <= 25) {
            return "from-green-400 to-green-500"
        } else if (progress <= 50) {
            return "from-green-400 to-lime-400"
        } else if (progress <= 75) {
            return "from-lime-400 to-yellow-400"
        } else if (progress <= 100) {
            return "from-yellow-400 to-orange-500"
        } else {
            return "from-orange-500 to-red-500"
        }
    }

    const getTimeStatus = () => {
        const deadline = new Date(task.deadline)
        const now = new Date()
        const timeRemaining = deadline.getTime() - now.getTime()

        // Convert to different time units
        const totalMinutes = Math.abs(timeRemaining) / (1000 * 60)
        const totalHours = totalMinutes / 60
        const totalDays = totalHours / 24

        if (timeRemaining <= 0) {
            // Overdue scenarios
            if (totalDays >= 7) {
                return {
                    message: "Deadline exceeded by weeks",
                    timeText: `${Math.floor(totalDays / 7)} week${Math.floor(totalDays / 7) > 1 ? "s" : ""} overdue`,
                    severity: "critical",
                    icon: AlertTriangle,
                }
            } else if (totalDays >= 1) {
                return {
                    message: "Deadline exceeded",
                    timeText: `${Math.floor(totalDays)} day${Math.floor(totalDays) > 1 ? "s" : ""} overdue`,
                    severity: "critical",
                    icon: AlertTriangle,
                }
            } else if (totalHours >= 1) {
                return {
                    message: "Deadline exceeded",
                    timeText: `${Math.floor(totalHours)} hour${Math.floor(totalHours) > 1 ? "s" : ""} overdue`,
                    severity: "critical",
                    icon: AlertTriangle,
                }
            } else {
                return {
                    message: "Deadline just exceeded",
                    timeText: `${Math.floor(totalMinutes)} minute${Math.floor(totalMinutes) > 1 ? "s" : ""} overdue`,
                    severity: "critical",
                    icon: AlertTriangle,
                }
            }
        } else {
            // Time remaining scenarios
            if (totalDays >= 7) {
                return {
                    message: "Plenty of time remaining",
                    timeText: `${Math.floor(totalDays / 7)} week${Math.floor(totalDays / 7) > 1 ? "s" : ""} remaining`,
                    severity: "good",
                    icon: CheckCircle,
                }
            } else if (totalDays >= 3) {
                return {
                    message: "Good time buffer",
                    timeText: `${Math.floor(totalDays)} day${Math.floor(totalDays) > 1 ? "s" : ""} remaining`,
                    severity: "good",
                    icon: CheckCircle,
                }
            } else if (totalDays >= 1) {
                return {
                    message: "Deadline approaching",
                    timeText: `${Math.floor(totalDays)} day${Math.floor(totalDays) > 1 ? "s" : ""} remaining`,
                    severity: "warning",
                    icon: Clock,
                }
            } else if (totalHours >= 6) {
                return {
                    message: "Deadline approaching soon",
                    timeText: `${Math.floor(totalHours)} hour${Math.floor(totalHours) > 1 ? "s" : ""} remaining`,
                    severity: "warning",
                    icon: Clock,
                }
            } else if (totalHours >= 1) {
                return {
                    message: "Deadline approaching fast",
                    timeText: `${Math.floor(totalHours)} hour${Math.floor(totalHours) > 1 ? "s" : ""} remaining`,
                    severity: "urgent",
                    icon: Zap,
                }
            } else {
                return {
                    message: "Deadline imminent!",
                    timeText: `${Math.floor(totalMinutes)} minute${Math.floor(totalMinutes) > 1 ? "s" : ""} remaining`,
                    severity: "urgent",
                    icon: Zap,
                }
            }
        }
    }

    const getStatusStyles = (severity: string) => {
        switch (severity) {
            case "good":
                return {
                    bgColor: "bg-green-100",
                    borderColor: "border-green-200",
                    textColor: "text-green-800",
                    iconColor: "text-green-600",
                }
            case "warning":
                return {
                    bgColor: "bg-orange-100",
                    borderColor: "border-orange-200",
                    textColor: "text-orange-800",
                    iconColor: "text-orange-600",
                }
            case "urgent":
                return {
                    bgColor: "bg-red-100",
                    borderColor: "border-red-200",
                    textColor: "text-red-800",
                    iconColor: "text-red-600",
                }
            case "critical":
                return {
                    bgColor: "bg-red-200",
                    borderColor: "border-red-300",
                    textColor: "text-red-900",
                    iconColor: "text-red-700",
                }
            default:
                return {
                    bgColor: "bg-gray-100",
                    borderColor: "border-gray-200",
                    textColor: "text-gray-800",
                    iconColor: "text-gray-600",
                }
        }
    }

    const progress = calculateProgress()
    const isOverdue = progress > 100
    const displayProgress = Math.min(progress, 100)
    const timeStatus = getTimeStatus()
    const statusStyles = getStatusStyles(timeStatus.severity)
    const IconComponent = timeStatus.icon

    return (
        <Card className={`${isOverdue ? "border-red-200 bg-red-50" : ""}`}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {isOverdue ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Clock className="w-5 h-5 text-blue-500" />}
                    Deadline Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getProgressGradient(progress)} transition-all duration-500 ease-out relative`}
                            style={{ width: `${displayProgress}%` }}
                        >
                            {/* Animated shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                    </div>

                    {/* Overdue indicator */}
                    {isOverdue && <div className="w-full bg-red-500 rounded-full h-1 animate-pulse"></div>}
                </div>

                {/* Time Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 mb-1">Time Status</p>
                        <p
                            className={`text-xs font-medium ${timeStatus.severity === "critical" || timeStatus.severity === "urgent" ? "text-red-600" : "text-gray-900"}`}
                        >
                            {timeStatus.timeText}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Deadline</p>
                        <p className="font-medium text-xs text-gray-900">
                            {new Date(task.deadline).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                {/* Dynamic Status Messages */}
                <div className={`${statusStyles.bgColor} border ${statusStyles.borderColor} rounded-md p-3`}>
                    <p className={`${statusStyles.textColor} text-sm font-medium flex items-center gap-2`}>
                        <IconComponent className={`w-4 h-4 ${statusStyles.iconColor}`} />
                        {timeStatus.message}
                    </p>
                </div>

                {/* Additional urgent warnings */}
                {timeStatus.severity === "urgent" && (
                    <div className="bg-yellow-100 border border-yellow-200 rounded-md p-3">
                        <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-600 animate-pulse" />
                            Time is running out! Consider prioritizing this task.
                        </p>
                    </div>
                )}

                {timeStatus.severity === "critical" && (
                    <div className="bg-red-200 border border-red-300 rounded-md p-3">
                        <p className="text-red-900 text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-700 animate-bounce" />
                            Task is overdue! Immediate attention required.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default DeadlineProgressBar
