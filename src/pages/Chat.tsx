
"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatHeader from "@/components/chat/ChatHeader"
import ChatMessageList from "@/components/chat/ChatMessageList"
import ChatInputBox from "@/components/chat/ChatInputBox"
import { useChatMessages } from "@/hooks/useChatMessages"
import { useTaskInfo } from "@/hooks/useTaskInfo"
import FileUploadPreview from "@/components/chat/FileUploadPreview"
import { TASK_STATUS, USER_FINAL_DECISION } from "@/types"

const getDicebearUrl = (firstName: string) => {
  const seed = firstName ? firstName.trim() : "client";
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
};

const Chat = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const {
    messages,
    user,
    newMessage,
    setNewMessage,
    sendMessage,
    onKeyPress,
    filesToSend,
    addFiles,
    removeFile,
    isLoadingMessages,
    deleteMessage,
    refreshMessages,
    isPolling,
    isSending,
  } = useChatMessages(id)

  const { task } = useTaskInfo(id)

  const [showSidebar, setShowSidebar] = useState(false)

  // Show recipient as the client
  const recipient = {
    name: task?.created_by?.first_name || "Client",
    avatar: getDicebearUrl(task?.created_by?.first_name || "client"),
    isOnline: false,
  }

  // Check if chat should be disabled - only disable if task is completed AND approved/disputed
  const isChatDisabled = task?.status === TASK_STATUS.COMPLETED && 
    (task?.user_final_decision === USER_FINAL_DECISION.APPROVED || 
     task?.user_final_decision === USER_FINAL_DECISION.DISPUTED)

  const handleAttachFile = (newFiles: FileList) => {
    if (newFiles.length > 0) {
      addFiles(Array.from(newFiles))
    }
  }

  const goBack = () => navigate(-1)
  const openSidebar = () => setShowSidebar(true)
  const closeSidebar = () => setShowSidebar(false)

  return (
    <div className="h-[100dvh] md:h-screen w-full bg-gray-100 flex">
      <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
        <div
          className={`
          flex-1 flex flex-col h-full
          ${isMobile && showSidebar ? "hidden" : "relative"}
        `}
        >
          <ChatHeader
            onBack={goBack}
            onSidebarOpen={isMobile ? openSidebar : undefined}
            isMobile={isMobile}
            taskTitle={task?.title}
            onRefresh={refreshMessages}
            isPolling={isPolling}
          />
          <ChatMessageList
            messages={messages}
            user={user}
            recipient={recipient}
            task={task}
            isLoading={isLoadingMessages}
            onDeleteMessage={deleteMessage}
          />
          <div className="border-t bg-white">
            {!isChatDisabled && (
              <>
                <FileUploadPreview files={filesToSend} onRemoveFile={removeFile} />
                <ChatInputBox
                  value={newMessage}
                  onChange={setNewMessage}
                  onSend={sendMessage}
                  onAttachFile={handleAttachFile}
                  onKeyPress={onKeyPress}
                  recipientName={recipient.name}
                  disabled={isSending}
                />
              </>
            )}
            {isChatDisabled && (
              <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 border-t">
                Chat is no longer available - Task has been completed and {task?.user_final_decision === USER_FINAL_DECISION.APPROVED ? 'approved' : 'disputed'}.
              </div>
            )}
          </div>
        </div>

        <div
          className={`
          hidden md:block h-full overflow-y-auto
          bg-white border-l
        `}
          style={{ minWidth: 320, maxWidth: 360 }}
        >
          <ChatSidebar task={task} responder={task?.created_by || null} onChat={closeSidebar} />
        </div>
        {isMobile && showSidebar && (
          <div className="fixed inset-0 z-20 bg-white flex flex-col h-full w-full animate-in slide-in-from-right-32 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <div className="font-medium text-base">Details</div>
              <Button variant="ghost" size="icon" onClick={closeSidebar} aria-label="Close Info">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatSidebar task={task} responder={task?.created_by || null} onChat={closeSidebar} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
