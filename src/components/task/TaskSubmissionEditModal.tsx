import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, FileText, X } from "lucide-react"
import { toast } from "sonner"
import useTask from "@/hooks/useTask"
import { useFileUpload } from "@/hooks/useFileUpload"

interface TaskSubmissionEditModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  currentData: {
    description: string
    link: string
    files_urls: string[]
  }
  onUpdate: (data: any) => void
}

const TaskSubmissionEditModal: React.FC<TaskSubmissionEditModalProps> = ({
  isOpen,
  onClose,
  taskId,
  currentData,
  onUpdate,
}) => {
  const [submissionText, setSubmissionText] = useState(currentData.description)
  const [submissionLink, setSubmissionLink] = useState(currentData.link)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingFiles, setExistingFiles] = useState<string[]>(currentData.files_urls)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { submitTask } = useTask()
  const { uploadFiles, isUploading } = useFileUpload()

  useEffect(() => {
    setSubmissionText(currentData.description)
    setSubmissionLink(currentData.link)
    setExistingFiles(currentData.files_urls)
  }, [currentData])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeNewFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingFile = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!submissionText.trim() && !submissionLink.trim() && selectedFiles.length === 0 && existingFiles.length === 0) {
      toast.error("Please provide at least one form of submission (text, link, or files)")
      return
    }

    setIsSubmitting(true)

    try {
      let newFilesUrls: string[] = []
      
      // Upload new files if any are selected
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadFiles(selectedFiles)
        if (uploadResult.success && uploadResult.urls) {
          newFilesUrls = uploadResult.urls
        } else {
          toast.error(uploadResult.error || "Failed to upload files")
          setIsSubmitting(false)
          return
        }
      }

      // Combine existing files with new files
      const allFilesUrls = [...existingFiles, ...newFilesUrls]

      const response = await submitTask({
        task_id: taskId,
        description: submissionText,
        link: submissionLink,
        files_urls: allFilesUrls,
      })
      
      if (response && response.success) {
        toast.success("Submission updated successfully!")
        onUpdate(response.data)
        onClose()
      }
    } catch (error) {
      toast.error("Failed to update submission. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || isUploading

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Submission</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Files
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="submission-text">Submission Description</Label>
              <Textarea
                id="submission-text"
                placeholder="Describe your completed work, provide details about the solution, or include any notes for the client..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            <div>
              <Label htmlFor="submission-link">Link to Your Work</Label>
              <Input
                id="submission-link"
                type="url"
                placeholder="https://example.com/your-work"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a link to your completed work (GitHub repo, live demo, Google Drive, etc.)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload Files</Label>
              
              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Current Files:</h4>
                  <div className="space-y-2">
                    {existingFiles.map((fileUrl, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate flex-1"
                        >
                          File {index + 1}
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExistingFile(index)}
                          disabled={isLoading}
                          className="ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <label htmlFor="file-upload" className={`cursor-pointer text-blue-600 hover:text-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Click to upload new files
                  </label>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC, ZIP up to 10MB each</p>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">New Files to Upload:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeNewFile(index)}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (isUploading ? "Uploading files..." : "Updating...") : "Update Submission"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskSubmissionEditModal
