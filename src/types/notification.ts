export interface Notification {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: {
    all?: boolean;
    buildings?: string[];
    units?: string[];
    residents?: string[];
  };
  type?: 'announcement' | 'alert' | 'maintenance' | 'payment' | string;
  priority?: 'low' | 'medium' | 'high';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
} 