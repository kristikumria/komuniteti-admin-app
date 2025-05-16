export interface InfoPoint {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'guidelines' | 'building' | 'faq' | string;
  visibility: 'all' | 'restricted';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
} 