import { Types } from 'mongoose';

// Wallet interface (from Driver/Vendor entities)
export interface Wallet {
  balance: number;
  earnings?: number;
  totalEarned?: number;
  totalWithdrawn?: number;
  lastUpdated?: Date;
}

// Attendance interfaces
export interface AttendanceMatchQuery {
  employeeId?: Types.ObjectId;
  employeeModel?: string;
  date?: {
    $gte?: Date;
    $lte?: Date;
    $lt?: Date;
  };
  status?: string;
}

export interface AttendanceDocument {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  employeeModel: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  workHours?: number;
  overtimeHours?: number;
  isLate?: boolean;
  notes?: string;
  approvedBy?: Types.ObjectId;
  isManualEntry?: boolean;
}

// Leave Request interfaces
export interface LeaveRequestDocument {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  employeeModel: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  rejectionReason?: string;
  approvedBy?: Types.ObjectId;
  rejectedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedAt?: Date;
}

// Driver Leave Balance
export interface DriverLeaveBalance {
  annual: number;
  sick: number;
  emergency?: number;
}

// Driver with typed wallet
export interface DriverWithWallet {
  _id: Types.ObjectId;
  wallet?: Wallet;
  leaveBalance?: DriverLeaveBalance;
  [key: string]: any;
}

// Vendor with typed wallet
export interface VendorWithWallet {
  _id: Types.ObjectId;
  wallet?: Wallet;
  [key: string]: any;
}

// Store metadata
export interface StoreMetadata {
  referredBy?: string;
  [key: string]: any;
}

// Onboarding Application
export interface OnboardingDocument {
  _id: Types.ObjectId;
  businessName: string;
  status: 'pending' | 'approved' | 'rejected';
  referredBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  rejectedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  [key: string]: any;
}

// Aggregation Results
export interface AttendanceStats {
  _id: Types.ObjectId | string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
}

export interface StatusGroupResult {
  _id: string;
  count: number;
}

// Settings Query
export interface SettingsQuery {
  category?: string;
  isPublic?: boolean;
  key?: string;
}

// Shift Data
export interface ShiftData {
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  breakTimes?: {
    start: string;
    end: string;
    duration: number;
  };
  maxDrivers?: number;
  description?: string;
  color?: string;
}

