
import React, { useState } from "react"
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
  } = useChatMessages(id)

  const { task } = useTaskInfo(id)

  const [showSidebar, setShowSidebar] = useState(false)

  const recipient = {
    name: task?.created_by?.first_name || "Client",
    avatar: "https://robohash.org/client.png?set=set4",
    isOnline: false,
  }

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
          />
          <ChatMessageList
            messages={messages}
            user={user}
            recipient={recipient}
            task={task}
            isLoading={isLoadingMessages}
          />
          <div className="border-t bg-white">
            <FileUploadPreview files={filesToSend} onRemoveFile={removeFile} />
            <ChatInputBox
              value={newMessage}
              onChange={setNewMessage}
              onSend={sendMessage}
              onAttachFile={handleAttachFile}
              onKeyPress={onKeyPress}
              recipientName={recipient.name}
            />
          </div>
        </div>

        <div
          className={`
          hidden md:block h-full overflow-y-auto
          bg-white border-l
        `}
          style={{ minWidth: 320, maxWidth: 360 }}
        >
          <ChatSidebar task={task} responder={user} onChat={closeSidebar} />
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
              <ChatSidebar task={task} responder={user} onChat={closeSidebar} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
