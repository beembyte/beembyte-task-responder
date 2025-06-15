
import React from "react";
import ClientInfoCard from "@/components/task/ClientInfoCard";
import JobStatsRow from "@/components/task/JobStatsRow";
import { Card } from "@/components/ui/card";
import { TaskInfo, User } from "@/types";

interface ChatSidebarProps {
  task: TaskInfo | null;
  client: User | null;
  onChat: () => void;
  isTaskAccepted: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ task, client, onChat, isTaskAccepted }) => {
  return (
    <aside className="w-full max-w-md min-w-[280px] flex flex-col gap-6 p-4 md:border-l bg-white h-full shadow-none">
      {task && (
        <>
          <JobStatsRow task={task} />
          <ClientInfoCard task={task} isTaskAccepted={isTaskAccepted} onChat={onChat} />
          {/* You can add more info below if desired */}
        </>
      )}
      {!task && (
        <Card className="p-5">
          <div className="text-center text-muted-foreground text-sm">No task information available.</div>
        </Card>
      )}
    </aside>
  );
};

export default ChatSidebar;
