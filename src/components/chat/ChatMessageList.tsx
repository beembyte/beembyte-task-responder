
import React, { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { User, TaskInfo } from "@/types"
import SubmissionFileItem from "@/components/task/SubmissionFileItem"

export interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isRead: boolean
  file_urls?: string[]
}

interface ChatMessageListProps {
  messages: Message[]
  user?: User | null
  recipient: { name: string; avatar: string; isOnline: boolean }
  task: TaskInfo | null
  isLoading?: boolean
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  user,
  recipient,
  task,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <MessageSquare className="w-10 h-10 text-gray-500" />
          </div>
          <div className="text-xl font-semibold text-gray-800 mb-1">Start the conversation</div>
          <div className="text-sm text-gray-500 max-w-sm">
            This is the beginning of your conversation about{" "}
            <span className="font-semibold text-gray-700">"{task?.title || "the task"}"</span>. Send
            your first message to get started!
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.sender === "responder" ? "justify-end" : "justify-start"}`}
          >
            {message.sender !== "responder" && (
              <Avatar className="h-7 w-7 mt-1 mr-2 flex-shrink-0">
                <AvatarImage src={recipient.avatar} alt={recipient.name} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80vw] md:max-w-md px-4 py-2 rounded-xl break-words ${
                message.sender === "responder"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {message.text && <div className="text-sm">{message.text}</div>}
              {message.file_urls && message.file_urls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.file_urls.map((url, i) => (
                    <SubmissionFileItem key={i} url={url} />
                  ))}
                </div>
              )}
              <div
                className={`text-xs mt-1 ${
                  message.sender === "responder" ? "text-primary-foreground/80" : "text-gray-500"
                }`}
              >
                {format(new Date(message.timestamp), "h:mm a")}
              </div>
            </div>
            {message.sender === "responder" && (
              <Avatar className="h-7 w-7 mt-1 ml-2 flex-shrink-0">
                <AvatarImage
                  src={`https://robohash.org/${user?.first_name || "responder"}.png?set=set4`}
                  alt={user?.first_name || "You"}
                />
                <AvatarFallback>{(user?.first_name || "Y").charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessageList
