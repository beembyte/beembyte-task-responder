
import React from "react"
import { Link as LinkIcon, Github, Linkedin, Facebook, Youtube, Folder } from "lucide-react"
import SubmissionFileItem from "./SubmissionFileItem"

interface TaskSubmissionDisplayProps {
  description?: string
  link?: string
  files_urls?: string[]
}

const getLinkIcon = (url: string) => {
  try {
    const parsed = new URL(url)
    const { hostname } = parsed

    if (/github\.com/.test(hostname)) return <Github className="w-5 h-5 text-gray-900" />
    if (/linkedin\.com/.test(hostname)) return <Linkedin className="w-5 h-5 text-blue-700" />
    if (/facebook\.com/.test(hostname)) return <Facebook className="w-5 h-5 text-blue-800" />
    if (/youtube\.com|youtu\.be/.test(hostname)) return <Youtube className="w-5 h-5 text-red-600" />
    if (/drive\.google\.com/.test(hostname)) return <Folder className="w-5 h-5 text-yellow-500" />

    return <LinkIcon className="w-5 h-5 text-gray-700" />
  } catch {
    return <LinkIcon className="w-5 h-5 text-gray-700" />
  }
}

const TaskSubmissionDisplay: React.FC<TaskSubmissionDisplayProps> = ({
  description,
  link,
  files_urls,
}) => {
  const showDescription = description && description.toLowerCase() !== "here is the submission link."

  if (!showDescription && !link && (!files_urls || files_urls.length === 0)) return null

  return (
    <div className="mt-6">
      {showDescription && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Submission Description</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      {link && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Submission Link</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-3">
            {getLinkIcon(link)}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {link}
            </a>
          </div>
        </div>
      )}
      {files_urls && files_urls.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Submitted Files</h3>
          <div className="flex flex-wrap gap-2">
            {files_urls.map((url, i) => (
              <SubmissionFileItem key={i} url={url} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskSubmissionDisplay
