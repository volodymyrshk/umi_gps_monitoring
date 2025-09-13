export interface Vehicle {
  id: string;
  name: string;
  model: string;
  operator?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  battery: number;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: Date;
  speed?: number;
  fuel?: number;
  rpm?: number;
  engineHours?: number;
  temperature?: number;
  workingTime?: number;
  distance?: number;
  isWorking?: boolean;
  rfidConnected?: boolean;
  roadTime?: number;
}

export interface VehicleFilter {
  search?: string;
  status?: 'online' | 'offline' | 'warning';
  batteryMin?: number;
}