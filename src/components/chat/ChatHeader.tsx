
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { User } from "@/types";

interface ChatHeaderProps {
  recipient: { name: string; avatar: string; isOnline: boolean };
  user?: User | null;
  onBack: () => void;
  onSidebarOpen?: () => void;
  isMobile?: boolean;
  taskId?: string | undefined;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipient,
  user,
  onBack,
  onSidebarOpen,
  isMobile,
  taskId,
}) => (
  <div className="flex items-center px-4 py-2 border-b bg-gray-50 relative z-20">
    <Button
      variant="ghost"
      size="icon"
      onClick={onBack}
      className="mr-2"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <Avatar className="h-10 w-10">
      <AvatarImage src={recipient.avatar} alt={recipient.name} />
      <AvatarFallback>
        {recipient.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
    <div className="ml-3 flex-1 min-w-0">
      <div className="font-medium text-sm sm:text-base truncate">{recipient.name}</div>
      <div className="text-xs text-gray-500 flex items-center">
        <span className={`w-2 h-2 rounded-full mr-1 ${recipient.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        {recipient.isOnline ? 'Online' : 'Offline'}
      </div>
    </div>
    <div className="text-xs text-gray-500 text-right whitespace-nowrap pl-2">
      Task #{taskId}
    </div>
    {/* More/Sidebar Toggle Icon (mobile only) */}
    {isMobile && onSidebarOpen && (
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarOpen}
        className="ml-2"
        aria-label="Show Task Info"
      >
        <MoreHorizontal className="h-5 w-5 text-gray-600" />
      </Button>
    )}
  </div>
);

export default ChatHeader;
