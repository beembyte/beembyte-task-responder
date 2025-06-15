
import { useEffect, useState, useCallback } from "react"
import { socket } from "@/services/socket"
import { useAuth } from "@/hooks/useAuth"
import { Message } from "@/components/chat/ChatMessageList"
import { User } from "@/types"
import { chatApi } from "@/services/chatApi"
import { toast } from "sonner"

export function useChatMessages(chatId: string | undefined) {
  const { loggedInUser } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [filesToSend, setFilesToSend] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await loggedInUser()
      setUser(userData)
    }
    fetchUser()
  }, [loggedInUser])

  // Fetch messages from API
  useEffect(() => {
    if (!chatId) {
      setIsLoadingMessages(false)
      return
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true)
      const response = await chatApi.getMessages(chatId)
      if (response.success && Array.isArray(response.data)) {
        const transformedMessages: Message[] = response.data
          .map((msg: any) => ({
            id: msg._id,
            text: msg.message,
            sender: msg.sender_type === "responder" ? "responder" : "client",
            timestamp: new Date(msg.createdAt),
            isRead: true, // assume fetched messages are read
            file_urls: msg.file_urls,
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // sort by date
        setMessages(transformedMessages)
      } else {
        toast.error(response.message || "Could not load chat history.")
      }
      setIsLoadingMessages(false)
    }

    fetchMessages()
  }, [chatId])

  // Add socket/messaging logic
  useEffect(() => {
    if (!chatId) return

    const onNewMessage = (message: any) => {
      // Ignore messages sent by the current user to avoid duplicates with optimistic UI
      if (message.sender_id?._id === user?._id || message.sender_id === user?._id) {
        return
      }

      const newMessage: Message = {
        id: message._id,
        text: message.message,
        sender: message.sender_type === "responder" ? "responder" : "client",
        timestamp: new Date(message.createdAt),
        isRead: false,
        file_urls: message.file_urls,
      }
      setMessages((prev) => [...prev, newMessage])
    }
    socket.on("new_message", onNewMessage)
    return () => {
      socket.off("new_message", onNewMessage)
    }
  }, [chatId, user])

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesToSend((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((indexToRemove: number) => {
    setFilesToSend((prev) => prev.filter((_, index) => index !== indexToRemove))
  }, [])

  const sendMessage = useCallback(async () => {
    if ((!newMessage.trim() && filesToSend.length === 0) || isSending || !chatId) return

    if (filesToSend.length > 0) {
      toast.error("File sending is not implemented yet. Please remove files to send a message.")
      return
    }

    if (newMessage.trim()) {
      setIsSending(true)
      const tempId = Date.now().toString()
      const optimisticMessage: Message = {
        id: tempId,
        text: newMessage,
        sender: "responder",
        timestamp: new Date(),
        isRead: false,
        file_urls: [],
      }
      setMessages((prev) => [...prev, optimisticMessage])
      const messageText = newMessage
      setNewMessage("")

      try {
        const response = await chatApi.sendMessage({
          task_id: chatId,
          message: messageText,
          file_urls: [], // No file URLs for now
          sender_type: "responder",
        })

        if (response.success && response.data) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...optimisticMessage,
                    id: response.data._id,
                    timestamp: new Date(response.data.createdAt),
                  }
                : msg
            )
          )
        } else {
          toast.error(response.message || "Failed to send message.")
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
          setNewMessage(messageText) // Restore message in input
        }
      } catch (error) {
        toast.error("An error occurred while sending the message.")
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
        setNewMessage(messageText)
      } finally {
        setIsSending(false)
      }
    }
  }, [newMessage, filesToSend, chatId, user, isSending])

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return {
    messages,
    setMessages,
    user,
    newMessage,
    setNewMessage,
    sendMessage,
    onKeyPress,
    filesToSend,
    addFiles,
    removeFile,
    isLoadingMessages,
    isSending,
  }
}
