
import React from "react";
import ResponderInfoCard from "./ResponderInfoCard";
import TaskDetailsCard from "./TaskDetailsCard";
import { Card } from "@/components/ui/card";
import { TaskInfo, User } from "@/types";

interface ChatSidebarProps {
  task: TaskInfo | null;
  responder: User | null; // kept for compatibility, but we will use task.created_by instead
  onChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ task, responder, onChat }) => {
  // Always show the created_by user (the client) in the sidebar
  // If task isn't present, show loading placeholder
  return (
    <aside className="w-full max-w-md min-w-[280px] flex flex-col bg-white h-full shadow-none divide-y">
      {task && task.created_by ? (
        <>
          <ResponderInfoCard responder={task.created_by} />
          <TaskDetailsCard task={task} />
        </>
      ) : (
        <Card className="p-5 border-none shadow-none">
          <div className="text-center text-muted-foreground text-sm">Loading information...</div>
        </Card>
      )}
    </aside>
  );
};

export default ChatSidebar;
