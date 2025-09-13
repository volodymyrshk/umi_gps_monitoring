/**
 * Enhanced Vehicle Service with DPL Integration
 * Combines traditional vehicle management with real-time DPL processing
 */

import { VehicleDataService, VehicleService, FleetSummary } from './vehicle';
import { getDPLService, DPLUtils, ProcessedVehicleData } from '../dpl';
import { Vehicle, VehicleFilter } from '../entities/vehicle';
import { RealtimeMetrics } from '../telemetry/types';

export interface EnhancedFleetSummary extends FleetSummary {
  // Additional DPL-powered metrics
  totalFuelConsumed: number;        // L consumed today
  totalDistanceCovered: number;     // km covered today  
  averageEcoScore: number;          // Fleet eco driving score
  averageSafetyScore: number;       // Fleet safety score
  driversAuthenticated: number;     // Count of authenticated drivers
  criticalAlerts: number;           // Critical alerts requiring attention
  fuelTheftAlerts: number;          // Fuel theft incidents today
  maintenanceOverdue: number;       // Vehicles with overdue maintenance
  connectionIssues: number;         // Vehicles with connection problems
}

export interface EnhancedVehicle extends Vehicle {
  // DPL-enhanced data
  processedData?: ProcessedVehicleData;
  realtimeMetrics: RealtimeMetrics & {
    // Additional DPL metrics
    engineRPM?: number;
    engineHours: number;
    fuelEfficiency: number;         // km/L
    drivingTime: number;            // minutes today
    idleTime: number;               // minutes today
    ecoScore: number;               // 0-100
    safetyScore: number;            // 0-100
    connectionQuality: number;      // 0-100%
  };
  driverInfo?: {
    isAuthenticated: boolean;
    driverId?: string;
    driverName?: string;
    shiftDuration?: number;         // minutes
    cardNumber?: string;
    loginTime?: Date;
  };
  alerts: {
    count: number;
    critical: number;
    warnings: number;
    details: string[];
    fuelTheft: boolean;
    lowFuel: boolean;
    maintenanceOverdue: boolean;
    connectionLost: boolean;
  };
}

export class EnhancedVehicleService extends VehicleDataService {
  private dplService = getDPLService();

  /**
   * Get all vehicles with enhanced DPL data
   */
  async getAll(filter?: VehicleFilter): Promise<EnhancedVehicle[]> {
    // Get base vehicles
    const baseVehicles = await super.getAll(filter);
    
    // Enhance with DPL data
    const enhancedVehicles: EnhancedVehicle[] = [];
    
    for (const vehicle of baseVehicles) {
      const enhanced = await this.enhanceVehicleWithDPL(vehicle);
      enhancedVehicles.push(enhanced);
    }

    return enhancedVehicles;
  }

  /**
   * Get single vehicle by ID with enhanced data
   */
  async getById(id: string): Promise<EnhancedVehicle | null> {
    const baseVehicle = await super.getById(id);
    if (!baseVehicle) return null;

    return await this.enhanceVehicleWithDPL(baseVehicle);
  }

  /**
   * Get enhanced fleet summary with DPL metrics
   */
  async getEnhancedFleetSummary(): Promise<EnhancedFleetSummary> {
    const baseSummary = await super.getFleetSummary();
    const dplOverview = this.dplService.getFleetOverview();
    const processedVehicles = this.dplService.getAllProcessedVehicles();
    const vehiclesWithAlerts = this.dplService.getVehiclesWithAlerts();

    // Calculate additional metrics
    const driversAuthenticated = processedVehicles.filter(v => v.driver.isAuthenticated).length;
    const criticalAlerts = processedVehicles.reduce((sum, v) => sum + v.status.alerts.critical, 0);
    const fuelTheftAlerts = processedVehicles.filter(v => v.fuel.alerts.possibleTheft).length;
    const maintenanceOverdue = processedVehicles.filter(v => v.maintenance.serviceOverdue).length;
    const connectionIssues = processedVehicles.filter(v => v.connection.status !== 'online').length;

    const enhancedSummary: EnhancedFleetSummary = {
      ...baseSummary,
      totalFuelConsumed: dplOverview.totalFuelConsumed,
      totalDistanceCovered: dplOverview.totalDistance,
      averageEcoScore: dplOverview.averageEcoScore,
      averageSafetyScore: this.calculateAverageSafetyScore(processedVehicles),
      driversAuthenticated,
      criticalAlerts,
      fuelTheftAlerts,
      maintenanceOverdue,
      connectionIssues
    };

    return enhancedSummary;
  }

