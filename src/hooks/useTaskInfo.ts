
import { useEffect, useState } from "react";
import {
  USER_STATUS,
  USER_ROLES,
  TASK_DIFFICULTY,
  ASSIGNED_STATUS,
  USER_FINAL_DECISION,
  TASK_STATUS,
  RESPONDER_FINAL_DECISION,
  TaskInfo,
} from "@/types";

export function useTaskInfo(taskId: string | undefined) {
  const [task, setTask] = useState<TaskInfo | null>(null);

  useEffect(() => {
    // Demo: fetch mock data only!
    setTask({
      _id: taskId || "id",
      title: "Sample Task Title",
      subject: "Sample Subject",
      description: "A sample description for the mock task.",
      deadline: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
      price: 15000,
      created_by: {
        first_name: "Jane",
        last_name: "Doe",
        status: USER_STATUS.ACTIVE,
        is_verified: true,
        email: "jane@client.com",
        phone_number: "08061234567",
        tasks_count: 5,
        password: "",
        role: USER_ROLES.USER,
        last_login: new Date(),
      },
      file_urls: [],
      key_notes: [],
      difficulty: TASK_DIFFICULTY.EASY,
      assigned_status: ASSIGNED_STATUS.ASSIGNED,
      user_final_decision: USER_FINAL_DECISION.APPROVED,
      status: TASK_STATUS.INPROGRESS,
      responder_final_decision: RESPONDER_FINAL_DECISION.FINISHED,
      progress_percentage: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      responder: undefined,
      files: [],
      submit: undefined,
    });
  }, [taskId]);

  return { task };
}
