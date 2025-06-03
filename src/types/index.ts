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
