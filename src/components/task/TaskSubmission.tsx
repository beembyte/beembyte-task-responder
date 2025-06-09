
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Link, FileText, Send } from "lucide-react"
import { toast } from "sonner"

interface TaskSubmissionProps {
  taskId: string
  onSubmit?: () => void
}

const TaskSubmission: React.FC<TaskSubmissionProps> = ({ taskId, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submissionText, setSubmissionText] = useState("")
  const [submissionLink, setSubmissionLink] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    
    // Simulate submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Task submitted successfully!")
      setIsOpen(false)
      setSubmissionText("")
      setSubmissionLink("")
      setSelectedFiles([])
      
      if (onSubmit) {
        onSubmit()
      }
    } catch (error) {
      toast.error("Failed to submit task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Submit Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              Submit Task
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
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
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
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Work"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default TaskSubmission
