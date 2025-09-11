/**
 * Data validation schemas for telemetry data
 */

import { TelemetryRecord, GpsData, EngineData, FuelData } from '../telemetry/types';
import { ValidationResult, ValidationError, ValidationWarning } from './vehicle';

export class TelemetryValidator {
  static validate(record: Partial<TelemetryRecord>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required fields
    if (!record.vehicleId?.trim()) {
      errors.push({
        field: 'vehicleId',
        message: 'Vehicle ID is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!record.timestamp || !(record.timestamp instanceof Date)) {
      errors.push({
        field: 'timestamp',
        message: 'Valid timestamp is required',
        code: 'INVALID_TYPE'
      });
    } else {
      // Check if timestamp is too far in future or past
      const now = new Date();
      const diffMinutes = Math.abs(now.getTime() - record.timestamp.getTime()) / 60000;
      
      if (diffMinutes > 60) {
        warnings.push({
          field: 'timestamp',
          message: 'Timestamp is more than 1 hour off from current time',
          suggestion: 'Check device clock synchronization'
        });
      }
    }

    // GPS validation
    if (record.location) {
      const gpsValidation = this.validateGps(record.location);
      errors.push(...gpsValidation.errors);
      warnings.push(...gpsValidation.warnings);
    } else {
      errors.push({
        field: 'location',
        message: 'GPS location data is required',
        code: 'REQUIRED_FIELD'
      });
    }

    // Engine validation
    if (record.engine) {
      const engineValidation = this.validateEngine(record.engine);
      errors.push(...engineValidation.errors);
      warnings.push(...engineValidation.warnings);
    }

    // Fuel validation
    if (record.fuel) {
      const fuelValidation = this.validateFuel(record.fuel);
      errors.push(...fuelValidation.errors);
      warnings.push(...fuelValidation.warnings);
    }

    // Cross-field validation
    if (record.movement && record.location) {
      const crossValidation = this.validateCrossFields(record);
      warnings.push(...crossValidation.warnings);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateGps(gps: Partial<GpsData>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Coordinate validation
    if (typeof gps.latitude !== 'number') {
      errors.push({
        field: 'location.latitude',
        message: 'Latitude must be a number',
        code: 'INVALID_TYPE'
      });
    } else if (gps.latitude < -90 || gps.latitude > 90) {
      errors.push({
        field: 'location.latitude',
        message: 'Latitude must be between -90 and 90',
        code: 'INVALID_RANGE',
        value: gps.latitude
      });
    }

    if (typeof gps.longitude !== 'number') {
      errors.push({
        field: 'location.longitude',
        message: 'Longitude must be a number',
        code: 'INVALID_TYPE'
      });
    } else if (gps.longitude < -180 || gps.longitude > 180) {
      errors.push({
        field: 'location.longitude',
        message: 'Longitude must be between -180 and 180',
        code: 'INVALID_RANGE',
        value: gps.longitude
      });
    }

    // Accuracy validation
    if (gps.accuracy !== undefined) {
      if (gps.accuracy < 0) {
        errors.push({
          field: 'location.accuracy',
          message: 'GPS accuracy cannot be negative',
          code: 'INVALID_RANGE',
          value: gps.accuracy
        });
      } else if (gps.accuracy > 100) {
        warnings.push({
          field: 'location.accuracy',
          message: 'GPS accuracy is poor (>100m)',
          suggestion: 'Check GPS antenna and satellite visibility'
        });
      }
    }

    // Satellite count validation
    if (gps.satellites !== undefined) {
      if (gps.satellites < 4) {
        warnings.push({
          field: 'location.satellites',
          message: 'Low satellite count for reliable positioning',
          suggestion: 'Check GPS antenna position and clear sky view'
        });
      }
    }

    // Speed validation
    if (gps.speed !== undefined) {
      if (gps.speed < 0) {
        errors.push({
          field: 'location.speed',
          message: 'Speed cannot be negative',
          code: 'INVALID_RANGE',
          value: gps.speed
        });
      } else if (gps.speed > 100) {
        warnings.push({
          field: 'location.speed',
          message: 'Very high speed detected',
          suggestion: 'Verify speed sensor calibration'
        });
      }
    }

    // Heading validation
    if (gps.heading !== undefined) {
      if (gps.heading < 0 || gps.heading >= 360) {
        errors.push({
          field: 'location.heading',
          message: 'Heading must be between 0 and 359.99 degrees',
          code: 'INVALID_RANGE',
          value: gps.heading
        });
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateEngine(engine: Partial<EngineData>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // RPM validation
    if (engine.rpm !== undefined) {
      if (engine.rpm < 0) {
        errors.push({
          field: 'engine.rpm',
          message: 'RPM cannot be negative',
          code: 'INVALID_RANGE',
          value: engine.rpm
        });
      } else if (engine.rpm > 5000) {
        warnings.push({
          field: 'engine.rpm',
          message: 'Very high RPM detected',
          suggestion: 'Check engine operation and load conditions'
        });
      }
    }

    // Temperature validation
    if (engine.coolantTemperature !== undefined) {
      if (engine.coolantTemperature > 110) {
        warnings.push({
          field: 'engine.coolantTemperature',
          message: 'High coolant temperature detected',
          suggestion: 'Check cooling system and engine load'
        });
      } else if (engine.coolantTemperature < -40) {
        warnings.push({
          field: 'engine.coolantTemperature',
          message: 'Very low coolant temperature',
          suggestion: 'Check temperature sensor functionality'
        });
      }
    }

    // Load percentage validation
    if (engine.loadPercentage !== undefined) {
      if (engine.loadPercentage < 0 || engine.loadPercentage > 100) {
        errors.push({
          field: 'engine.loadPercentage',
          message: 'Load percentage must be between 0 and 100',
          code: 'INVALID_RANGE',
          value: engine.loadPercentage
        });
      }
    }

    // Engine hours validation
    if (engine.engineHours !== undefined && engine.engineHours < 0) {
      errors.push({
        field: 'engine.engineHours',
        message: 'Engine hours cannot be negative',
        code: 'INVALID_RANGE',
        value: engine.engineHours
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateFuel(fuel: Partial<FuelData>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Fuel level validation
    if (fuel.level !== undefined) {
      if (fuel.level < 0) {
        errors.push({
          field: 'fuel.level',
          message: 'Fuel level cannot be negative',
          code: 'INVALID_RANGE',
          value: fuel.level
        });
      }
    }

    // Percentage validation
    if (fuel.percentage !== undefined) {
      if (fuel.percentage < 0 || fuel.percentage > 100) {
        errors.push({
          field: 'fuel.percentage',
          message: 'Fuel percentage must be between 0 and 100',
          code: 'INVALID_RANGE',
          value: fuel.percentage
        });
      } else if (fuel.percentage < 10) {
        warnings.push({
          field: 'fuel.percentage',
          message: 'Low fuel level detected',
          suggestion: 'Schedule refueling soon'
        });
      }
    }

    // Consumption rate validation
    if (fuel.consumption !== undefined) {
      if (fuel.consumption < 0) {
        errors.push({
          field: 'fuel.consumption',
          message: 'Fuel consumption cannot be negative',
          code: 'INVALID_RANGE',
          value: fuel.consumption
        });
      } else if (fuel.consumption > 100) {
        warnings.push({
          field: 'fuel.consumption',
          message: 'Very high fuel consumption detected',
          suggestion: 'Check engine efficiency and operating conditions'
        });
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private static validateCrossFields(record: Partial<TelemetryRecord>): ValidationResult {
    const warnings: ValidationWarning[] = [];

    // Check if vehicle is moving but engine is off
    if (record.movement?.isMoving && record.engine && !record.engine.isRunning) {
      warnings.push({
        field: 'movement.isMoving',
        message: 'Vehicle appears to be moving with engine off',
        suggestion: 'Check GPS and engine sensors for accuracy'
      });
    }

    // Check if RPM is high but speed is very low
    if (record.engine?.rpm && record.engine.rpm > 2000 && 
        record.movement?.speed !== undefined && record.movement.speed < 1) {
      warnings.push({
        field: 'engine.rpm',
        message: 'High RPM with low speed may indicate slipping or implement load',
        suggestion: 'Check transmission and implement operation'
      });
    }

    // Check fuel consumption vs engine operation
    if (record.fuel?.consumption && record.fuel.consumption > 0 && 
        record.engine && !record.engine.isRunning) {
      warnings.push({
        field: 'fuel.consumption',
        message: 'Fuel consumption detected with engine off',
        suggestion: 'Check fuel sensor calibration'
      });
    }

    return { isValid: true, errors: [], warnings };
  }
}

export class TelemetryBusinessRules {
  static validateForStorage(record: TelemetryRecord): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check data freshness
    const now = new Date();
    const ageMinutes = (now.getTime() - record.timestamp.getTime()) / 60000;
    
    if (ageMinutes > 1440) { // 24 hours
      warnings.push({
        field: 'timestamp',
        message: 'Telemetry data is older than 24 hours',
        suggestion: 'Consider data retention policies'
      });
    }

    // Check data quality score
    if (record.quality && record.quality.score < 50) {
      warnings.push({
        field: 'quality.score',
        message: 'Low data quality score',
        suggestion: 'Review sensor health and calibration'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }
}