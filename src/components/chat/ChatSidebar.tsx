
import React from "react";
import ResponderInfoCard from "./ResponderInfoCard";
import TaskDetailsCard from "./TaskDetailsCard";
import { Card } from "@/components/ui/card";
import { TaskInfo, User } from "@/types";

interface ChatSidebarProps {
  task: TaskInfo | null;
  responder: User | null;
  onChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ task, responder }) => {
  return (
    <aside className="w-full max-w-md min-w-[280px] flex flex-col bg-white h-full shadow-none divide-y">
      {task && responder ? (
        <>
          <ResponderInfoCard responder={responder} />
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
