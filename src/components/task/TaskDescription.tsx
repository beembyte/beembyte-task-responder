
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface TaskDescriptionProps {
  description: string
  children?: React.ReactNode
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, children }) => {
  return (
    <Card className="rounded-none shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-5 h-5" />
          Description
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground leading-relaxed text-xs whitespace-pre-wrap">{description}</p>
        {children}
      </CardContent>
    </Card>
  )
}

export default TaskDescription
