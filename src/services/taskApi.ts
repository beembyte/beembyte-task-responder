import { API_BASE_URL } from "@/config/env";
import { getAuthToken } from "@/utils/formatUtils";

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

export const taskApi = {
  getAllPendingAndUnassignedTask: async (
    payload: getAllunAssignedTaskPayload
  ) => {
    const { limit, page, sort, title, description } = payload;
    try {
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
        `${API_BASE_URL}/tasks/all-unassigned-pending-task?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
        `${API_BASE_URL}/tasks/all-completed-task?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
      const response = await fetch(`${API_BASE_URL}/tasks/dashboard-stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
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
      const response = await fetch(
        `${API_BASE_URL}/tasks/findOne?task_id=${task_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
      const response = await fetch(`${API_BASE_URL}/tasks/accept-task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id }),
        credentials: "include",
      });
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
      const response = await fetch(`${API_BASE_URL}/tasks/cancel-task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id }),
        credentials: "include",
      });
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
      const response = await fetch(`${API_BASE_URL}/tasks/submit-task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id,
          description,
          link,
          files_urls,
        }),
        credentials: "include",
      });
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
