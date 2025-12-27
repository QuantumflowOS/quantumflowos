export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  PENDING = 'Pending'
}

export enum Priority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export type AutomationStatus = 'idle' | 'analyzing' | 'executing' | 'completed' | 'failed';

export type SLATier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export type UserRole = 'admin' | 'technician' | 'customer';

export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  theme: 'light' | 'dark';
  compactMode: boolean;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  status: 'Online' | 'Offline' | 'Degraded';
  devices: number;
  lastPing: string;
  connectionType: string;
  slaTier: SLATier;
  phoneNumber: string; // For IVR lookup
  outstandingBalance: number; // For credit control logic
  primaryContact?: string;
  email?: string;
  accountManager?: string;
  address?: string;
  settings?: UserSettings;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  items: string[];
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string; 
  clientSla: SLATier;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  assignedTo?: string;
  automationStatus: AutomationStatus;
  aiAnalysis?: string;
  suggestedAction?: string;
  // New features
  isEscalated?: boolean;
  escalationReason?: string;
  rating?: number; // 1-5
  feedback?: string;
  type?: 'Fault' | 'General Query' | 'Billing';
}

export interface Note {
  id: string;
  parentId: string; // ClientID or TicketID
  author: string;
  content: string;
  timestamp: string;
  isPrivate: boolean; // Internal vs Client visible
}

export interface NetworkMetric {
  time: string;
  latency: number;
  packetLoss: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- CRM & ASSET TYPES ---

export interface NetworkAsset {
  id: string;
  clientId: string;
  name: string;
  type: 'Router' | 'Switch' | 'Firewall' | 'Access Point' | 'Server';
  model: string;
  ipAddress: string;
  macAddress: string;
  serial: string;
  firmware: string;
  status: 'Online' | 'Offline' | 'Warning';
  lastSeen: string;
  credentials?: { // Added for Router Interface Integration
      username: string;
      passwordHash: string; // Simulated
      port: number;
  };
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: 'Contract' | 'SLA' | 'Diagram' | 'Invoice';
  uploadDate: string;
  size: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  technician: string;
  clientId: string;
  clientName: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  type: 'Onsite' | 'Remote' | 'Maintenance';
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  clientId?: string; // Links a user to a specific Client entity
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  slaTier: SLATier;
  features: string[];
  recommended?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Router' | 'Switch' | 'Access Point' | 'Cabling' | 'License';
  brand: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Network' | 'VoIP' | 'Security' | 'Billing' | 'SOP';
  tags: string[];
  content: string;
  author: string;
  lastUpdated: string;
  views: number;
}

// --- MICROSOFT 365 TYPES ---

export interface M365User {
    id: string;
    displayName: string;
    userPrincipalName: string;
    licenses: string[];
    status: 'Active' | 'Blocked' | 'Unlicensed';
    lastLogin: string;
    department: string;
}

export interface M365ServiceHealth {
    service: string;
    status: 'Healthy' | 'Degraded' | 'Incident';
    lastUpdated: string;
}

// --- CONFIG MANAGER TYPES ---

export interface ConfigBackup {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  content: string;
  changes: number;
  author: string;
  isComplianceViolation?: boolean;
}

// --- IPAM TYPES ---

export interface Subnet {
  id: string;
  name: string;
  clientId: string;
  cidr: string;
  gateway: string;
  vlanId: number;
  utilization: number; // percentage
  location: string;
  type: 'LAN' | 'WAN' | 'DMZ' | 'Voice';
}

export interface IPNode {
  ip: string;
  status: 'Available' | 'Assigned' | 'Reserved' | 'DHCP' | 'Gateway' | 'Broadcast';
  deviceId?: string;
  deviceName?: string;
  mac?: string;
  lastSeen?: string;
  description?: string;
}

// --- THIRD PARTY SERVICES ---

export interface ThirdPartyService {
  id: string;
  clientId: string;
  serviceName: string;
  provider: string;
  accountNumber: string;
  supportContact: string;
  portalUrl?: string;
  notes?: string;
  expiryDate?: string;
  category: 'ISP' | 'VoIP' | 'Cloud' | 'Security' | 'Other';
}