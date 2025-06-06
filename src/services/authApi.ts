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

export interface AuthResponse {
  errors?: FieldError[];
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

// Set cookie with token
const setAuthCookie = (token: string) => {
  // Set cookie to expire in 30 days
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  document.cookie = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
};

// Authentication API service
export const authApi = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/responder/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/responder/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // If login successful, store the token in a cookie
      if (data.success && data.data?.auth_token) {
        setAuthCookie(data.data.auth_token);
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
  verifyCode: async (verifyData: VerifyCodeRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/responder/signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
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
        `${API_BASE_URL}/resonder/resend-signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendData),
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

  verifyAuthToken: async (auth_token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/responder/verify-authToken/${auth_token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("verify auth token error:", error);
      return {
        success: false,
        message: "Failed to verify auth token Please try again later.",
      };
    }
  },

  // Logout user and clear cookie
  logout: () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("authorizeUser");
  },
};
