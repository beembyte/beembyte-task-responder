
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskAttachmentsProps {
  fileUrls: string[]
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ fileUrls }) => {
  if (!fileUrls || fileUrls.length === 0) {
    return null
  }

  return (
    <Card className="rounded-none shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {fileUrls.map((fileUrl, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                File {index + 1}
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskAttachments
