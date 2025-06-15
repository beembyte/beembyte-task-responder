
```tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Settings } from "lucide-react";

interface ChatHeaderProps {
  onBack: () => void;
  onSidebarOpen?: () => void;
  isMobile?: boolean;
  taskTitle?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  onSidebarOpen,
  isMobile,
  taskTitle,
}) => (
  <div className="flex items-center px-4 py-3 border-b bg-white relative z-20">
    <Button
      variant="ghost"
      size="icon"
      onClick={onBack}
      className="mr-2"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <div className="flex items-center font-semibold text-gray-800 text-base">
        <span className="text-gray-400 mr-2">#</span>
        {taskTitle || "Task Chat"}
    </div>
    <div className="flex-1" />
    
    {isMobile ? (
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarOpen}
        className="ml-2"
        aria-label="Show Task Info"
      >
        <Users className="h-5 w-5 text-gray-600" />
      </Button>
    ) : (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Participants"
        >
          <Users className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    )}
  </div>
);

export default ChatHeader;
```
