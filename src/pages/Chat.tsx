
import React, { useState } from 'react';
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

  const {
    messages,
    user,
    newMessage,
    setNewMessage,
    sendMessage,
    onKeyPress,
  } = useChatMessages(id);

  const { task } = useTaskInfo(id);

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

  const goBack = () => navigate(-1);
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <div className="h-[100dvh] md:h-screen w-full bg-gray-100 flex justify-center items-stretch p-0 md:p-4">
      <div className="flex flex-col md:flex-row bg-white w-full md:max-w-7xl h-full rounded-none md:rounded-xl shadow-lg overflow-hidden border">
        <div className={`
          flex-1 flex flex-col h-full
          ${isMobile && showSidebar ? 'hidden' : 'relative'}
        `}>
          <ChatHeader
            onBack={goBack}
            onSidebarOpen={isMobile ? openSidebar : undefined}
            isMobile={isMobile}
            taskTitle={task?.title}
          />
          <ChatMessageList
            messages={messages}
            user={user}
            recipient={recipient}
            task={task}
          />
          <ChatInputBox
            value={newMessage}
            onChange={setNewMessage}
            onSend={sendMessage}
            onAttachFile={handleAttachFile}
            onKeyPress={onKeyPress}
            recipientName={recipient.name}
          />
        </div>

        <div className={`
          hidden md:block h-full overflow-y-auto
          bg-white border-l
        `} style={{ minWidth: 320, maxWidth: 360 }}>
          <ChatSidebar
            task={task}
            responder={user}
            onChat={closeSidebar}
          />
        </div>
        {isMobile && showSidebar && (
          <div className="fixed inset-0 z-20 bg-white flex flex-col h-full w-full animate-in slide-in-from-right-32 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="font-medium text-base">Details</div>
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
                responder={user}
                onChat={closeSidebar}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
