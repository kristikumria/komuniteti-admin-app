import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../store/slices/authSlice';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Business Manager Stack
export type BusinessManagerStackParamList = {
  Dashboard: undefined;
  Buildings: undefined;
  BuildingDetails: { buildingId: string };
  AddBuilding: undefined;
  EditBuilding: { buildingId: string };
  AssignAdministrator: { buildingId: string; buildingName: string };
  Administrators: undefined;
  AdministratorDetails: { adminId: string };
  Payments: undefined;
  PaymentDetails: { paymentId: string };
  AddPayment: undefined;
  EditPayment: { paymentId: string };
  ProcessPayment: { paymentId: string };
  Reports: undefined;
  ReportDetails: { reportId: string };
  Notifications: undefined;
  NotificationsScreen: undefined;
  NotificationsTab: undefined;
  NotificationDetails: { notificationId: string };
  NotificationSettings: undefined;
  Messages: undefined;
  InfoPoints: undefined;
  InfoPointsScreen: undefined;
  Polls: undefined;
  PollsScreen: undefined;
  Organigram: undefined;
  Analytics: undefined;
  Settings: undefined;
  Services: undefined;
  MoreMain: undefined;
  MainTabs: undefined;
};

// Administrator Stack
export type AdministratorStackParamList = {
  Dashboard: undefined;
  Residents: undefined;
  ResidentDetails: { residentId: string };
  AddResident: undefined;
  EditResident: { residentId: string };
  Payments: undefined;
  PaymentDetails: { paymentId: string };
  AddPayment: undefined;
  EditPayment: { paymentId: string };
  ProcessPayment: { paymentId: string };
  PaymentHistory: undefined;
  NotificationsTab: undefined;
  NotificationsScreen: undefined;
  NotificationDetails: { notificationId: string };
  NotificationSettings: undefined;
  Reports: undefined;
  ReportDetails: { reportId: string };
  Issues: undefined;
  IssueDetails: { issueId: string };
  Notices: undefined;
  NoticeDetails: { noticeId: string };
  Chat: undefined;
  ChatConversation: { conversationId: string };
  InfoPoints: undefined;
  Polls: undefined;
  Settings: undefined;
  MoreMain: undefined;
  InfoPointsScreen: undefined;
  PollsScreen: undefined;
  ReportsStack: undefined;
  MainTabs: undefined;
};

// Root Navigation
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  BusinessManager: NavigatorScreenParams<BusinessManagerStackParamList>;
  Administrator: NavigatorScreenParams<AdministratorStackParamList>;
};

// Types for models based on the PRD
export interface Building {
  id: string;
  name: string;
  address: string;
  units: number;
  residents: number;
  issues: number;
  occupancyRate: number;
  maintenanceCost: string;
  yearBuilt: number;
  propertyType: string;
  amenities: string[];
  image: string;
  administratorId?: string;
}

export interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  buildings: number;
  buildingsList: string[];
  role: string;
  hireDate: string;
  performance: number;
  tenantSatisfaction: number;
  issueResolutionTime: string;
  image: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'owner' | 'tenant';
  unit: string;
  building: string;
  familyMembers: number;
  moveInDate: string;
  image: string;
  paymentStatus: 'current' | 'overdue';
}

export interface Payment {
  id: string;
  residentId: string;
  residentName: string;
  buildingId: string;
  buildingName: string;
  amount: number;
  type: 'rent' | 'maintenance' | 'utilities' | 'other';
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'creditCard' | 'bankTransfer' | 'cash' | 'other';
  description: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  submitter: string;
  submitterId: string;
  location: string;
  building: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
  description: string;
  assignedTo: string;
  images?: string[];
  estimatedCost?: string;
  serviceAppointment?: string;
  resolvedDate?: string;
  resolutionDetails?: string;
  actualCost?: string;
  comments?: ReportComment[];
}

export interface ReportComment {
  author: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  type?: 'payment' | 'maintenance' | 'resident' | 'building' | 'message' | 'system' | 'other';
  targetId?: string;
  recipientId?: string;
}

// Chat Models
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderImage?: string;
  content: string;
  timestamp: string;
  readBy: string[];
  attachments?: ChatAttachment[];
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ChatConversation {
  id: string;
  title: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  image?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'resident';
  image?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'document' | 'location' | 'contact' | 'voice';
  url: string;
  name: string;
  size?: number;
  duration?: number; // For voice messages (in seconds)
  thumbnailUrl?: string;
  mimeType?: string;
}

// Add User type definition here
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'business_manager' | 'administrator';
} 