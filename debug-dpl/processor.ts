import { TrackerDataPacket, ProcessedVehicleData } from './types';

export class VehicleDataProcessor {
  private vehicleStates: Map<string, any> = new Map();

  processData(deviceId: string, data: TrackerDataPacket): ProcessedVehicleData {
    const prevState = this.vehicleStates.get(deviceId) || {
      lastTimestamp: 0,
      totalDrivingTime: 0,
      totalFuelUsed: 0,
      motorHours: 0
    };

    const timeDiff = (data.timestamp - prevState.lastTimestamp) / 1000 / 60; // minutes
    
    const processed: ProcessedVehicleData = {
      deviceId,
      vehicleId: `vehicle_${deviceId}`,
      drivingTime: data.speed > 0 ? prevState.totalDrivingTime + timeDiff : prevState.totalDrivingTime,
      fuelConsumption: this.calculateFuelConsumption(data.speed, timeDiff),
      rpm: this.calculateRPM(data.speed),
      isDriverAuthenticated: !!data.rfid_id,
      connectionStatus: 'connected',
      motorHours: data.engine_on ? prevState.motorHours + (timeDiff / 60) : prevState.motorHours
    };

    this.vehicleStates.set(deviceId, {
      lastTimestamp: data.timestamp,
      totalDrivingTime: processed.drivingTime,
      totalFuelUsed: processed.fuelConsumption,
      motorHours: processed.motorHours
    });

    return processed;
  }

  private calculateFuelConsumption(speed: number, timeMinutes: number): number {
    const baseConsumption = 8; // L/100km
    const speedMultiplier = speed > 60 ? 1.2 : 1.0;
    const distance = (speed * timeMinutes) / 60; // km
    return (distance * baseConsumption * speedMultiplier) / 100;
  }

  private calculateRPM(speed: number): number {
    return Math.round(speed * 40 + 800); // Simple RPM calculation
  }
}