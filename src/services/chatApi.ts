
import { API_BASE_URL } from "@/config/env"

const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1]
}

export interface SendMessagePayload {
  task_id: string
  message: string
  file_urls: string[]
  sender_type: "responder" | "user"
}

export const chatApi = {
  getMessages: async (taskId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn("Authentication token not found.")
        return {
          success: false,
          message: "Authentication token not found.",
        }
      }
      
      if (!API_BASE_URL || API_BASE_URL === 'undefined') {
        console.warn("API_BASE_URL is not configured")
        return {
          success: false,
          message: "API configuration error. Please check your environment variables.",
        }
      }

      const response = await fetch(`${API_BASE_URL}/responder/chat/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Fetch chat messages error:", error)
      return {
        success: false,
        message: "Failed to fetch messages. Please try again later.",
      }
    }
  },

  sendMessage: async (payload: SendMessagePayload) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn("Authentication token not found.")
        return {
          success: false,
          message: "Authentication token not found.",
        }
      }
      
      if (!API_BASE_URL || API_BASE_URL === 'undefined') {
        console.warn("API_BASE_URL is not configured")
        return {
          success: false,
          message: "API configuration error. Please check your environment variables.",
        }
      }

      const response = await fetch(`${API_BASE_URL}/responder/chat/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Send message error:", error)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      }
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn("Authentication token not found.")
        return {
          success: false,
          message: "Authentication token not found.",
        }
      }
      
      if (!API_BASE_URL || API_BASE_URL === 'undefined') {
        console.warn("API_BASE_URL is not configured")
        return {
          success: false,
          message: "API configuration error. Please check your environment variables.",
        }
      }

      const response = await fetch(`${API_BASE_URL}/responder/chat/delete/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Delete message error:", error)
      return {
        success: false,
        message: "Failed to delete message. Please try again later.",
      }
    }
  },
}
