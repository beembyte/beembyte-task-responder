
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface TaskKeyNotesProps {
  keyNotes: string[]
}

const TaskKeyNotes: React.FC<TaskKeyNotesProps> = ({ keyNotes }) => {
  if (!keyNotes || keyNotes.length === 0) {
    return null
  }

  return (
    <Card className="rounded-none shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5" />
          Key Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {keyNotes.map((note: string, index: number) => (
            <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
              {note}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskKeyNotes
