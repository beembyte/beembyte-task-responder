
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link as LinkIcon, FileText, Github, FileImage, FilePdf, FileText as FileTextIcon } from "lucide-react"
import ImageModal from "./ImageModal"
import SubmissionFileItem from "./SubmissionFileItem"

interface TaskSubmissionDisplayProps {
  description?: string
  link?: string
  files_urls?: string[]
}

const getLinkIcon = (url: string) => {
  try {
    const parsed = new URL(url)
    if (/github\.com/.test(parsed.hostname)) return <Github className="w-4 h-4" />
    return <LinkIcon className="w-4 h-4" />
  } catch {
    return <LinkIcon className="w-4 h-4" />
  }
}

const TaskSubmissionDisplay: React.FC<TaskSubmissionDisplayProps> = ({
  description,
  link,
  files_urls,
}) => {
  if (!description && !link && (!files_urls || files_urls.length === 0)) return null

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
              {getLinkIcon(link)} Submission Link
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 underline text-sm break-words"
            >
              {link}
            </a>
          </div>
        )}
        {files_urls && files_urls.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-emerald-700 mb-1">Files</div>
            <div className="flex flex-wrap gap-2">
              {files_urls.map((url, i) => (
                <SubmissionFileItem key={i} url={url} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskSubmissionDisplay
