export enum USER_ROLES {
  USER = "user",
  RESPONSER = "responder",
  ADMIN = "admin",
}

export enum USER_STATUS {
  "ACTIVE" = "active",
  "DEACTIVATED" = "deactivated",
  "FLAGGED" = "flagged",
  "LOCKED" = "locked",
  "DELETED" = "deleted",
}

export enum AVAILABILITY_STATUS {
  BUSY = "busy",
  AVAILABLE = "available",
}

export interface USER_LOCATION {
  country: string;
  state: string;
  city: string;
  latitude: string;
  longitude: string;
}

export type User = {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone_number: string;
  role: USER_ROLES;
  _id?: string;
  is_verified: boolean;
  location?: USER_LOCATION;
  last_login: Date;
  has_set_transaction_pin?: boolean;
  status?: USER_STATUS;
  responder_id?: string;
  availability_status?: AVAILABILITY_STATUS;
};

export type TaskStatus = "pending" | "accepted" | "rejected" | "completed";

export type Task = {
  id: string;
  title: string;
  subject: string;
  description: string;
  createdAt: Date;
  deadline: Date;
  status: TaskStatus;
  payment?: number;
  responder?: User;
  notes?: string;
  attachments?: Attachment[];
};

export type Attachment = {
  id: string;
  name: string;
  type: "file" | "link" | "text";
  content: string;
  createdAt: Date;
};

export type ProgressStatus = {
  percentage: number;
  color: string;
};

export enum ASSIGNED_STATUS {
  PENDING = "pending",
  ASSIGNED = "assigned",
}

export enum TASK_STATUS {
  PENDING = "pending",
  INPROGRESS = "in_progress",
  COMPLETED = "completed",
  CLANCELLED = "cancelled",
}

export enum USER_FINAL_DECISION {
  APPROVED = "approved",
  DISPUTED = "disputed",
}

export enum RESPONDER_FINAL_DECISION {
  FINISHED = "finished",
  CANCELLED = "cancelled",
}

export enum TASK_DIFFICULTY {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type TaskInfo = {
  title: string;
  subject?: string;
  description?: string;
  deadline: string;
  file_urls: string[];
  key_notes: string[];
  created_by: string;
  price: number;
  difficulty: TASK_DIFFICULTY;
  _id?: string;
  responder?: string;
  files?: string[];
  assigned_status: ASSIGNED_STATUS;
  user_final_decision: USER_FINAL_DECISION;
  status: TASK_STATUS;
  responder_final_decision: RESPONDER_FINAL_DECISION;
  progress_percentage: number;
  createdAt: Date;
  updatedAt: Date;
};
