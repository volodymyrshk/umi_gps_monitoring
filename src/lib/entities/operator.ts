/**
 * Operator/Driver entity definitions
 */

import { BaseEntity, ContactInfo } from './base';

export type LicenseType = 'tractor' | 'truck' | 'combine' | 'general';
export type EmploymentStatus = 'active' | 'inactive' | 'suspended' | 'terminated';

export interface Operator extends BaseEntity {
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId?: string;
  contact: ContactInfo;
  licenses: OperatorLicense[];
  employmentStatus: EmploymentStatus;
  hireDate: Date;
  assignedVehicleIds: string[];
  currentShift?: WorkShift;
  performance?: PerformanceMetrics;
}

export interface OperatorLicense {
  id: string;
  type: LicenseType;
  licenseNumber: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
  isValid: boolean;
}

export interface WorkShift {
  id: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // hours
  vehicleId?: string;
  taskIds: string[];
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface PerformanceMetrics {
  totalWorkingHours: number;
  fuelEfficiencyScore: number; // 0-100
  safetyScore: number; // 0-100
  punctualityScore: number; // 0-100
  completedTasks: number;
  lastEvaluationDate: Date;
}

export interface OperatorFilter {
  search?: string;
  employmentStatus?: EmploymentStatus;
  licenseType?: LicenseType;
  assignedVehicleId?: string;
  isOnShift?: boolean;
  hiredAfter?: Date;
  performanceScoreMin?: number;
}