/**
 * Vehicle data service layer
 */

import { Vehicle, VehicleFilter, VehicleSpecs } from '../entities/vehicle';
import { Operator } from '../entities/operator';
import { TelemetryRecord, RealtimeMetrics } from '../telemetry/types';
import { VehicleValidator, VehicleBusinessRules } from '../validators/vehicle';

export interface VehicleService {
  // CRUD operations
  getAll(filter?: VehicleFilter): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle>;
  update(id: string, updates: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: string): Promise<boolean>;

  // Real-time data
  getRealtimeMetrics(vehicleId: string): Promise<RealtimeMetrics | null>;
  getLatestTelemetry(vehicleId: string): Promise<TelemetryRecord | null>;
  
  // Business operations
  assignOperator(vehicleId: string, operatorId: string): Promise<boolean>;
  assignToField(vehicleId: string, fieldId: string): Promise<boolean>;
  updateStatus(vehicleId: string, status: string, message?: string): Promise<boolean>;
  
  // Analytics
  getFleetSummary(): Promise<FleetSummary>;
  getVehicleUtilization(vehicleId: string, days: number): Promise<UtilizationReport>;
}

export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  onlineVehicles: number;
  warningVehicles: number;
  offlineVehicles: number;
  maintenanceVehicles: number;
  averageFuelLevel: number;
  totalEngineHours: number;
  vehiclesByType: Record<string, number>;
  recentAlerts: number;
}

export interface UtilizationReport {
  vehicleId: string;
  period: { start: Date; end: Date };
  totalHours: number;
  workingHours: number;
  idleHours: number;
  transportHours: number;
  maintenanceHours: number;
  utilizationRate: number; // percentage
  fuelConsumption: number; // liters
  distanceCovered: number; // km
  tasksCompleted: number;
  efficiency: {
    fuelPerHour: number;
    fuelPerKm: number;
    hoursPerTask: number;
  };
}

export class VehicleDataService implements VehicleService {
  private vehicles: Map<string, Vehicle> = new Map();
  private realtimeData: Map<string, RealtimeMetrics> = new Map();

  async getAll(filter?: VehicleFilter): Promise<Vehicle[]> {
    let vehicles = Array.from(this.vehicles.values());

    if (!filter) return vehicles;

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      vehicles = vehicles.filter(v => 
        v.name.toLowerCase().includes(searchLower) ||
        v.displayName.toLowerCase().includes(searchLower) ||
        v.specs.make.toLowerCase().includes(searchLower) ||
        v.specs.model.toLowerCase().includes(searchLower)
      );
    }

    if (filter.type) {
      vehicles = vehicles.filter(v => v.type === filter.type);
    }

    if (filter.status) {
      vehicles = vehicles.filter(v => v.status.status === filter.status);
    }

    if (filter.operatorId) {
      vehicles = vehicles.filter(v => v.operatorId === filter.operatorId);
    }

    if (filter.ownerId) {
      vehicles = vehicles.filter(v => v.ownerId === filter.ownerId);
    }

    if (filter.batteryMin !== undefined) {
      vehicles = vehicles.filter(v => {
        const metrics = this.realtimeData.get(v.id);
        return metrics && metrics.batteryLevel >= filter.batteryMin!;
      });
    }

    if (filter.fuelMin !== undefined) {
      vehicles = vehicles.filter(v => {
        const metrics = this.realtimeData.get(v.id);
        return metrics && metrics.fuelLevel >= filter.fuelMin!;
      });
    }

    if (filter.isWorking !== undefined) {
      vehicles = vehicles.filter(v => {
        const metrics = this.realtimeData.get(v.id);
        return metrics && (metrics.workingStatus === 'working') === filter.isWorking;
      });
    }

    if (filter.location) {
      vehicles = vehicles.filter(v => {
        const distance = this.calculateDistance(
          v.currentLocation,
          filter.location!.center
        );
        return distance <= filter.location!.radius * 1000; // convert km to meters
      });
    }