  /**
   * Get vehicles with critical alerts
   */
  async getCriticalVehicles(): Promise<EnhancedVehicle[]> {
    const alertVehicles = this.dplService.getVehiclesWithAlerts();
    const criticalVehicles: EnhancedVehicle[] = [];

    for (const processedVehicle of alertVehicles) {
      const baseVehicle = await super.getById(processedVehicle.vehicleId);
      if (baseVehicle) {
        const enhanced = await this.enhanceVehicleWithDPL(baseVehicle, processedVehicle);
        if (enhanced.alerts.critical > 0 || enhanced.alerts.fuelTheft || enhanced.alerts.maintenanceOverdue) {
          criticalVehicles.push(enhanced);
        }
      }
    }

    return criticalVehicles;
  }

  /**
   * Get vehicles by connection status
   */
  async getVehiclesByConnectionStatus(status: 'online' | 'offline' | 'intermittent'): Promise<EnhancedVehicle[]> {
    const filteredVehicles = this.dplService.getVehiclesByStatus(
      status === 'online' ? 'healthy' : 'offline'
    );
    
    const enhancedVehicles: EnhancedVehicle[] = [];
    
    for (const processedVehicle of filteredVehicles) {
      if (processedVehicle.connection.status === status) {
        const baseVehicle = await super.getById(processedVehicle.vehicleId);
        if (baseVehicle) {
          const enhanced = await this.enhanceVehicleWithDPL(baseVehicle, processedVehicle);
          enhancedVehicles.push(enhanced);
        }
      }
    }

    return enhancedVehicles;
  }

  /**
   * Search vehicles with advanced DPL criteria
   */
  async searchVehiclesAdvanced(criteria: {
    driverId?: string;
    fuelLevel?: { min?: number; max?: number };
    ecoScore?: { min?: number; max?: number };
    location?: { lat: number; lng: number; radius: number };
    engineHours?: { min?: number; max?: number };
    maintenanceStatus?: 'due' | 'overdue' | 'ok';
    connectionStatus?: 'online' | 'offline' | 'intermittent';
  }): Promise<EnhancedVehicle[]> {
    // Use DPL search capabilities
    const searchResults = this.dplService.searchVehicles({
      driverId: criteria.driverId,
      fuelLevel: criteria.fuelLevel,
      location: criteria.location
    });

    const enhancedVehicles: EnhancedVehicle[] = [];

    for (const processedVehicle of searchResults) {
      // Apply additional filters
      if (criteria.ecoScore) {
        const ecoScore = processedVehicle.behavior.ecoScore;
        if (criteria.ecoScore.min && ecoScore < criteria.ecoScore.min) continue;
        if (criteria.ecoScore.max && ecoScore > criteria.ecoScore.max) continue;
      }

      if (criteria.engineHours) {
        const engineHours = processedVehicle.engine.engineHours;
        if (criteria.engineHours.min && engineHours < criteria.engineHours.min) continue;
        if (criteria.engineHours.max && engineHours > criteria.engineHours.max) continue;
      }

      if (criteria.maintenanceStatus) {
        const isOverdue = processedVehicle.maintenance.serviceOverdue;
        const isDue = processedVehicle.maintenance.kmUntilNextService < 1000;
        
        if (criteria.maintenanceStatus === 'overdue' && !isOverdue) continue;
        if (criteria.maintenanceStatus === 'due' && !isDue) continue;
        if (criteria.maintenanceStatus === 'ok' && (isOverdue || isDue)) continue;
      }

      if (criteria.connectionStatus && processedVehicle.connection.status !== criteria.connectionStatus) {
        continue;
      }

      const baseVehicle = await super.getById(processedVehicle.vehicleId);
      if (baseVehicle) {
        const enhanced = await this.enhanceVehicleWithDPL(baseVehicle, processedVehicle);
        enhancedVehicles.push(enhanced);
      }
    }

    return enhancedVehicles;
  }

