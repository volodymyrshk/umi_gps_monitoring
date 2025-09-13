// Simplified DPL types for debugging
export interface TrackerDataPacket {
  timestamp: number;
  longitude: number;
  latitude: number;
  speed: number;
  fuel_level: number;
  engine_on: boolean;
  rfid_id?: string;
}

export interface ProcessedVehicleData {
  deviceId: string;
  vehicleId: string;
  drivingTime: number;
  fuelConsumption: number;
  rpm: number;
  isDriverAuthenticated: boolean;
  connectionStatus: 'connected' | 'disconnected';
  motorHours: number;
}