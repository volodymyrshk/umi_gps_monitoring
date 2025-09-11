/**
 * Telemetry data aggregation and analytics structures
 */

import { TelemetryRecord, TelemetryEvent } from './types';

export interface AggregatedTelemetry {
  vehicleId: string;
  period: TimePeriod;
  startTime: Date;
  endTime: Date;
  recordCount: number;
  metrics: AggregatedMetrics;
  events: EventSummary;
  alerts: AlertSummary[];
}

export interface TimePeriod {
  type: 'hour' | 'day' | 'week' | 'month' | 'year';
  value: number;
  label: string;
}

export interface AggregatedMetrics {
  distance: DistanceMetrics;
  fuel: FuelMetrics;
  engine: EngineMetrics;
  efficiency: EfficiencyMetrics;
  utilization: UtilizationMetrics;
  location: LocationMetrics;
}

export interface DistanceMetrics {
  total: number; // km
  working: number; // km while implement active
  transport: number; // km while implement inactive
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  speedDistribution: SpeedBucket[];
}

export interface SpeedBucket {
  minSpeed: number;
  maxSpeed: number;
  duration: number; // minutes
  distance: number; // km
  percentage: number; // of total time
}

export interface FuelMetrics {
  totalConsumed: number; // liters
  averageConsumption: number; // l/h
  efficiency: number; // l/km
  idleFuelWaste: number; // liters
  fuelCost?: number;
  refuelEvents: number;
}

export interface EngineMetrics {
  totalRuntime: number; // hours
  averageRpm: number;
  maxRpm: number;
  loadDistribution: LoadBucket[];
  temperatureStats: TemperatureStats;
  maintenanceAlerts: number;
}

export interface LoadBucket {
  minLoad: number;
  maxLoad: number;
  duration: number; // minutes
  percentage: number;
}

export interface TemperatureStats {
  average: number;
  min: number;
  max: number;
  overheatingEvents: number;
}

export interface EfficiencyMetrics {
  productivityScore: number; // 0-100
  fuelEfficiencyScore: number; // 0-100
  workQualityScore: number; // 0-100
  overallScore: number; // 0-100
  benchmarkComparison?: BenchmarkComparison;
}

export interface BenchmarkComparison {
  fleetAverage: number;
  industryAverage?: number;
  percentileRank: number; // 0-100
  improvementPotential: number; // percentage
}

export interface UtilizationMetrics {
  workingTime: number; // hours
  idleTime: number; // hours
  transportTime: number; // hours
  maintenanceTime: number; // hours
  utilizationRate: number; // percentage
  availabilityRate: number; // percentage
}

export interface LocationMetrics {
  fieldsVisited: string[];
  geofenceViolations: number;
  centerPoint: { latitude: number; longitude: number };
  workingRadius: number; // km
  routeEfficiency: number; // percentage
}

export interface EventSummary {
  totalEvents: number;
  eventsByType: EventTypeSummary[];
  severityDistribution: SeverityDistribution;
  acknowledgedCount: number;
  unresolvedCount: number;
}

export interface EventTypeSummary {
  type: string;
  count: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  firstOccurrence: Date;
  lastOccurrence: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SeverityDistribution {
  info: number;
  warning: number;
  error: number;
  critical: number;
}

export interface AlertSummary {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  firstTriggered: Date;
  lastTriggered: Date;
  occurrenceCount: number;
  status: 'active' | 'acknowledged' | 'resolved';
  impact: AlertImpact;
}

export interface AlertImpact {
  category: 'safety' | 'efficiency' | 'cost' | 'compliance';
  estimatedCostImpact?: number;
  recommendedAction?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface TelemetryQuery {
  vehicleIds?: string[];
  startTime: Date;
  endTime: Date;
  eventTypes?: string[];
  aggregation?: AggregationLevel;
  metrics?: string[];
  filters?: TelemetryFilter[];
}

export interface AggregationLevel {
  timeWindow: 'minute' | 'hour' | 'day' | 'week' | 'month';
  groupBy?: ('vehicleId' | 'operatorId' | 'fieldId' | 'taskId')[];
}

export interface TelemetryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

export interface RealtimeMetrics {
  vehicleId: string;
  timestamp: Date;
  isOnline: boolean;
  currentSpeed: number;
  currentLocation: { latitude: number; longitude: number };
  fuelLevel: number;
  engineRpm: number;
  batteryLevel: number;
  activeAlerts: number;
  workingStatus: 'working' | 'idle' | 'transport' | 'maintenance';
  efficiency: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    comparison: number; // vs fleet average
  };
}