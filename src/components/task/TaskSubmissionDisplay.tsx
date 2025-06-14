
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link as LinkIcon, FileText } from "lucide-react"

interface TaskSubmissionDisplayProps {
  description?: string
  link?: string
  files_urls?: string[]
}

const TaskSubmissionDisplay: React.FC<TaskSubmissionDisplayProps> = ({
  description,
  link,
  files_urls,
}) => {
  if (!description && !link && (!files_urls || files_urls.length === 0)) {
    return null
  }

  return (
    <Card className="mb-4 border-emerald-200 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-emerald-700 font-semibold">
          <FileText className="w-5 h-5 text-emerald-500" />
          Submitted Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-emerald-700 mb-1">Description</div>
            <div className="text-sm">{description}</div>
          </div>
        )}
        {link && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
              <LinkIcon className="w-4 h-4" /> Submission Link
            </div>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm break-words">
              {link}
            </a>
          </div>
        )}
        {files_urls && files_urls.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-emerald-700 mb-1">Files</div>
            <ul className="space-y-1">
              {files_urls.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs break-all">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskSubmissionDisplay
