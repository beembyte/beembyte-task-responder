import { API_HOST_ADDRESS } from "@/config/env";

export interface FileUploadResponse {
  success: boolean;
  message?: string;
  urls?: string[];
}

const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

export const fileUploadApi = {
  uploadMultiple: async (formData: FormData): Promise<FileUploadResponse> => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_HOST_ADDRESS}/api/upload/multiple`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - let the browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.urls && Array.isArray(data.urls)) {
        return {
          success: true,
          urls: data.urls,
          message: "Files uploaded successfully",
        };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("File upload API error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload files",
      };
    }
  },
};
