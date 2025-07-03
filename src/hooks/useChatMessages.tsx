
"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { Message } from "@/components/chat/ChatMessageList"
import type { User } from "@/types"
import { chatApi } from "@/services/chatApi"
import { useFileUpload } from "@/hooks/useFileUpload"
import { toast } from "sonner"

export function useChatMessages(chatId: string | undefined) {
  const { loggedInUser } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [filesToSend, setFilesToSend] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)

  const { uploadFiles, isUploading } = useFileUpload()

  // Refs to track component state
  const isMountedRef = useRef(true)

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loggedInUser()
        if (isMountedRef.current) {
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [loggedInUser])

  // Fetch messages from API
  const fetchMessages = useCallback(
    async (isInitialLoad = false) => {
      if (!chatId || !isMountedRef.current) {
        if (isInitialLoad) setIsLoadingMessages(false)
        return
      }

      if (isInitialLoad) {
        setIsLoadingMessages(true)
      }

      try {
        const response = await chatApi.getMessages(chatId)
        
        if (!isMountedRef.current) return

        if (response.success && Array.isArray(response.data)) {
          const transformedMessages: Message[] = response.data
            .map((msg: any) => ({
              id: msg._id,
              text: msg.message,
              sender: msg.sender_type === "responder" ? "responder" : "client",
              timestamp: new Date(msg.createdAt),
              isRead: true,
              file_urls: msg.file_urls || [],
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

          setMessages(transformedMessages)
        } else if (isInitialLoad) {
          toast.error(response.message || "Could not load chat history.")
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        if (isInitialLoad && isMountedRef.current) {
          toast.error("Failed to load chat messages.")
        }
      } finally {
        if (isInitialLoad && isMountedRef.current) {
          setIsLoadingMessages(false)
        }
      }
    },
    [chatId],
  )

  // Initial message fetch only - no polling
  useEffect(() => {
    if (!chatId) {
      setIsLoadingMessages(false)
      return
    }

    // Initial load only
    fetchMessages(true)
  }, [chatId, fetchMessages])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesToSend((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((indexToRemove: number) => {
    setFilesToSend((prev) => prev.filter((_, index) => index !== indexToRemove))
  }, [])

  const sendMessage = useCallback(async () => {
    if ((!newMessage.trim() && filesToSend.length === 0) || isSending || !chatId || !user) return

    setIsSending(true)
    const tempId = `temp_${Date.now()}`
    const messageText = newMessage.trim()
    const filesToSendBackup = [...filesToSend]
    let fileUrls: string[] = []

    try {
      // Upload files first if any
      if (filesToSend.length > 0) {
        const uploadResult = await uploadFiles(filesToSend)
        if (uploadResult.success && uploadResult.urls) {
          fileUrls = uploadResult.urls
        } else {
          toast.error(uploadResult.error || "Failed to upload files")
          return
        }
      }

      // Optimistic UI update
      const optimisticMessage: Message = {
        id: tempId,
        text: messageText,
        sender: "responder",
        timestamp: new Date(),
        isRead: false,
        file_urls: fileUrls,
      }

      setMessages((prev) => [...prev, optimisticMessage])
      
      // Clear form immediately
      setNewMessage("")
      setFilesToSend([])

      const response = await chatApi.sendMessage({
        task_id: chatId,
        message: messageText,
        file_urls: fileUrls,
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
              : msg,
          ),
        )
        toast.success("Message sent successfully")
      } else {
        // On error, restore form data and remove optimistic message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
        setNewMessage(messageText)
        setFilesToSend(filesToSendBackup)
        toast.error(response.message || "Failed to send message.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // On error, restore form data and remove optimistic message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
      setNewMessage(messageText)
      setFilesToSend(filesToSendBackup)
      toast.error("An error occurred while sending the message.")
    } finally {
      setIsSending(false)
    }
  }, [newMessage, filesToSend, chatId, user, isSending, uploadFiles])

  const deleteMessage = useCallback(
    async (messageId: string) => {
      const originalMessages = messages

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))

      try {
        const response = await chatApi.deleteMessage(messageId)
        if (!response.success) {
          toast.error(response.message || "Failed to delete message.")
          setMessages(originalMessages)
        } else {
          toast.success("Message deleted successfully")
        }
      } catch (error) {
        console.error("Error deleting message:", error)
        toast.error("An error occurred while deleting the message.")
        setMessages(originalMessages)
      }
    },
    [messages],
  )

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const refreshMessages = useCallback(() => {
    fetchMessages(false)
  }, [fetchMessages])

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
    isSending: isSending || isUploading,
    deleteMessage,
    refreshMessages,
    isPolling: false, // Always false now since we removed polling
  }
}
