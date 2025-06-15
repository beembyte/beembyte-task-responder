import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Utility that formats "NGN" payments
const formatPayment = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(amount);

// Formats a date string as "D Mon · HH:MM"
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })} · ${formatTime(d)}`;
};
const formatTime = (date: Date) =>
  date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  });

// Utility function for grouped tasks by month/year for history style pages.
function groupTasksByMonthYear(tasks: any[]) {
  const result: Record<string, any[]> = {};
  tasks.forEach((task) => {
    const date = new Date(task.createdAt);
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    if (!result[monthYear]) {
      result[monthYear] = [];
    }
    result[monthYear].push(task);
  });
  return result;
}

// Difficulty badge color function (returns tailwind class)
function getDifficultyColor(difficulty: string = "") {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500 text-white";
    case "medium":
      return "bg-yellow-500 text-white";
    case "hard":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

interface HistoryStyleTaskListProps {
  tasks: any[];
  loading?: boolean;
  type: "completed" | "pending";
  onAcceptTask?: (taskId: string) => void;
  onDeclineTask?: (taskId: string) => void;
  header?: React.ReactNode;
}

// This component renders the Upwork-inspired history/grouped task list
const HistoryStyleTaskList: React.FC<HistoryStyleTaskListProps> = ({
  tasks,
  loading,
  type,
  onAcceptTask,
  onDeclineTask,
  header,
}) => {
  const navigate = useNavigate();
  // grouping applies for completed tasks, not strictly for pending
  const groupedTasks = type === "completed" ? groupTasksByMonthYear(tasks) : { "Active": tasks };
  // descending by month order (for completed)
  const sortedGroups = type === "completed"
    ? Object.keys(groupedTasks).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
      })
    : Object.keys(groupedTasks);

  return (
    <div className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
      {header}
      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : (
        <div className="space-y-8">
          {sortedGroups.length > 0 ? (
            sortedGroups.map((group) => (
              <div key={group} className="space-y-4">
                <h2 className="text-xl font-bold">{group}</h2>
                <div className="space-y-5">
                  {groupedTasks[group].map((task: any) => (
                    <div
                      key={task._id}
                      className="flex items-start space-x-4 border rounded-lg bg-background p-4 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${task.title}`}
                      onClick={() => navigate(`/task/${task._id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/task/${task._id}`);
                        }
                      }}
                    >
                      {/* ICON CHANGES: */}
                      <div
                        className={
                          type === "completed"
                            ? "rounded-md bg-green-100 p-2 flex items-center justify-center shrink-0"
                            : "rounded-md bg-yellow-100 p-2 flex items-center justify-center shrink-0"
                        }
                        aria-label={type === "completed" ? "Completed task" : "Pending task"}
                      >
                        {type === "completed" ? (
                          <CheckCircle size={24} className="text-green-600" aria-hidden="true" />
                        ) : (
                          <Clock size={24} className="text-yellow-600" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span>{formatDate(task.createdAt)}</span>
                          {type === "completed" && <span>· Completed</span>}
                          {type === "pending" && <span>· Pending</span>}
                          {task.difficulty && (
                            <Badge className={`capitalize ${getDifficultyColor(task.difficulty)}`}>{task.difficulty}</Badge>
                          )}
                        </div>
                        <div className="font-medium text-lg text-gray-900">{task.title}</div>
                        {task.subject && (
                          <div className="text-sm text-blue-600 mt-0.5 font-medium">{task.subject}</div>
                        )}
                        <div className="text-sm text-gray-700 mt-1">{task.description}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="font-semibold text-gray-900 text-sm">
                            {formatPayment(task.price || task.payment || 0)}
                          </div>
                          {task.deadline && (
                            <div className="text-xs text-gray-500">
                              Deadline: {new Date(task.deadline).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Actions on the far right */}
                      <div
                        className="flex flex-col items-end self-stretch justify-between ml-4 min-w-[54px]"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {type === "completed" ? (
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/task/${task._id}`)} aria-label="View details">
                            <RefreshCw size={18} className="text-gray-500" />
                          </Button>
                        ) : (
                          <>
                            {onDeclineTask && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mb-2"
                                onClick={() => onDeclineTask(task._id)}
                              >
                                Decline
                              </Button>
                            )}
                            {onAcceptTask && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => onAcceptTask(task._id)}
                              >
                                Accept
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryStyleTaskList;
