
import React from "react"
import Navbar from "@/components/layout/Navbar"
import { Loader2 } from "lucide-react"

const TaskLoading: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xl text-muted-foreground">Loading task details...</span>
      </div>
    </div>
  </div>
)

export default TaskLoading
