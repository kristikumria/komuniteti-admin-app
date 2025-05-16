import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../store/slices/authSlice';

// Developer tools
export type DevStackParamList = {
  MD3ElevationShowcase: undefined;
  ComponentShowcase: undefined;
  ThemeShowcase: undefined;
  ResponsiveLayoutShowcase: undefined;
  FormShowcase: undefined;
}

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
  BusinessAccounts: undefined;
  BusinessAccountDetails: { businessAccountId: string };
  BusinessAccountDocuments: { businessAccountId: string; businessAccountName: string };
  BusinessAccountFinancialReports: { businessAccountId: string; businessAccountName: string };
  BuildingsByBusinessAccount: { businessAccountId: string; businessAccountName: string };
  BuildingsComparison: { businessAccountId: string; buildingIds: string[] };
  Payments: undefined;
  PaymentDetails: { paymentId: string };
  AddPayment: undefined;
  EditPayment: { paymentId: string };
  ProcessPayment: { paymentId: string };
  Reports: undefined;
  ReportDetails: { reportId: string };
  ReportsStack: undefined;
  Notifications: undefined;
  NotificationsScreen: undefined;
  NotificationsTab: undefined;
  NotificationDetails: { notificationId: string };
  NotificationSettings: undefined;
  Messages: undefined;
  Chat: undefined;
  ChatConversation: { conversationId: string };
  NewConversation: undefined;
  InfoPoints: undefined;
  InfoPointsScreen: undefined;
  Polls: undefined;
  PollsScreen: undefined;
  PollDetails: { pollId: string };
  Organigram: undefined;
  Analytics: undefined;
  Settings: undefined;
  Services: undefined;
  MoreMain: undefined;
  MainTabs: undefined;
  // Dev tools
  MD3ElevationShowcase: undefined;
  ComponentShowcase: undefined;
  ThemeShowcase: undefined;
  ResponsiveLayoutShowcase: undefined;
  FormShowcase: undefined;
  Maintenance: undefined;
  MaintenanceRequests: undefined;
  MaintenanceDetail: { requestId: string };
  MaintenanceForm: { buildingId?: string; unitId?: string };
  MaintenanceEdit: { requestId: string };
  MaintenanceWorkers: undefined;
  MaintenanceWorkerDetail: { workerId: string };
  MaintenanceAnalytics: { buildingId?: string };
};

// Administrator Tab Navigator
export type AdministratorTabParamList = {
  DashboardTab: undefined;
  UnitsTab: NavigatorScreenParams<AdministratorStackParamList> | undefined;
  PaymentsTab: NavigatorScreenParams<AdministratorStackParamList> | undefined;
  ChatTab: NavigatorScreenParams<{
    Chat: undefined;
    ChatConversation: { conversationId: string };
    NewConversation: undefined;
  }> | undefined;
  MoreTab: NavigatorScreenParams<AdministratorStackParamList> | undefined;
  MainTabs: undefined;
};

// Administrator Stack
export interface AdministratorStackParamList extends Record<string, object | undefined> {
  Dashboard: undefined;
  Residents: undefined;
  ResidentDetails: { residentId: string };
  AddResident: undefined;
  EditResident: { residentId: string };
  Units: undefined;
  UnitDetails: { unitId: string };
  AddUnit: undefined;
  EditUnit: { unitId: string };
  UnitResidents: { unitId: string; unitNumber: string; buildingName: string };
  ResidentialUnits: undefined;
  BusinessUnits: undefined;
  BuildingUnits: undefined;
  Payments: undefined;
  PaymentDetails: { paymentId: string };
  AddPayment: undefined;
  ProcessPayment: { residentId: string };
  PaymentHistory: undefined;
  Chat: undefined;
  ChatConversation: { conversationId: string };
  NewConversation: undefined;
  Reports: undefined;
  ReportDetails: { reportId: string };
  NotificationsTab: undefined;
  NotificationDetails: { notificationId: string };
  NotificationSettings: undefined;
  MoreMain: undefined;
  Settings: undefined;
  InfoPointsScreen: undefined;
  PollsScreen: undefined;
  PollDetails: { pollId: string };
  ReportsStack: undefined;
  Messages: undefined;
  OrganizationChart: undefined;
  Profile: { userId: string };
  MD3ElevationShowcase: undefined;
  ChatTestScreen: undefined;
  Maintenance: undefined;
  MaintenanceRequests: undefined | { tab?: 'maintenance' | 'reports' };
  MaintenanceDetail: { requestId: string };
  MaintenanceForm: { unitId?: string };
  MaintenanceEdit: { requestId: string };
  MaintenanceWorkers: undefined;
  MaintenanceWorkerDetail: { workerId: string };
  MaintenanceAnalytics: undefined;
  MaintenanceReports: undefined;
}

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
  businessAccountId?: string;
  residentialUnits?: number;
  businessUnits?: number;
  status?: 'active' | 'maintenance' | 'development';
  adminAssigned?: boolean;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  floorArea?: number;
  floors?: number;
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
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
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

export interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  status: 'draft' | 'active' | 'expired' | 'closed';
  questions: PollQuestion[];
  targetAudience: {
    buildings?: string[];
    roles?: string[];
    all: boolean;
  };
  responseCount: number;
  isAnonymous: boolean;
}

export interface PollQuestion {
  id: string;
  type: 'multiple_choice' | 'single_choice' | 'rating' | 'text';
  text: string;
  options?: string[];
  required: boolean;
}

export interface PollResponse {
  id: string;
  pollId: string;
  userId: string;
  userName: string;
  createdAt: string;
  answers: PollAnswer[];
}

export interface PollAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface PollSummary {
  pollId: string;
  totalResponses: number;
  questionSummaries: {
    questionId: string;
    questionText: string;
    type: 'multiple_choice' | 'single_choice' | 'rating' | 'text';
    answers: {
      option?: string;
      count: number;
      percentage: number;
      textAnswers?: string[];
      averageRating?: number;
    }[];
  }[];
}

// Update BusinessManager tab params too
export type BusinessManagerTabParamList = {
  DashboardTab: undefined;
  BuildingsTab: NavigatorScreenParams<BusinessManagerStackParamList> | undefined;
  AdminsTab: NavigatorScreenParams<BusinessManagerStackParamList> | undefined;
  ChatTab: NavigatorScreenParams<{
    Chat: undefined;
    ChatConversation: { conversationId: string };
    NewConversation: undefined;
  }> | undefined;
  MoreTab: NavigatorScreenParams<BusinessManagerStackParamList> | undefined;
  MainTabs: undefined;
};

// Add a BusinessAccount interface
export interface BusinessAccount {
  id: string;
  name: string;
  description?: string;
  type: string;
  buildings: number;
  administrators: number;
  residents: number;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
  createdAt: string;
  performanceMetrics?: {
    occupancyRate: number;
    revenueGrowth: number;
    maintenanceCosts: number;
    tenantSatisfaction: number;
  };
  pendingIssues?: number;
}

export type AdministratorBottomTabParamList = {
  DashboardTab: undefined;
  UnitsTab: undefined;
  PaymentsTab: undefined;
  ChatTab: undefined;
  MoreTab: undefined;
}; 