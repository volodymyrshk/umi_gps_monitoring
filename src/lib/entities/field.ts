/**
 * Agricultural field and land parcel entity definitions
 */

import { BaseEntity, Location } from './base';

export type CropType = 'wheat' | 'corn' | 'sunflower' | 'barley' | 'soybean' | 'rapeseed' | 'sugar_beet' | 'potato';
export type SoilType = 'clay' | 'loam' | 'sand' | 'silt' | 'peat' | 'chalk';
export type FieldStatus = 'prepared' | 'sown' | 'growing' | 'harvested' | 'fallow';

export interface Field extends BaseEntity {
  name: string;
  cadastralNumber?: string;
  area: number; // hectares
  boundaries: Location[]; // polygon coordinates
  center: Location;
  cropInfo: CropInfo;
  soilInfo: SoilInfo;
  status: FieldStatus;
  ownerId?: string;
  leaseInfo?: LeaseInfo;
  irrigationInfo?: IrrigationInfo;
  assignedVehicleIds: string[];
  taskHistory: string[]; // task IDs
}

export interface CropInfo {
  currentCrop?: CropType;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  yield?: number; // tons per hectare
  quality?: CropQuality;
  rotationHistory: CropRotation[];
}

export interface CropRotation {
  year: number;
  crop: CropType;
  yield?: number;
  quality?: CropQuality;
}

export interface CropQuality {
  grade: 'A' | 'B' | 'C';
  moistureContent?: number; // percentage
  proteinContent?: number; // percentage
  notes?: string;
}

export interface SoilInfo {
  type: SoilType;
  phLevel?: number;
  organicMatter?: number; // percentage
  nitrogen?: number; // ppm
  phosphorus?: number; // ppm
  potassium?: number; // ppm
  lastTestDate?: Date;
}

export interface LeaseInfo {
  lessorId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  currency: string;
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
  contractId?: string;
}

export interface IrrigationInfo {
  hasIrrigation: boolean;
  type?: 'sprinkler' | 'drip' | 'flood' | 'center_pivot';
  waterSource?: string;
  lastIrrigationDate?: Date;
  totalWaterUsed?: number; // cubic meters
}

export interface FieldFilter {
  search?: string;
  cropType?: CropType;
  soilType?: SoilType;
  status?: FieldStatus;
  ownerId?: string;
  minArea?: number;
  maxArea?: number;
  hasIrrigation?: boolean;
  plantedAfter?: Date;
  location?: {
    center: Location;
    radius: number; // km
  };
}