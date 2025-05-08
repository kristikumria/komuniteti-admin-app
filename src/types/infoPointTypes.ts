export type InfoPointCategory = 
  | 'general'
  | 'guidelines'
  | 'faq'
  | 'contacts'
  | 'emergency'
  | 'maintenance'
  | 'community'
  | 'other';

export interface InfoPointAttachment {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface InfoPoint {
  id: string;
  title: string;
  content: string;
  category: InfoPointCategory;
  buildingId?: string;
  buildingName?: string;
  pinned: boolean;
  published: boolean;
  attachments: InfoPointAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: number; // in bytes
  createdAt: string;
}

export interface InfoPointFormData {
  title: string;
  content: string;
  category: InfoPointCategory;
  buildingId?: string;
  published: boolean;
  pinned: boolean;
} 