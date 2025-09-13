/**
 * Real-time telemetry and sensor data structures
 */

export interface TelemetryRecord {
  vehicleId: string;
  operatorId?: string;
  taskId?: string;
  timestamp: Date;
  location: GpsData;
  movement: MovementData;
  engine: EngineData;
  fuel: FuelData;
  electrical: ElectricalData;
  implement?: ImplementData;
  environmental?: EnvironmentalData;
  events: TelemetryEvent[];
  quality: DataQuality;
}

export interface GpsData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number; // meters
  satellites: number;
  hdop?: number; // horizontal dilution of precision
  speed: number; // km/h from GPS
  heading: number; // degrees (0-360)
  fix: 'none' | '2d' | '3d' | 'dgps';
}

export interface MovementData {
  speed: number; // km/h from vehicle sensors
  odometer: number; // total km
  tripDistance: number; // km since trip start
  isMoving: boolean;
  direction: 'forward' | 'reverse' | 'stationary';
  accelerationX?: number; // g-force
  accelerationY?: number; // g-force
  accelerationZ?: number; // g-force
}

export interface EngineData {
  isRunning: boolean;
  rpm: number;
  loadPercentage?: number; // 0-100
  coolantTemperature?: number; // celsius
  oilPressure?: number; // bar
  engineHours: number; // total running hours
  fuelRate?: number; // liters per hour
  throttlePosition?: number; // percentage
}

export interface FuelData {
  level: number; // liters
  percentage: number; // 0-100
  consumption?: number; // liters per hour
  totalConsumed?: number; // liters since reset
  efficiency?: number; // km per liter
  temperature?: number; // celsius
  waterContent?: number; // percentage
}

export interface ElectricalData {
  batteryVoltage: number; // volts
  alternatorVoltage?: number; // volts
  batteryPercentage: number; // 0-100
  chargingStatus: 'charging' | 'discharging' | 'full' | 'unknown';
  powerConsumption?: number; // watts
}

export interface ImplementData {
  isActive: boolean;
  type: 'plow' | 'seeder' | 'sprayer' | 'harvester' | 'cultivator' | 'mower';
  position: 'raised' | 'lowered' | 'working';
  depth?: number; // cm
  width?: number; // meters
  speed?: number; // km/h
  rate?: number; // kg/ha or l/ha depending on implement
  pressure?: number; // bar for hydraulics
  blockages?: number; // count of blocked nozzles/sections
}

export interface EnvironmentalData {
  airTemperature?: number; // celsius
  humidity?: number; // percentage
  barometricPressure?: number; // hPa
  windSpeed?: number; // km/h
  windDirection?: number; // degrees
  rainfall?: number; // mm
  soilTemperature?: number; // celsius
  soilMoisture?: number; // percentage
}

export interface TelemetryEvent {
  type: EventType;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  data?: Record<string, any>;
  acknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export type EventType =
  | 'engine_start'
  | 'engine_stop'
  | 'speed_limit_exceeded'
  | 'geofence_entry'
  | 'geofence_exit'
  | 'fuel_theft_detected'
  | 'low_fuel_warning'
  | 'battery_low'
  | 'maintenance_due'
  | 'unauthorized_use'
  | 'accident_detected'
  | 'implement_malfunction'
  | 'gps_signal_lost'
  | 'sensor_offline'
  | 'task_started'
  | 'task_completed'
  | 'task_paused'
  | 'emergency_button'
  | 'driver_authenticated'
  | 'driver_logged_out';

export interface DataQuality {
  score: number; // 0-100
  gpsQuality: 'excellent' | 'good' | 'fair' | 'poor';
  sensorHealth: SensorHealth[];
  lastCalibration?: Date;
  dataCompleteness: number; // percentage of expected data points
}

export interface SensorHealth {
  sensorId: string;
  type: string;
  status: 'online' | 'offline' | 'error' | 'calibration_needed';
  lastReading: Date;
  batteryLevel?: number; // for wireless sensors
  signalStrength?: number; // for wireless sensors
}

export interface TelemetryStream {
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
  records: TelemetryRecord[];
  metadata: StreamMetadata;
}

export interface StreamMetadata {
  recordCount: number;
  frequency: number; // records per minute
  dataSize: number; // bytes
  compression?: string;
  checksum?: string;
  protocol: 'mqtt' | 'tcp' | 'udp' | 'http';
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  deviceId: string;
  model: string;
  firmwareVersion: string;
  protocolVersion: string;
  lastMaintenance?: Date;
  warrantyExpiry?: Date;
}