  /**
   * Get vehicle events history
   */
  async getVehicleEvents(vehicleId: string, limit = 20) {
    return this.dplService.getVehicleEvents(vehicleId, limit);
  }

  /**
   * Get real-time metrics enhanced with DPL data
   */
  async getEnhancedRealtimeMetrics(vehicleId: string): Promise<EnhancedVehicle['realtimeMetrics'] | null> {
    const baseMetrics = await super.getRealtimeMetrics(vehicleId);
    const processedData = this.dplService.getVehicleData(vehicleId);

    if (!baseMetrics || !processedData) return null;

    return {
      ...baseMetrics,
      engineRPM: processedData.engine.rpm,
      engineHours: processedData.engine.engineHours,
      fuelEfficiency: processedData.fuel.fuelEvents.length > 0 ? 
        processedData.metrics.efficiency.fuelPerKm : 8.5,
      drivingTime: processedData.location.movement.drivingTime,
      idleTime: processedData.location.movement.idleTime,
      ecoScore: processedData.behavior.ecoScore,
      safetyScore: processedData.behavior.safetyScore,
      connectionQuality: processedData.connection.connectionQuality.uptime
    };
  }

  /**
   * Enhance a base vehicle with DPL data
   */
  private async enhanceVehicleWithDPL(
    baseVehicle: Vehicle, 
    processedData?: ProcessedVehicleData
  ): Promise<EnhancedVehicle> {
    // Get processed data from DPL if not provided
    if (!processedData) {
      processedData = this.dplService.getVehicleData(baseVehicle.id);
    }

    // Get enhanced realtime metrics
    const realtimeMetrics = await this.getEnhancedRealtimeMetrics(baseVehicle.id);

    const enhanced: EnhancedVehicle = {
      ...baseVehicle,
      processedData,
      realtimeMetrics: realtimeMetrics || {
        ...await super.getRealtimeMetrics(baseVehicle.id),
        engineHours: 0,
        fuelEfficiency: 8.5,
        drivingTime: 0,
        idleTime: 0,
        ecoScore: 100,
        safetyScore: 100,
        connectionQuality: 95
      } as any,
      driverInfo: processedData ? {
        isAuthenticated: processedData.driver.isAuthenticated,
        driverId: processedData.driver.driverId,
        driverName: processedData.driver.driverName,
        shiftDuration: processedData.driver.shiftDuration,
        cardNumber: processedData.driver.cardNumber,
        loginTime: processedData.driver.loginTime
      } : {
        isAuthenticated: false
      },
      alerts: this.buildAlerts(processedData)
    };

    return enhanced;
  }

  /**
   * Build alerts from processed data
   */
  private buildAlerts(processedData?: ProcessedVehicleData) {
    if (!processedData) {
      return {
        count: 0,
        critical: 0,
        warnings: 0,
        details: [],
        fuelTheft: false,
        lowFuel: false,
        maintenanceOverdue: false,
        connectionLost: false
      };
    }

    const details: string[] = [];
    
    if (processedData.fuel.alerts.lowFuel) {
      details.push(`Low fuel level: ${Math.round(processedData.fuel.currentLevel)}%`);
    }
    
    if (processedData.fuel.alerts.possibleTheft) {
      details.push('Possible fuel theft detected');
    }
    
    if (processedData.maintenance.serviceOverdue) {
      details.push('Maintenance overdue');
    }
    
    if (processedData.connection.status === 'offline') {
      details.push('Connection lost');
    }
    
    if (processedData.engine.diagnostics.criticalIssues.length > 0) {
      details.push(...processedData.engine.diagnostics.criticalIssues);
    }

    return {
      count: processedData.status.alerts.count,
      critical: processedData.status.alerts.critical,
      warnings: processedData.status.alerts.warnings,
      details,
      fuelTheft: processedData.fuel.alerts.possibleTheft,
      lowFuel: processedData.fuel.alerts.lowFuel,
      maintenanceOverdue: processedData.maintenance.serviceOverdue,
      connectionLost: processedData.connection.status === 'offline'
    };
  }

