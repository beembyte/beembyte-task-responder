import { API_BASE_URL } from "@/config/env";

export interface getAllunAssignedTaskPayload {
  limit: number;
  page: number;
  sort: number;
  title: string;
  description: string;
}

export interface getCompletedTaskPayload {
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

      // Build query parameters properly
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        sort: sort.toString(),
      });

      // Add search parameters only if they have values
      if (title.trim()) {
        queryParams.append("title", title.trim());
      }
      if (description.trim()) {
        queryParams.append("description", description.trim());
      }

      const response = await fetch(
        `${API_BASE_URL}/responder/task/all-unassigned-pending-task?${queryParams.toString()}`,
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

  getCompletedTask: async (payload: getCompletedTaskPayload) => {
    const { limit, page, sort, title, description } = payload;
    try {
      const token = getAuthToken();

      // Build query parameters properly
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        sort: sort.toString(),
      });

      // Add search parameters only if they have values
      if (title.trim()) {
        queryParams.append("title", title.trim());
      }
      if (description.trim()) {
        queryParams.append("description", description.trim());
      }

      const response = await fetch(
        `${API_BASE_URL}/responder/task/all-completed-task?${queryParams.toString()}`,
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
      console.error("Fetch completed task error:", error);
      return {
        success: false,
        message: "Failed to fetch. Please try again later.",
      };
    }
  },

  getDashboardStats: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/dashboard-stats`,
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
      console.error("Fetch dashboard stats error:", error);
      return {
        success: false,
        message: "Failed to fetch. Please try again later.",
      };
    }
  },

  getOneTaskById: async (task_id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/findOne?task_id=${task_id}`,
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
      console.error("Fetch task by id error:", error);
      return {
        success: false,
        message: "Failed to fetch. Please try again later.",
      };
    }
  },

  acceptTask: async (task_id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/accept-task`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ task_id }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Accept task error:", error);
      return {
        success: false,
        message: "Failed to accept task. Please try again later.",
      };
    }
  },

  cancelTask: async (task_id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/cancel-task`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ task_id }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("cancel task error:", error);
      return {
        success: false,
        message: "Failed to cancel task. Please try again later.",
      };
    }
  },

  submitTask: async ({
    task_id,
    description,
    link,
    files_urls,
  }: {
    task_id: string;
    description: string;
    link?: string;
    files_urls: string[];
  }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/responder/task/submit-task`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task_id,
            description,
            link,
            files_urls,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Submit task error:", error);
      return {
        success: false,
        message: "Failed to submit task. Please try again later.",
      };
    }
  },
};
