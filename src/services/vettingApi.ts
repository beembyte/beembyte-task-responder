
import { API_BASE_URL } from "@/config/env";
import { getCookie } from "@/utils/formatUtils";

export interface VettingSubmissionRequest {
  job_title: string;
  years_of_experience: number;
  portfolio_link?: string;
  tools_technologies: string[]; // Array of tool IDs
  preferred_categories: string[]; // Array of category IDs
  preferred_callDate: Date | null;
  preferred_callTime: string;
  call_platform: string;
  resume?: string;
  bio?: string;
  skills?: string[];
  country: string;
  state: string;
  city: string;
}

export interface VettingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface VettingStatusResponse {
  success: boolean;
  data?: {
    is_vetted: boolean;
    vetting_status: string;
    submission_date?: string;
  };
}

export const vettingApi = {
  submitVetting: async (
    vettingData: VettingSubmissionRequest
  ): Promise<VettingResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/users/add-vetted-information`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vettingData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getVettingStatus: async (): Promise<VettingStatusResponse> => {
    const authToken = getCookie("authToken");

    const response = await fetch(`${API_BASE_URL}/responder/vetting/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
