import { API_BASE_URL } from "@/config/env";

export interface getAllunAssignedTaskPayload {
  limit: number;
  page: number;
  sort: number;
  title: string;
  description: string;
}
const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

export const taskApi = {
  getAllPendingAndUnassignedTask: async (
    payload: getAllunAssignedTaskPayload
  ) => {
    const { limit, page, sort, title, description } = payload;
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/all-unassigned-pending-task?limit=${limit}&page=${page}&sort=${sort},title=${title}&description=${description}`,
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
      console.error("Fetch pending task error:", error);
      return {
        success: false,
        message: "Failed to fetch. Please try again later.",
      };
    }
  },
};
