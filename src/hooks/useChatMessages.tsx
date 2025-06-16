"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { Message } from "@/components/chat/ChatMessageList"
import type { User } from "@/types"
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
  const [isPolling, setIsPolling] = useState(false)

  // Refs to track component state
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageTimestampRef = useRef<Date | null>(null)
  const isActiveRef = useRef(true)

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await loggedInUser()
      setUser(userData)
    }
    fetchUser()
  }, [loggedInUser])

  // Track if page/tab is active for efficient polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden
      if (document.hidden) {
        // Stop polling when tab is not active
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      } else {
        // Resume polling when tab becomes active
        if (chatId && !pollingIntervalRef.current) {
          startPolling()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [chatId])

  // Fetch messages from API
  const fetchMessages = useCallback(
    async (isInitialLoad = false) => {
      if (!chatId) {
        setIsLoadingMessages(false)
        return
      }

      if (isInitialLoad) {
        setIsLoadingMessages(true)
      }

      try {
        const response = await chatApi.getMessages(chatId)
        if (response.success && Array.isArray(response.data)) {
          const transformedMessages: Message[] = response.data
            .map((msg: any) => ({
              id: msg._id,
              text: msg.message,
              sender: msg.sender_type === "responder" ? "responder" : "client",
              timestamp: new Date(msg.createdAt),
              isRead: true, // assume fetched messages are read
              file_urls: msg.file_urls || [],
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // sort by date

          // Update last message timestamp
          if (transformedMessages.length > 0) {
            lastMessageTimestampRef.current = transformedMessages[transformedMessages.length - 1].timestamp
          }

          if (isInitialLoad) {
            setMessages(transformedMessages)
          } else {
            // For polling updates, only add new messages
            setMessages((prevMessages) => {
              const existingIds = new Set(prevMessages.map((msg) => msg.id))
              const newMessages = transformedMessages.filter((msg) => !existingIds.has(msg.id))

              if (newMessages.length > 0) {
                console.log(`Found ${newMessages.length} new messages`)
                return [...prevMessages, ...newMessages]
              }
              return prevMessages
            })
          }
        } else if (isInitialLoad) {
          toast.error(response.message || "Could not load chat history.")
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        if (isInitialLoad) {
          toast.error("Failed to load chat messages.")
        }
      } finally {
        if (isInitialLoad) {
          setIsLoadingMessages(false)
        }
      }
    },
    [chatId],
  )

  // Start polling for new messages
  const startPolling = useCallback(() => {
    if (!chatId || pollingIntervalRef.current) return

    console.log("Starting message polling...")
    setIsPolling(true)

    pollingIntervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        fetchMessages(false) // Poll for new messages
      }
    }, 3000) // Poll every 3 seconds
  }, [chatId, fetchMessages])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log("Stopping message polling...")
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      setIsPolling(false)
    }
  }, [])

  // Initial message fetch and start polling
  useEffect(() => {
    if (!chatId) {
      setIsLoadingMessages(false)
      return
    }

    // Initial load
    fetchMessages(true)

    // Start polling after initial load
    const pollTimeout = setTimeout(() => {
      if (isActiveRef.current) {
        startPolling()
      }
    }, 1000) // Start polling 1 second after initial load

    return () => {
      clearTimeout(pollTimeout)
      stopPolling()
    }
  }, [chatId, fetchMessages, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesToSend((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((indexToRemove: number) => {
    setFilesToSend((prev) => prev.filter((_, index) => index !== indexToRemove))
  }, [])

  const sendMessage = useCallback(async () => {
    if ((!newMessage.trim() && filesToSend.length === 0) || isSending || !chatId || !user) return

    if (filesToSend.length > 0) {
      toast.error("File sending is not implemented yet. Please remove files to send a message.")
      return
    }

    if (newMessage.trim()) {
      setIsSending(true)
      const tempId = `temp_${Date.now()}`
      const messageText = newMessage.trim()

      // Optimistic UI update
      const optimisticMessage: Message = {
        id: tempId,
        text: messageText,
        sender: "responder",
        timestamp: new Date(),
        isRead: false,
        file_urls: [],
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      try {
        const response = await chatApi.sendMessage({
          task_id: chatId,
          message: messageText,
          file_urls: [], // No file URLs for now
          sender_type: "responder",
        })

        if (response.success && response.data) {
          // Update the optimistic message with real data
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

          // Update last message timestamp
          lastMessageTimestampRef.current = new Date(response.data.createdAt)
        } else {
          toast.error(response.message || "Failed to send message.")
          // Remove optimistic message on failure
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
          setNewMessage(messageText) // Restore message in input
        }
      } catch (error) {
        console.error("Error sending message:", error)
        toast.error("An error occurred while sending the message.")
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
        setNewMessage(messageText)
      } finally {
        setIsSending(false)
      }
    }
  }, [newMessage, filesToSend, chatId, user, isSending])

  const deleteMessage = useCallback(
    async (messageId: string) => {
      const originalMessages = messages

      // Optimistic update
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))

      try {
        const response = await chatApi.deleteMessage(messageId)
        if (!response.success) {
          toast.error(response.message || "Failed to delete message.")
          setMessages(originalMessages) // Revert on failure
        }
      } catch (error) {
        console.error("Error deleting message:", error)
        toast.error("An error occurred while deleting the message.")
        setMessages(originalMessages) // Revert on error
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

  // Manual refresh function
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
    isSending,
    deleteMessage,
    refreshMessages,
    isPolling,
  }
}
