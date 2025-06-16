"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, RefreshCw } from "lucide-react"

interface ChatHeaderProps {
  onBack: () => void
  onSidebarOpen?: () => void
  isMobile: boolean
  taskTitle?: string
  onRefresh?: () => void
  isPolling?: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  onSidebarOpen,
  isMobile,
  taskTitle,
  onRefresh,
  isPolling,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-semibold text-gray-900 truncate max-w-[200px] md:max-w-none">{taskTitle || "Chat"}</h1>
          <p className="text-xs text-gray-500">{isPolling ? "Auto-refreshing..." : "Chat"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            aria-label="Refresh Messages"
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
          </Button>
        )}

        {isMobile && onSidebarOpen && (
          <Button variant="ghost" size="icon" onClick={onSidebarOpen} aria-label="Open Info">
            <Info className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ChatHeader
