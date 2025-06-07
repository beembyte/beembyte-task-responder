
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface TaskDescriptionProps {
  description: string
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
      </CardContent>
    </Card>
  )
}

export default TaskDescription
