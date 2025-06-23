
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Link, FileText, Send, X } from "lucide-react"
import { toast } from "sonner"
import useTask from "@/hooks/useTask"
import { useFileUpload } from "@/hooks/useFileUpload"

interface TaskSubmissionProps {
  taskId: string
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

const TaskSubmission: React.FC<TaskSubmissionProps> = ({ taskId, onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submissionText, setSubmissionText] = useState("")
  const [submissionLink, setSubmissionLink] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { submitTask } = useTask();
  const { uploadFiles, isUploading } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!submissionText.trim() && !submissionLink.trim() && selectedFiles.length === 0) {
      toast.error("Please provide at least one form of submission (text, link, or files)")
      return
    }

    setIsSubmitting(true)

    try {
      let filesUrls: string[] = []
      
      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadFiles(selectedFiles)
        if (uploadResult.success && uploadResult.urls) {
          filesUrls = uploadResult.urls
        } else {
          toast.error(uploadResult.error || "Failed to upload files")
          setIsSubmitting(false)
          return
        }
      }

      const response = await submitTask({
        task_id: taskId,
        description: submissionText,
        link: submissionLink,
        files_urls: filesUrls,
      })
      
      if (response && response.success) {
        setIsOpen(false)
        setSubmissionText("")
        setSubmissionLink("")
        setSelectedFiles([])

        if (onSubmit) {
          onSubmit(response.data)
        }
      }
    } catch (error) {
      toast.error("Failed to submit task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || isUploading

  return (
    <Card className="border-0 shadow-sm bg-gray-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800">Submit Work</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Your Work</DialogTitle>
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
                          Click to upload files
                        </label>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC, ZIP up to 10MB each</p>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm truncate">{file.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={isLoading}
                              >
                                Remove
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
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (isUploading ? "Uploading files..." : "Submitting...") : "Submit Work"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {onCancel && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCancel}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskSubmission
