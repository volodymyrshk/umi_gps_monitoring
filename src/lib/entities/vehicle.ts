/**
 * Vehicle entity definitions for fleet management
 */

import { BaseEntity, Location, StatusInfo, ContactInfo } from './base';

export type VehicleType = 'tractor' | 'combine' | 'truck' | 'sprayer' | 'harvester' | 'seeder';
export type FuelType = 'diesel' | 'gasoline' | 'electric' | 'hybrid';
export type EngineType = 'diesel' | 'gasoline' | 'electric' | 'hybrid';

export interface VehicleSpecs {
  make: string;
  model: string;
  year: number;
  vin?: string;
  serialNumber?: string;
  engineType: EngineType;
  fuelType: FuelType;
  fuelCapacity: number; // liters
  powerRating?: number; // horsepower
  weight?: number; // kg
}

export interface Vehicle extends BaseEntity {
  name: string;
  displayName: string;
  type: VehicleType;
  specs: VehicleSpecs;
  registrationNumber?: string;
  currentLocation: Location;
  status: StatusInfo;
  ownerId?: string;
  operatorId?: string;
  assignedFieldIds: string[];
  sensors: VehicleSensor[];
  maintenanceInfo?: MaintenanceInfo;
}

export interface VehicleSensor {
  id: string;
  type: SensorType;
  name: string;
  unit: string;
  isActive: boolean;
  calibrationDate?: Date;
  nextCalibrationDate?: Date;
}

export type SensorType = 
  | 'gps'
  | 'fuel_level'
  | 'engine_rpm'
  | 'speed'
  | 'temperature'
  | 'battery'
  | 'working_time'
  | 'distance'
  | 'rfid'
  | 'implement_depth'
  | 'implement_width';

export interface MaintenanceInfo {
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  serviceInterval: number; // hours
  totalEngineHours: number;
  warrantyExpiry?: Date;
  serviceHistory: ServiceRecord[];
}

export interface ServiceRecord {
  id: string;
  date: Date;
  type: 'maintenance' | 'repair' | 'inspection';
  description: string;
  cost?: number;
  serviceProvider?: string;
  nextServiceDue?: Date;
}

export interface VehicleFilter {
  search?: string;
  type?: VehicleType;
  status?: StatusInfo['status'];
  operatorId?: string;
  ownerId?: string;
  batteryMin?: number;
  fuelMin?: number;
  lastUpdateAfter?: Date;
  isWorking?: boolean;
  location?: {
    center: Location;
    radius: number; // km
  };
}