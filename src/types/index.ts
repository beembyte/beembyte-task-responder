
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  availability: 'available' | 'busy';
  profileImage?: string;
};

export type TaskStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

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
  type: 'file' | 'link' | 'text';
  content: string;
  createdAt: Date;
};

export type ProgressStatus = {
  percentage: number;
  color: string;
};