    return vehicles;
  }

  async getById(id: string): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  async create(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    // Validate vehicle data
    const validation = VehicleValidator.validate(vehicleData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const vehicle: Vehicle = {
      ...vehicleData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const existing = this.vehicles.get(id);
    if (!existing) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    // Validate updated vehicle
    const validation = VehicleValidator.validate(updated);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    this.vehicles.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  async getRealtimeMetrics(vehicleId: string): Promise<RealtimeMetrics | null> {
    return this.realtimeData.get(vehicleId) || null;
  }

  async getLatestTelemetry(vehicleId: string): Promise<TelemetryRecord | null> {
    // In real implementation, this would query the telemetry database
    // for the most recent record for this vehicle
    return null;
  }

  async assignOperator(vehicleId: string, operatorId: string): Promise<boolean> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return false;

    await this.update(vehicleId, { operatorId });
    return true;
  }

  async assignToField(vehicleId: string, fieldId: string): Promise<boolean> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return false;

    const updatedFieldIds = [...vehicle.assignedFieldIds];
    if (!updatedFieldIds.includes(fieldId)) {
      updatedFieldIds.push(fieldId);
    }

    await this.update(vehicleId, { assignedFieldIds: updatedFieldIds });
    return true;
  }

  async updateStatus(vehicleId: string, status: string, message?: string): Promise<boolean> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) return false;

    const statusInfo = {
      ...vehicle.status,
      status: status as any,
      lastUpdate: new Date(),
      message
    };

    await this.update(vehicleId, { status: statusInfo });
    return true;
  }

  async getFleetSummary(): Promise<FleetSummary> {
    const vehicles = Array.from(this.vehicles.values());
    const realtimeMetrics = Array.from(this.realtimeData.values());

    const summary: FleetSummary = {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.isActive).length,
      onlineVehicles: vehicles.filter(v => v.status.status === 'online').length,
      warningVehicles: vehicles.filter(v => v.status.status === 'warning').length,
      offlineVehicles: vehicles.filter(v => v.status.status === 'offline').length,
      maintenanceVehicles: vehicles.filter(v => v.status.status === 'maintenance').length,
      averageFuelLevel: this.calculateAverageFuelLevel(realtimeMetrics),
      totalEngineHours: vehicles.reduce((sum, v) => sum + (v.maintenanceInfo?.totalEngineHours || 0), 0),
      vehiclesByType: this.groupVehiclesByType(vehicles),
      recentAlerts: realtimeMetrics.reduce((sum, m) => sum + m.activeAlerts, 0)
    };

    return summary;
  }

  async getVehicleUtilization(vehicleId: string, days: number): Promise<UtilizationReport> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // In real implementation, this would query telemetry data for the period
    // and calculate actual utilization metrics
    
    const mockReport: UtilizationReport = {
      vehicleId,
      period: { start: startDate, end: endDate },
      totalHours: days * 24,
      workingHours: days * 8, // 8 hours per day working
      idleHours: days * 2, // 2 hours idle per day
      transportHours: days * 1, // 1 hour transport per day
      maintenanceHours: days * 0.5, // 30 min maintenance per day
      utilizationRate: 33.3, // 8 out of 24 hours
      fuelConsumption: days * 50, // 50L per day
      distanceCovered: days * 100, // 100km per day
      tasksCompleted: Math.floor(days * 2), // 2 tasks per day
      efficiency: {
        fuelPerHour: 6.25, // 50L / 8h
        fuelPerKm: 0.5, // 50L / 100km
        hoursPerTask: 4 // 8h / 2 tasks
      }
    };

    return mockReport;
  }

  private calculateDistance(point1: any, point2: any): number {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = point1.latitude * Math.PI / 180;
    const lat2Rad = point2.latitude * Math.PI / 180;
    const deltaLatRad = (point2.latitude - point1.latitude) * Math.PI / 180;
    const deltaLonRad = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private calculateAverageFuelLevel(metrics: RealtimeMetrics[]): number {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, m) => sum + m.fuelLevel, 0);
    return total / metrics.length;
  }

  private groupVehiclesByType(vehicles: Vehicle[]): Record<string, number> {
    const groups: Record<string, number> = {};
    vehicles.forEach(v => {
      groups[v.type] = (groups[v.type] || 0) + 1;
    });
    return groups;
  }

  private generateId(): string {
    return `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility method to seed with initial data
  seedWithMockData(vehicles: Vehicle[]) {
    vehicles.forEach(vehicle => {
      this.vehicles.set(vehicle.id, vehicle);
    });
  }

  // Utility method to update realtime metrics
  updateRealtimeMetrics(vehicleId: string, metrics: RealtimeMetrics) {
    this.realtimeData.set(vehicleId, metrics);
  }
}