/**
 * Base entity interfaces and types for the U-Monitoring system
 */

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface MetricValue {
  value: number;
  unit: string;
  timestamp: Date;
  quality: 'good' | 'fair' | 'poor';
}

export type StatusType = 'online' | 'offline' | 'warning' | 'maintenance' | 'idle';

export interface StatusInfo {
  status: StatusType;
  lastUpdate: Date;
  message?: string;
  code?: string;
}