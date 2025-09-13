// Simple DPL implementation without complex dependencies
export interface TrackerData {
  deviceId: string;
  timestamp: number;
  location: { lat: number; lng: number };
  speed: number;
  fuel: number;
  engineOn: boolean;
  driverRfid?: string;
}

export interface ProcessedData {
  deviceId: string;
  drivingTimeMinutes: number;
  fuelConsumptionL: number;
  estimatedRpm: number;
  hasAuthenticatedDriver: boolean;
  connectionOk: boolean;
  motorHours: number;
}

class SimpleDPL {
  private states = new Map<string, any>();

  process(data: TrackerData): ProcessedData {
    const prev = this.states.get(data.deviceId) || {
      lastTime: 0,
      totalDriving: 0,
      motorHours: 0
    };

    const timeDiff = (data.timestamp - prev.lastTime) / 1000 / 60; // minutes
    const isDriving = data.speed > 5;

    const processed: ProcessedData = {
      deviceId: data.deviceId,
      drivingTimeMinutes: isDriving ? prev.totalDriving + timeDiff : prev.totalDriving,
      fuelConsumptionL: (data.speed * timeDiff * 0.08) / 60, // Simple calculation
      estimatedRpm: data.speed * 35 + 800,
      hasAuthenticatedDriver: !!data.driverRfid,
      connectionOk: true,
      motorHours: data.engineOn ? prev.motorHours + (timeDiff / 60) : prev.motorHours
    };

    this.states.set(data.deviceId, {
      lastTime: data.timestamp,
      totalDriving: processed.drivingTimeMinutes,
      motorHours: processed.motorHours
    });

    return processed;
  }

  // Generate demo data for testing
  generateDemoData(deviceId: string): TrackerData {
    return {
      deviceId,
      timestamp: Date.now(),
      location: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
      speed: 30 + Math.random() * 40,
      fuel: 50 + Math.random() * 50,
      engineOn: Math.random() > 0.1,
      driverRfid: Math.random() > 0.3 ? 'driver_' + Math.floor(Math.random() * 100) : undefined
    };
  }
}

export const dplService = new SimpleDPL();