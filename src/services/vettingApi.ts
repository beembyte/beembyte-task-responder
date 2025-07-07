
import { API_BASE_URL } from '@/config/env';
import { getCookie } from '@/utils/formatUtils';

export interface VettingSubmissionRequest {
  job_title: string;
  years_of_experience: string;
  portfolio_link?: string;
  tools_technologies: string;
  preferred_categories: string[];
  preferred_callDate: Date | null;
  preferred_callTime: string;
  call_platform: string;
  resume?: string; // Made optional
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
  submitVetting: async (vettingData: VettingSubmissionRequest): Promise<VettingResponse> => {
    const authToken = getCookie('authToken');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/responder/vetting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(vettingData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getVettingStatus: async (): Promise<VettingStatusResponse> => {
    const authToken = getCookie('authToken');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/responder/vetting/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
