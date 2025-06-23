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
  data?: {
    auth_token?: string;
    user?: {
      role: any;
      user_id: any;
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number?: string;
    };
  };
  token?: string;
}

// Set cookie with token
const setAuthCookie = (token: string) => {
  // Set cookie to expire in 30 days
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  document.cookie = `authToken=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
};

const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
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
        `${API_BASE_URL}/responder/resend-signup-verification`,
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

  //   forgotPassword API
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/responder/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

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

  changePassword: async (
    old_password: string,
    new_password: string,
    confirm_password: string,
    user_id: string
  ): Promise<AuthResponse> => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password,
            new_password,
            confirm_password,
            user_id,
          }),
        }
      );

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
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/responder/user-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
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
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/responder/edit-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
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
  logout: () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("authorizeUser");
  },
};
