/**
 * Data validation schemas for vehicle entities
 */

import { Vehicle, VehicleSpecs, VehicleType, FuelType } from '../entities/vehicle';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export class VehicleValidator {
  static validate(vehicle: Partial<Vehicle>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required fields validation
    if (!vehicle.name?.trim()) {
      errors.push({
        field: 'name',
        message: 'Vehicle name is required',
        code: 'REQUIRED_FIELD',
        value: vehicle.name
      });
    }

    if (!vehicle.id?.trim()) {
      errors.push({
        field: 'id',
        message: 'Vehicle ID is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!vehicle.type) {
      errors.push({
        field: 'type',
        message: 'Vehicle type is required',
        code: 'REQUIRED_FIELD'
      });
    } else if (!this.isValidVehicleType(vehicle.type)) {
      errors.push({
        field: 'type',
        message: `Invalid vehicle type: ${vehicle.type}`,
        code: 'INVALID_ENUM',
        value: vehicle.type
      });
    }

    // Specs validation
    if (vehicle.specs) {
      const specsValidation = this.validateSpecs(vehicle.specs);
      errors.push(...specsValidation.errors);
      warnings.push(...specsValidation.warnings);
    } else {
      errors.push({
        field: 'specs',
        message: 'Vehicle specifications are required',
        code: 'REQUIRED_FIELD'
      });
    }

    // Location validation
    if (vehicle.currentLocation) {
      const locationValidation = this.validateLocation(vehicle.currentLocation);
      errors.push(...locationValidation.errors);
      warnings.push(...locationValidation.warnings);
    }

    // Status validation
    if (vehicle.status) {
      const statusValidation = this.validateStatus(vehicle.status);
      errors.push(...statusValidation.errors);
    }

    // Business logic warnings
    if (vehicle.specs && vehicle.specs.year < 2000) {
      warnings.push({
        field: 'specs.year',
        message: 'Vehicle is very old, consider updating maintenance schedule',
        suggestion: 'Review maintenance intervals for older equipment'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateSpecs(specs: Partial<VehicleSpecs>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!specs.make?.trim()) {
      errors.push({
        field: 'specs.make',
        message: 'Vehicle make is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!specs.model?.trim()) {
      errors.push({
        field: 'specs.model',
        message: 'Vehicle model is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (specs.year) {
      if (specs.year < 1990 || specs.year > new Date().getFullYear() + 1) {
        errors.push({
          field: 'specs.year',
          message: 'Invalid year',
          code: 'INVALID_RANGE',
          value: specs.year
        });
      }
    }

    if (specs.fuelCapacity !== undefined) {
      if (specs.fuelCapacity <= 0 || specs.fuelCapacity > 10000) {
        errors.push({
          field: 'specs.fuelCapacity',
          message: 'Fuel capacity must be between 1 and 10000 liters',
          code: 'INVALID_RANGE',
          value: specs.fuelCapacity
        });
      }
    }

    if (specs.fuelType && !this.isValidFuelType(specs.fuelType)) {
      errors.push({
        field: 'specs.fuelType',
        message: `Invalid fuel type: ${specs.fuelType}`,
        code: 'INVALID_ENUM',
        value: specs.fuelType
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateLocation(location: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (typeof location.latitude !== 'number') {
      errors.push({
        field: 'currentLocation.latitude',
        message: 'Latitude must be a number',
        code: 'INVALID_TYPE'
      });
    } else if (location.latitude < -90 || location.latitude > 90) {
      errors.push({
        field: 'currentLocation.latitude',
        message: 'Latitude must be between -90 and 90',
        code: 'INVALID_RANGE',
        value: location.latitude
      });
    }

    if (typeof location.longitude !== 'number') {
      errors.push({
        field: 'currentLocation.longitude',
        message: 'Longitude must be a number',
        code: 'INVALID_TYPE'
      });
    } else if (location.longitude < -180 || location.longitude > 180) {
      errors.push({
        field: 'currentLocation.longitude',
        message: 'Longitude must be between -180 and 180',
        code: 'INVALID_RANGE',
        value: location.longitude
      });
    }

    if (location.accuracy !== undefined && location.accuracy < 0) {
      warnings.push({
        field: 'currentLocation.accuracy',
        message: 'GPS accuracy is negative, data quality may be poor'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateStatus(status: any): ValidationResult {
    const errors: ValidationError[] = [];

    if (!status.status) {
      errors.push({
        field: 'status.status',
        message: 'Status value is required',
        code: 'REQUIRED_FIELD'
      });
    } else {
      const validStatuses = ['online', 'offline', 'warning', 'maintenance', 'idle'];
      if (!validStatuses.includes(status.status)) {
        errors.push({
          field: 'status.status',
          message: `Invalid status: ${status.status}`,
          code: 'INVALID_ENUM',
          value: status.status
        });
      }
    }

    if (!status.lastUpdate || !(status.lastUpdate instanceof Date)) {
      errors.push({
        field: 'status.lastUpdate',
        message: 'Last update must be a valid Date',
        code: 'INVALID_TYPE'
      });
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }

  private static isValidVehicleType(type: string): type is VehicleType {
    const validTypes: VehicleType[] = ['tractor', 'combine', 'truck', 'sprayer', 'harvester', 'seeder'];
    return validTypes.includes(type as VehicleType);
  }

  private static isValidFuelType(type: string): type is FuelType {
    const validTypes: FuelType[] = ['diesel', 'gasoline', 'electric', 'hybrid'];
    return validTypes.includes(type as FuelType);
  }
}

export class VehicleBusinessRules {
  static validateForOperation(vehicle: Vehicle): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if vehicle is operational
    if (vehicle.status.status === 'offline') {
      errors.push({
        field: 'status',
        message: 'Vehicle is offline and cannot perform operations',
        code: 'VEHICLE_OFFLINE'
      });
    }

    if (vehicle.status.status === 'maintenance') {
      errors.push({
        field: 'status',
        message: 'Vehicle is under maintenance',
        code: 'VEHICLE_MAINTENANCE'
      });
    }

    // Check maintenance due
    if (vehicle.maintenanceInfo?.nextServiceDate && 
        vehicle.maintenanceInfo.nextServiceDate < new Date()) {
      warnings.push({
        field: 'maintenanceInfo',
        message: 'Vehicle maintenance is overdue',
        suggestion: 'Schedule maintenance before assigning new tasks'
      });
    }

    // Check operator assignment
    if (!vehicle.operatorId) {
      warnings.push({
        field: 'operatorId',
        message: 'No operator assigned to vehicle',
        suggestion: 'Assign a qualified operator before starting operations'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }
}