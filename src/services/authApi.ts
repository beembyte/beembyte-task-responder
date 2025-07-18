
import { API_BASE_URL } from "../config/env";

interface FieldError {
  msg: string;
  field?: string;
}

// Type definitions for requests and responses
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyCodeRequest {
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyOTPRequest {
  code: string;
  type: string;
}

export interface ResetPasswordRequest {
  code: string;
  new_password: string;
  confirm_password: string;
  user_id: string;
}

export interface AuthResponse {
  errors?: FieldError[];
  success: boolean;
  message: string | { message: string; verified: boolean };
  data?: {
    auth_token?: string;
    user?: {
      role: any;
      user_id: any;
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      is_vetted: boolean;
      phone_number?: string;
    };
    email?: string;
    user_id?: string;
  };
  token?: string;
}

export interface AuthVerifyResponse {
  errors?: FieldError[];
  success: boolean;
  message: string | { message: string; verified: boolean };
  data?: {
    is_vetted: boolean;
  };
}

// Helper function to log cookie state
const logCookieState = (action: string) => {
  console.log(`🍪 ${action} - Document cookies:`, document.cookie);
  const authCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  console.log(`🍪 ${action} - Auth cookie:`, authCookie || 'NOT FOUND');
};

// Authentication API service
export const authApi = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      logCookieState("Before register");
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();
      logCookieState("After register");
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Failed to register. Please try again later.",
      };
    }
  },

  // Login a user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("🌐 Starting login request...");
      logCookieState("Before login");
      
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      console.log("🌐 Login response status:", response.status);
      console.log("🌐 Login response headers:", {
        'set-cookie': response.headers.get('set-cookie'),
        'content-type': response.headers.get('content-type'),
      });

      const data = await response.json();
      console.log("🌐 Login response data:", data);
      
      logCookieState("After login");
      
      // If login is successful but no cookie was set by server, try to set it manually
      if (data.success && data.data?.auth_token) {
        const authCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if (!authCookie) {
          console.log("🍪 Setting auth cookie manually...");
          // Set cookie with secure flags for production
          const isProduction = window.location.protocol === 'https:';
          const cookieOptions = isProduction 
            ? `authToken=${data.data.auth_token}; path=/; secure; samesite=strict; max-age=86400`
            : `authToken=${data.data.auth_token}; path=/; max-age=86400`;
          document.cookie = cookieOptions;
          logCookieState("After manual cookie set");
        }
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Failed to login. Please try again later.",
      };
    }
  },

  // Verify signup code
  verifyCode: async (
    verifyData: VerifyCodeRequest
  ): Promise<AuthVerifyResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/responder/signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Verification error:", error);
      return {
        success: false,
        message: "Failed to verify code. Please try again later.",
      };
    }
  },

  // Resend verification code
  resendVerification: async (
    resendData: ResendVerificationRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/responder/resend-signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendData),
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        message: "Failed to resend verification code. Please try again later.",
      };
    }
  },

  verifyAuthToken: async () => {
    try {
      logCookieState("Before token verification");
      const response = await fetch(`${API_BASE_URL}/users/verify-auth-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("🌐 Token verification response:", { success: data.success });
      return data;
    } catch (error) {
      console.error("verify auth token error:", error);
      return {
        success: false,
        message: "Failed to verify auth token Please try again later.",
      };
    }
  },

  //   forgotPassword API
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: "Failed to send reset link. Please try again later.",
      };
    }
  },

  verifyOTP: async (verifyData: VerifyOTPRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Verify OTP error:", error);
      return {
        success: false,
        message: "Failed to verify OTP. Please try again later.",
      };
    }
  },

  resetPassword: async (
    resetData: ResetPasswordRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Failed to reset password. Please try again later.",
      };
    }
  },

  changePassword: async (
    old_password: string,
    new_password: string,
    confirm_password: string,
    user_id: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password,
          new_password,
          confirm_password,
          user_id,
        }),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: "Failed to change password. Please try again later.",
      };
    }
  },

  logedInUser: async () => {
    try {
      logCookieState("Before fetch user profile");
      const response = await fetch(`${API_BASE_URL}/users/user-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("🌐 User profile response:", { success: data.success, hasData: !!data.data });
      return data;
    } catch (error) {
      console.error("fetch user error:", error);
      return {
        success: false,
        message: "Failed to fetch user Please try again later.",
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLoggedInUser: async (userData: any): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/edit-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        message: "Failed to update user. Please try again later.",
      };
    }
  },

  // Logout user and clear cookie
  logout: async () => {
    try {
      logCookieState("Before logout");
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      localStorage.removeItem("authorizeUser");
      
      // Clear auth cookie manually as well
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      logCookieState("After logout");
      
      return data;
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: "Logout failed. Please try again.",
      };
    }
  },
};
