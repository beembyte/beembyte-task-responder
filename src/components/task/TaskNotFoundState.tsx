
import React from "react"
import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const TaskNotFoundState: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The task you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  )
}

export default TaskNotFoundState
