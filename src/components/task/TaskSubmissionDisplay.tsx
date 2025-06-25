
import React, { useState } from "react"
import { Link as LinkIcon, Github, Linkedin, Facebook, Youtube, Folder, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import SubmissionFileItem from "./SubmissionFileItem"
import TaskSubmissionEditModal from "./TaskSubmissionEditModal"

interface TaskSubmissionDisplayProps {
  description?: string
  link?: string
  files_urls?: string[]
  taskId?: string
  onUpdate?: (data: any) => void
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
  taskId,
  onUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const showDescription = description && description.toLowerCase() !== "here is the submission link."

  if (!showDescription && !link && (!files_urls || files_urls.length === 0)) return null

  const handleEditSubmission = () => {
    setIsEditModalOpen(true)
  }

  const handleUpdateSubmission = (updatedData: any) => {
    if (onUpdate) {
      onUpdate(updatedData)
    }
    setIsEditModalOpen(false)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800">Submission</h3>
        {taskId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditSubmission}
            className="text-gray-600 hover:text-gray-800"
          >
            <Pen className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showDescription && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      {link && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Link</h4>
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
          <h4 className="text-sm font-medium text-gray-800 mb-2">Files</h4>
          <div className="flex flex-wrap gap-2">
            {files_urls.map((url, i) => (
              <SubmissionFileItem key={i} url={url} />
            ))}
          </div>
        </div>
      )}

      {isEditModalOpen && taskId && (
        <TaskSubmissionEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          taskId={taskId}
          currentData={{
            description: description || "",
            link: link || "",
            files_urls: files_urls || [],
          }}
          onUpdate={handleUpdateSubmission}
        />
      )}
    </div>
  )
}

export default TaskSubmissionDisplay
