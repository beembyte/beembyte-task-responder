import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInputBox from "@/components/chat/ChatInputBox";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useTaskInfo } from "@/hooks/useTaskInfo";

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Moved logic out to custom hooks
  const {
    messages,
    user,
    newMessage,
    setNewMessage,
    sendMessage,
    onKeyPress,
  } = useChatMessages(id);

  const { task } = useTaskInfo(id);

  // Sidebar & recipient (keep as before)
  const [showSidebar, setShowSidebar] = useState(false);
  const recipient = {
    name: 'Client',
    avatar: 'https://robohash.org/client.png?set=set4',
    isOnline: false,
  };

  const handleAttachFile = (files: FileList) => {
    if (files.length > 0) {
      toast({
        title: "File attached",
        description: `${files[0].name} ready to send`,
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  const isDesktop = !isMobile;

  return (
    <div className="h-[100dvh] md:h-screen w-full bg-gray-100 flex justify-center items-stretch">
      <div className="flex flex-col md:flex-row bg-white w-full md:w-4/5 max-w-5xl h-full rounded-none md:rounded-xl shadow-lg overflow-hidden border">
        <div className={`
          flex-1 flex flex-col h-full relative transition-transform
          ${isMobile && showSidebar ? '-translate-x-full absolute inset-0 z-10 bg-white' : 'relative'}
        `}>
          <ChatHeader
            recipient={recipient}
            user={user}
            onBack={goBack}
            onSidebarOpen={isMobile ? openSidebar : undefined}
            isMobile={isMobile}
            taskId={id}
          />
          <ChatMessageList
            messages={messages}
            user={user}
            recipient={recipient}
          />
          <ChatInputBox
            value={newMessage}
            onChange={setNewMessage}
            onSend={sendMessage}
            onAttachFile={handleAttachFile}
            onKeyPress={onKeyPress}
          />
        </div>

        <div className={`
          hidden md:block h-full
          bg-white border-l
        `} style={{ minWidth: 320, maxWidth: 400 }}>
          <ChatSidebar
            task={task}
            client={task?.created_by || null}
            onChat={closeSidebar}
            isTaskAccepted={true}
          />
        </div>
        {isMobile && showSidebar && (
          <div className="fixed inset-0 z-20 bg-white flex flex-col h-full w-full animate-in slide-in-from-right-32 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="font-medium text-base">Task Info</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
                aria-label="Close Info"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatSidebar
                task={task}
                client={task?.created_by || null}
                onChat={closeSidebar}
                isTaskAccepted={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