  /**
   * Calculate average safety score across fleet
   */
  private calculateAverageSafetyScore(processedVehicles: ProcessedVehicleData[]): number {
    if (processedVehicles.length === 0) return 0;
    const total = processedVehicles.reduce((sum, v) => sum + v.behavior.safetyScore, 0);
    return Math.round(total / processedVehicles.length);
  }

  /**
   * Generate fleet efficiency report
   */
  async getFleetEfficiencyReport(days = 7) {
    const processedVehicles = this.dplService.getAllProcessedVehicles();
    
    const totalDistance = processedVehicles.reduce((sum, v) => sum + v.metrics.weeklyDistance, 0);
    const totalFuel = processedVehicles.reduce((sum, v) => sum + (v.metrics.dailyFuel * days), 0);
    const totalDrivingTime = processedVehicles.reduce((sum, v) => sum + v.metrics.dailyDrivingTime, 0);
    const totalIdleTime = processedVehicles.reduce((sum, v) => sum + v.metrics.dailyIdleTime, 0);
    const avgEcoScore = processedVehicles.reduce((sum, v) => sum + v.behavior.ecoScore, 0) / processedVehicles.length;
    
    return {
      period: { days },
      fleet: {
        totalVehicles: processedVehicles.length,
        totalDistance: Math.round(totalDistance),
        totalFuelConsumed: Math.round(totalFuel),
        totalDrivingHours: Math.round(totalDrivingTime / 60),
        totalIdleHours: Math.round(totalIdleTime / 60),
        averageEcoScore: Math.round(avgEcoScore)
      },
      efficiency: {
        fuelEfficiency: totalDistance > 0 ? Math.round((totalDistance / totalFuel) * 100) / 100 : 0, // km/L
        utilizationRate: totalDrivingTime > 0 ? Math.round((totalDrivingTime / (totalDrivingTime + totalIdleTime)) * 100) : 0, // %
        costPerKm: totalDistance > 0 ? Math.round((totalFuel * 1.5 / totalDistance) * 100) / 100 : 0, // assuming $1.5/L
      },
      topPerformers: processedVehicles
        .sort((a, b) => b.behavior.ecoScore - a.behavior.ecoScore)
        .slice(0, 5)
        .map(v => ({
          vehicleId: v.vehicleId,
          vehicleName: v.vehicleName,
          ecoScore: v.behavior.ecoScore,
          fuelEfficiency: v.metrics.efficiency.fuelPerKm
        })),
      alerts: {
        fuelThefts: processedVehicles.filter(v => v.fuel.alerts.possibleTheft).length,
        lowFuelVehicles: processedVehicles.filter(v => v.fuel.alerts.lowFuel).length,
        maintenanceOverdue: processedVehicles.filter(v => v.maintenance.serviceOverdue).length,
        connectionIssues: processedVehicles.filter(v => v.connection.status !== 'online').length
      }
    };
  }

  /**
   * Get driver performance report
   */
  async getDriverPerformanceReport(driverId?: string) {
    const processedVehicles = driverId ? 
      this.dplService.getAllProcessedVehicles().filter(v => v.driver.driverId === driverId) :
      this.dplService.getAllProcessedVehicles().filter(v => v.driver.isAuthenticated);

    return processedVehicles.map(vehicle => ({
      vehicleId: vehicle.vehicleId,
      vehicleName: vehicle.vehicleName,
      driverId: vehicle.driver.driverId,
      driverName: vehicle.driver.driverName,
      shiftDuration: vehicle.driver.shiftDuration,
      drivingTime: vehicle.driver.drivingTime,
      ecoScore: vehicle.behavior.ecoScore,
      safetyScore: vehicle.behavior.safetyScore,
      events: vehicle.behavior.events,
      fuelEfficiency: vehicle.metrics.efficiency.fuelPerKm,
      distanceCovered: vehicle.metrics.dailyDistance,
      alerts: {
        harshDriving: vehicle.behavior.events.harshAcceleration + 
                     vehicle.behavior.events.harshBraking + 
                     vehicle.behavior.events.harshCornering,
        overspeeding: vehicle.behavior.events.overspeeding
      }
    }));
  }
}