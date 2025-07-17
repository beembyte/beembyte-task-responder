export enum USER_ROLES {
  USER = "user",
  RESPONSER = "responder",
  ADMIN = "admin",
}

export enum USER_STATUS {
  "PENDING" = "pending",
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

export interface RANK_CRITERIA {
  tasks_completed: number;
  minimum_rating: number;
}

export interface RANK_STATUS {
  criteria: RANK_CRITERIA;
  _id: string;
  rank_name: string;
  rank_color: string;
  createdAt: string;
  updatedAt: string;
  min_tasks_completed?: number; // Added for backward compatibility
  min_rating?: number; // Added for backward compatibility
}

export interface WALLET {
  _id: string;
  user_id: string;
  type: string;
  balance: number;
  locked_balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RESPONDER_DATA {
  rank_criteria: RANK_CRITERIA;
  _id: string;
  user: string;
  responder_id: string;
  job_title: string;
  years_of_experience: number;
  portfolio_link: string;
  tools_technologies: Array<{
    _id: string;
    name: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }>;
  preferred_categories: Array<{
    _id: string;
    name: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }>;
  preferred_callDate: string;
  preferred_callTime: string;
  call_platform: string;
  resume: string;
  country: string;
  state: string;
  city: string;
  bio: string;
  skills: string[];
  availability_status: AVAILABILITY_STATUS;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rank_status: {
    _id: string;
    rank_name: string;
    rank_color: string;
    min_tasks_completed: number;
    min_rating: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
  };
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
  is_vetted?: boolean;
  location?: USER_LOCATION;
  last_login: Date;
  has_set_transaction_pin?: boolean;
  status?: USER_STATUS;
  responder_id?: RESPONDER_DATA;
  availability_status?: AVAILABILITY_STATUS;
  // API response fields
  rank_criteria?: RANK_CRITERIA;
  rank_status?: RANK_STATUS;
  preferred_categories?: string[];
  job_title?: string;
  portfolio_link?: string;
  resume?: string;
  tools_technologies?: string;
  years_of_experience?: string;
  country?: string;
  state?: string;
  city?: string;
  preferred_callDate?: string;
  preferred_callTime?: string;
  user_id?: string;
  wallet_id?: WALLET;
  // Added optional fields for SingleTask UI
  photo_url?: string;
  rating?: number;
  tasks_count?: number;
  // Added missing properties
  bio?: string;
  skills?: string[];
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
  price?: number;   // <-- Added for compatibility with component usage.
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
  created_by: User;
  price: number;
  difficulty: TASK_DIFFICULTY;
  _id?: string;
  responder?: User;
  files?: string[];
  assigned_status: ASSIGNED_STATUS;
  user_final_decision: USER_FINAL_DECISION;
  status: TASK_STATUS;
  responder_final_decision: RESPONDER_FINAL_DECISION;
  progress_percentage: number;
  createdAt: Date;
  updatedAt: Date;
  submit?: {
    description?: string;
    link?: string;
    files_urls?: string[];
  };
};
