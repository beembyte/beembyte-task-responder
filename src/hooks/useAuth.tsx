
"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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

// Helper function to notify other tabs of auth changes
const notifyAuthChange = () => {
  localStorage.setItem('auth-change', Date.now().toString());
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordChanging, setIsPasswordChanging] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()
  const location = useLocation()

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(userData)

      if (response.success) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Registration successful! Please verify your email."
        toast.success(message)
        localStorage.setItem("authEmail", userData.email)
        localStorage.setItem("hasCompletedRegistration", "true")
        navigate("/verify-code")
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message })
        } else {
          toast.error(response.message?.message || "Registration failed")
        }
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
      console.log("🔐 Starting login process...");
      const response = await authApi.login(credentials)
      console.log("🔐 Login API response received:", { success: response.success, hasData: !!response.data });

      if (response.success) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Login successful!"
        toast.success(message)

        const { auth_token, user } = response.data
        console.log("🔐 Login data extracted:", { hasToken: !!auth_token, hasUser: !!user, userId: user?.user_id });

        if (user) {
          console.log("🔐 User data received:", { userId: user.user_id, isVetted: user.is_vetted });

          // Connect to socket after successful login
          if (user.user_id && user.role) {
            try {
              socketService.connect(user.user_id, user.role)
              socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error)
              })
            } catch (socketError) {
              console.error("Socket connection error:", socketError)
            }
          }

          // Notify other tabs of auth change
          notifyAuthChange();

          // Add delay to ensure cookie is set
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log("🔐 Checking vetting status:", { isVetted: user.is_vetted });
          
          if (!user.is_vetted) {
            console.log("🔐 User not vetted, navigating to vetting...");
            navigate('/vetting', { replace: true });
            return;
          }

          const params = new URLSearchParams(location.search);
          const returnTo = params.get('returnTo') || '/dashboard';
          console.log("🔐 User is vetted, navigating to:", returnTo);
          navigate(returnTo, { replace: true });
          
        } else {
          console.error("🔐 No user data in response");
          toast.error("Login failed - no user data received");
        }
      } else {
        if (typeof response.message === 'object' && response.message?.verified === false) {
          toast.error(response.message.message)
          localStorage.setItem("authEmail", credentials.email)
          navigate("/verify-code")
        } else {
          if (typeof response.message === 'string') {
            handleApiErrors({ ...response, message: response.message })
          } else {
            toast.error(response.message?.message || "Login failed")
          }
        }
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
      const verifyData: VerifyCodeRequest = { code }
      const response = await authApi.verifyCode(verifyData)

      if (response.success) {
        localStorage.removeItem("authEmail")
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Verification successful!"
        toast.success(message)

        if (!response.data.is_vetted) {
          navigate("/vetting", { state: { is_vetted: response.data.is_vetted } })
        } else {
          navigate("/login")
        }
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message })
        } else {
          toast.error(response.message?.message || "Verification failed")
        }
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
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Verification code resent successfully!"
        toast.success(message)
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
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message })
        } else {
          toast.error(response.message?.message || "Failed to resend verification")
        }
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
    }
    
    authApi.logout()
    setUser(null)
    
    // Notify other tabs of auth change
    notifyAuthChange();
    
    navigate("/login")
    toast.success("Successfully logged out")
  }

  const updateProfile = async (profileData: Partial<User>) => {
    setIsLoading(true)
    try {
      const response = await authApi.updateLoggedInUser(profileData)

      if (response.success) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Profile updated successfully!"
        toast.success(message)
        
        // Notify other tabs of potential auth changes
        notifyAuthChange();
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message })
        } else {
          toast.error(response.message?.message || "Profile update failed")
        }
      }
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const loggedInUser = async (): Promise<User> => {
    try {
      const response = await authApi.logedInUser();
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
      throw new Error('Failed to get user profile');
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.logedInUser();
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
      throw new Error('Failed to refresh user');
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const verifyAuthToken = async () => {
    try {
      const response = await authApi.verifyAuthToken();
      if (!response.success) {
        setUser(null);
        toast.error("Session expired. Please login again.");
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
      }
      return response;
    } catch (error) {
      console.error("Token verification error:", error);
      setUser(null);
      toast.error("Failed to verify session. Please login again.");
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
      throw error;
    }
  };

  const changePassword = async (
    old_password: string,
    new_password: string,
    confirm_password: string,
    user_id: string | null = null
  ): Promise<{ success: boolean; message?: string }> => {
    setIsPasswordChanging(true)
    try {
      if (new_password !== confirm_password) {
        toast.error("New password and confirmation do not match.")
        return { success: false, message: "Passwords do not match." }
      }

      const response = await authApi.changePassword(old_password, new_password, confirm_password, user_id)

      if (response.success) {
        const message = typeof response.message === 'string' ? response.message : response.message?.message || "Password changed successfully!"
        toast.success(message)
        return { success: true }
      } else {
        if (typeof response.message === 'string') {
          handleApiErrors({ ...response, message: response.message })
          return { success: false, message: response.message }
        } else {
          const errorMessage = response.message?.message || "Failed to change password"
          toast.error(errorMessage)
          return { success: false, message: errorMessage }
        }
      }
    } catch (error) {
      console.error("Change password error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
      return { success: false, message: "Failed to change password. Please try again later." }
    } finally {
      setIsPasswordChanging(false)
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
    user,
    updateProfile,
    loggedInUser,
    refreshUser,
    verifyAuthToken,
    changePassword,
    isPasswordChanging,
  }
}
