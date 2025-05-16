import { ReportComment } from '../navigation/types';

/**
 * Maintenance request status
 */
export type MaintenanceStatus = 'open' | 'in-progress' | 'resolved' | 'cancelled';

/**
 * Maintenance request priority
 */
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Maintenance request type
 */
export type MaintenanceType = 
  | 'plumbing' 
  | 'electrical' 
  | 'hvac' 
  | 'appliance' 
  | 'structural' 
  | 'common_area' 
  | 'landscaping' 
  | 'security' 
  | 'other';

/**
 * Maintenance request model
 */
export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: MaintenanceType;
  submitterId: string;
  submitterName: string;
  unitId?: string;
  unitNumber?: string;
  buildingId: string;
  buildingName: string;
  location: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  createdAt: string;
  updatedAt: string;
  assignedToId?: string;
  assignedToName?: string;
  images?: string[];
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  resolutionDetails?: string;
  comments?: MaintenanceComment[];
  documents?: MaintenanceDocument[];
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextRecurringDate?: string;
}

/**
 * Maintenance comment model
 */
export interface MaintenanceComment extends ReportComment {
  id: string;
  maintenanceRequestId: string;
  authorId: string;
  authorRole: 'manager' | 'administrator' | 'maintenance' | 'resident';
  createdAt: string;
  attachments?: string[];
  isPrivate?: boolean; // Comments visible only to staff
}

/**
 * Maintenance document model
 */
export interface MaintenanceDocument {
  id: string;
  maintenanceRequestId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
}

/**
 * Maintenance worker model
 */
export interface MaintenanceWorker {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: MaintenanceType[];
  isExternal: boolean;
  company?: string;
  availability: 'available' | 'busy' | 'unavailable';
  assignedRequests: number;
  completedRequests: number;
  averageResolutionTime: number; // in hours
  image?: string;
}

/**
 * Maintenance analytics
 */
export interface MaintenanceAnalytics {
  buildingId?: string;
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  cancelledRequests: number;
  averageResolutionTime: number; // in hours
  requestsByType: {
    type: MaintenanceType;
    count: number;
    percentage: number;
  }[];
  requestsByPriority: {
    priority: MaintenancePriority;
    count: number;
    percentage: number;
  }[];
  costSummary: {
    totalEstimated: number;
    totalActual: number;
    averagePerRequest: number;
  };
  monthlySummary: {
    month: string;
    requestCount: number;
    resolutionRate: number;
    averageCost: number;
  }[];
} 