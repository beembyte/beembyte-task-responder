
import React from "react"
import { Clock, Loader2, User } from "lucide-react"
import { type TaskInfo } from "@/types"

interface JobStatsRowProps {
  task: TaskInfo | null
}

const JobStatsRow: React.FC<JobStatsRowProps> = ({ task }) => (
  <div className="flex flex-wrap items-center justify-between border-t border-b border-muted-foreground/20 py-4 px-4 bg-background">
    <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2 border-r border-muted-foreground/10 last:border-none">
      <Clock className="w-5 h-5 text-muted-foreground" />
      <div>
        <div className="text-xs font-semibold text-foreground">Deadline</div>
        <div className="text-sm text-muted-foreground">
          {task?.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
        </div>
      </div>
    </div>
    <div className="flex items-center flex-1 min-w-[130px] justify-center gap-2 border-r border-muted-foreground/10 last:border-none">
      <User className="w-5 h-5 text-muted-foreground" />
      <div>
        <div className="text-xs font-semibold text-foreground">Client</div>
        <div className="text-sm text-muted-foreground truncate">
          {task?.created_by?.first_name} {task?.created_by?.last_name}
        </div>
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
      <span className="text-emerald-600 font-semibold">
        ₦{task?.price?.toLocaleString("en-NG")}
      </span>
      <span className="text-xs text-muted-foreground">Fixed</span>
    </div>
  </div>
)

export default JobStatsRow
