import { API_BASE_URL } from "../config/env";

// Get auth token from cookie
const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

export interface VettingSubmissionRequest {
  job_title?: string;
  years_of_experience?: string;
  portfolio_link?: string;
  tools_technologies?: string;
  preferred_categories?: string[];
  preferred_callDate?: Date;
  preferred_callTime?: string;
  call_platform?: string;
  resume?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface VettingResponse {
  success: boolean;
  message: string;
  data?: {
    vetting_id: string;
    status: string;
  };
  errors?: Array<{
    field?: string;
    msg: string;
  }>;
}

export const vettingApi = {
  // Submit vetting application
  submitVetting: async (
    vettingData: VettingSubmissionRequest
  ): Promise<VettingResponse> => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      // Prepare payload with proper date formatting
      const payload = {
        ...vettingData,
        preferred_callDate: vettingData.preferred_callDate?.toISOString(),
        preferred_categories: vettingData.preferred_categories || [],
      };

      console.log("Submitting vetting with token:", token);
      console.log("Payload:", payload);

      const response = await fetch(
        `${API_BASE_URL}/responder/add-vetted-information`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Vetting response:", data);
      return data;
    } catch (error) {
      console.error("Vetting submission error:", error);
      return {
        success: false,
        message:
          "Failed to submit vetting application. Please try again later.",
      };
    }
  },

  // Get vetting status
  getVettingStatus: async (): Promise<VettingResponse> => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/responder/vetting/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get vetting status error:", error);
      return {
        success: false,
        message: "Failed to get vetting status. Please try again later.",
      };
    }
  },
};
