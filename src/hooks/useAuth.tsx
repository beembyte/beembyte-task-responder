
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  authApi,
  type RegisterRequest,
  type LoginRequest,
  type VerifyCodeRequest,
  type ResendVerificationRequest,
} from "../services/authApi"
import { handleApiErrors } from "@/utils/apiResponse"
import type { User } from "@/types"
import { socketService, socket } from "@/services/socket"
import { getCookie } from "@/utils/formatUtils"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate()

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(userData)

      if (response.success) {
        toast.success(response.message || "Registration successful! Please verify your email.")
        localStorage.setItem("authEmail", userData.email)
        navigate("/verify-code")
      } else {
        handleApiErrors(response)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(credentials)

      if (response.success) {
        toast.success(response.message || "Login successful!")

        const { auth_token, user } = response.data
        // Token is now stored in cookie by the authApi.login function
        localStorage.setItem("authorizeUser", JSON.stringify(user))

        // Ensure user is valid before setting it
        if (user) {
          setUser(user as User)

          // Connect to socket after successful login
          if (user.user_id && user.role) {
            try {
              // Use the socketService to connect
              socketService.connect(user.user_id, user.role)

              // Add error handling for socket connection
              socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error)
                toast.error("Could not establish live connection. Some features may be limited.")
              })
            } catch (socketError) {
              console.error("Socket connection error:", socketError)
              // Show toast message but don't prevent login
              toast.error("Could not establish live connection. Some features may be limited.")
            }
          }
        }

        navigate("/dashboard")
      } else {
        handleApiErrors(response)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (code: string) => {
    setIsLoading(true)
    try {
      const email = localStorage.getItem("authEmail")
      const verifyData: VerifyCodeRequest = { email, code }
      const response = await authApi.verifyCode(verifyData)

      if (response.success) {
        localStorage.removeItem("authEmail")
        toast.success(response.message || "Verification successful!")
        navigate("/login")
      } else {
        handleApiErrors(response)
      }
    } catch (error) {
      console.error("Verification error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setIsLoading(true)
    try {
      const email = localStorage.getItem("authEmail")
      const resendData: ResendVerificationRequest = { email }
      const response = await authApi.resendVerification(resendData)

      if (response.success) {
        toast.success(response.message || "Verification code resent successfully!")
        // Start countdown for 120 seconds (2 minutes)
        setResendCountdown(120)
        const countdownInterval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        handleApiErrors(response)
      }
    } catch (error) {
      console.error("Resend verification error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    try {
      socketService.disconnect()
    } catch (error) {
      console.error("Error disconnecting socket:", error)
      // Don't block logout due to socket issues
    }
    authApi.logout()
    setUser(null)
    navigate("/login")
    toast.success("Successfully logged out")

  }

  const updateProfile = () => { }

  const loggedInUser = async (): Promise<User> => {
    try {
      const response = await authApi.logedInUser()
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const verifyAuthToken = async () => {
    try {
      const auth_token = getCookie('authToken');

      if (!auth_token) {
        // No token found, redirect to login
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)
        return;
      }

      const response = await authApi.verifyAuthToken(auth_token)
      if (!response.success) {
        // Token is invalid or expired, clear auth data and redirect
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("authorizeUser");
        toast.error("Session expired. Please login again.");
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)
      }
    } catch (error) {
      console.error("Token verification error:", error)
      // Clear auth data on error
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("authorizeUser");
      toast.error("Failed to verify session. Please login again.")
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)
    }
  }

  return {
    isLoading,
    register,
    login,
    verifyCode,
    resendVerification,
    resendCountdown,
    logout,
    updateProfile,
    loggedInUser,
    verifyAuthToken
  }
}
