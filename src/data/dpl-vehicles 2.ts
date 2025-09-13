import { Vehicle } from '@/lib/entities/vehicle';

export interface DPLVehicleData {
  vehicleId: string;
  driver: {
    name: string;
    rfidId: string;
    licenseNumber: string;
    shiftStart: string;
    shiftEnd: string;
  };
  today: {
    drivingTimeMinutes: number;
    totalDistanceKm: number;
    fuelConsumptionL: number;
    fuelEfficiencyL100km: number;
    motorHours: number;
    averageSpeed: number;
    maxSpeed: number;
    idleTime: number;
    stops: number;
    currentRpm: number;
    engineTemperature: number;
    fuelLevel: number;
  };
  movements: Array<{
    time: string;
    location: { lat: number; lng: number; address: string };
    speed: number;
    event: string;
  }>;
  alerts: Array<{
    time: string;
    type: 'fuel_theft' | 'speeding' | 'unauthorized' | 'maintenance' | 'geofence';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export const dplVehiclesData: { [vehicleId: string]: DPLVehicleData } = {
  'vehicle_001': {
    vehicleId: 'vehicle_001',
    driver: {
      name: 'Michael Rodriguez',
      rfidId: 'RFID_789234',
      licenseNumber: 'CDL-4567890',
      shiftStart: '07:30',
      shiftEnd: '16:30'
    },
    today: {
      drivingTimeMinutes: 485,
      totalDistanceKm: 287.5,
      fuelConsumptionL: 45.2,
      fuelEfficiencyL100km: 15.7,
      motorHours: 8.1,
      averageSpeed: 35.6,
      maxSpeed: 82.3,
      idleTime: 47,
      stops: 12,
      currentRpm: 1450,
      engineTemperature: 89,
      fuelLevel: 68
    },
    movements: [
      { time: '07:30', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Shift Start' },
      { time: '08:15', location: { lat: 40.7589, lng: -73.9851, address: 'Times Square, NYC' }, speed: 45, event: 'Delivery Stop' },
      { time: '09:30', location: { lat: 40.7505, lng: -73.9934, address: 'Herald Square, NYC' }, speed: 32, event: 'Customer Pickup' },
      { time: '11:00', location: { lat: 40.7282, lng: -73.7949, address: 'JFK Airport, Queens' }, speed: 55, event: 'Airport Delivery' },
      { time: '12:30', location: { lat: 40.7061, lng: -73.9969, address: 'Brooklyn Bridge, Brooklyn' }, speed: 28, event: 'Lunch Break' },
      { time: '14:15', location: { lat: 40.6892, lng: -74.0445, address: 'Liberty Island, NYC' }, speed: 38, event: 'Tourist Area Delivery' },
      { time: '15:45', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Return to Depot' }
    ],
    alerts: [
      { time: '09:15', type: 'speeding', message: 'Speed exceeded 80 km/h on Highway 95', severity: 'medium' },
      { time: '13:20', type: 'fuel_theft', message: 'Unusual fuel level drop detected (-8L in 10 min)', severity: 'high' }
    ]
  },
  'vehicle_002': {
    vehicleId: 'vehicle_002',
    driver: {
      name: 'Sarah Chen',
      rfidId: 'RFID_456123',
      licenseNumber: 'CDL-7890123',
      shiftStart: '06:00',
      shiftEnd: '15:00'
    },
    today: {
      drivingTimeMinutes: 520,
      totalDistanceKm: 195.3,
      fuelConsumptionL: 28.7,
      fuelEfficiencyL100km: 14.7,
      motorHours: 8.7,
      averageSpeed: 22.5,
      maxSpeed: 65.8,
      idleTime: 65,
      stops: 18,
      currentRpm: 1200,
      engineTemperature: 85,
      fuelLevel: 42
    },
    movements: [
      { time: '06:00', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Early Shift Start' },
      { time: '06:45', location: { lat: 40.7831, lng: -73.9712, address: 'Upper West Side, NYC' }, speed: 35, event: 'Morning Deliveries' },
      { time: '08:30', location: { lat: 40.7749, lng: -73.9442, address: 'Midtown East, NYC' }, speed: 25, event: 'Office Complex' },
      { time: '10:15', location: { lat: 40.7614, lng: -73.9776, address: 'Central Park South' }, speed: 20, event: 'Hotel Delivery' },
      { time: '11:45', location: { lat: 40.7505, lng: -73.9934, address: 'Herald Square, NYC' }, speed: 18, event: 'Shopping District' },
      { time: '13:00', location: { lat: 40.7282, lng: -73.7949, address: 'Flushing, Queens' }, speed: 45, event: 'Queens Route' },
      { time: '14:30', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Shift End' }
    ],
    alerts: [
      { time: '07:30', type: 'maintenance', message: 'Engine oil pressure low - schedule maintenance', severity: 'medium' },
      { time: '12:15', type: 'geofence', message: 'Vehicle entered restricted area - Queens Industrial Zone', severity: 'low' }
    ]
  },
  'vehicle_003': {
    vehicleId: 'vehicle_003',
    driver: {
      name: 'David Thompson',
      rfidId: 'RFID_321987',
      licenseNumber: 'CDL-2345678',
      shiftStart: '08:00',
      shiftEnd: '17:00'
    },
    today: {
      drivingTimeMinutes: 465,
      totalDistanceKm: 342.8,
      fuelConsumptionL: 52.4,
      fuelEfficiencyL100km: 15.3,
      motorHours: 7.8,
      averageSpeed: 44.2,
      maxSpeed: 88.1,
      idleTime: 32,
      stops: 8,
      currentRpm: 1650,
      engineTemperature: 91,
      fuelLevel: 35
    },
    movements: [
      { time: '08:00', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Regular Shift Start' },
      { time: '09:00', location: { lat: 40.8176, lng: -73.9782, address: 'Bronx, NY' }, speed: 52, event: 'Long Distance Route' },
      { time: '10:45', location: { lat: 41.0534, lng: -73.5387, address: 'White Plains, NY' }, speed: 65, event: 'Suburban Delivery' },
      { time: '12:30', location: { lat: 40.9176, lng: -73.7004, address: 'Yonkers, NY' }, speed: 48, event: 'Return Route' },
      { time: '14:15', location: { lat: 40.6782, lng: -73.9442, address: 'Fort Greene, Brooklyn' }, speed: 38, event: 'Brooklyn Deliveries' },
      { time: '16:00', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Day Complete' }
    ],
    alerts: [
      { time: '10:20', type: 'speeding', message: 'Sustained high speed on Interstate - 85+ km/h', severity: 'high' },
      { time: '15:30', type: 'fuel_theft', message: 'Rapid fuel consumption detected', severity: 'medium' }
    ]
  },
  'vehicle_004': {
    vehicleId: 'vehicle_004',
    driver: {
      name: 'Lisa Park',
      rfidId: 'RFID_654321',
      licenseNumber: 'CDL-5678901',
      shiftStart: '09:00',
      shiftEnd: '18:00'
    },
    today: {
      drivingTimeMinutes: 395,
      totalDistanceKm: 156.7,
      fuelConsumptionL: 22.1,
      fuelEfficiencyL100km: 14.1,
      motorHours: 6.6,
      averageSpeed: 23.8,
      maxSpeed: 58.9,
      idleTime: 85,
      stops: 24,
      currentRpm: 1100,
      engineTemperature: 83,
      fuelLevel: 78
    },
    movements: [
      { time: '09:00', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Late Morning Start' },
      { time: '09:30', location: { lat: 40.7282, lng: -73.9942, address: 'Lower East Side, NYC' }, speed: 28, event: 'Local Deliveries' },
      { time: '11:00', location: { lat: 40.7505, lng: -73.9934, address: 'Herald Square, NYC' }, speed: 22, event: 'Shopping Centers' },
      { time: '12:45', location: { lat: 40.7614, lng: -73.9776, address: 'Central Park South' }, speed: 15, event: 'Lunch Break' },
      { time: '14:30', location: { lat: 40.7831, lng: -73.9712, address: 'Upper West Side, NYC' }, speed: 30, event: 'Residential Area' },
      { time: '16:15', location: { lat: 40.7749, lng: -73.9442, address: 'Midtown East, NYC' }, speed: 25, event: 'Final Deliveries' },
      { time: '17:45', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'End of Shift' }
    ],
    alerts: [
      { time: '11:45', type: 'unauthorized', message: 'Unknown RFID card attempted access', severity: 'high' },
      { time: '16:45', type: 'maintenance', message: 'Brake pad wear indicator active', severity: 'medium' }
    ]
  },
  'vehicle_005': {
    vehicleId: 'vehicle_005',
    driver: {
      name: 'James Wilson',
      rfidId: 'RFID_987654',
      licenseNumber: 'CDL-9012345',
      shiftStart: '10:00',
      shiftEnd: '19:00'
    },
    today: {
      drivingTimeMinutes: 425,
      totalDistanceKm: 208.9,
      fuelConsumptionL: 31.8,
      fuelEfficiencyL100km: 15.2,
      motorHours: 7.1,
      averageSpeed: 29.5,
      maxSpeed: 72.4,
      idleTime: 55,
      stops: 15,
      currentRpm: 1350,
      engineTemperature: 87,
      fuelLevel: 56
    },
    movements: [
      { time: '10:00', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Afternoon Shift Start' },
      { time: '10:45', location: { lat: 40.6892, lng: -74.0445, address: 'Staten Island Ferry Terminal' }, speed: 42, event: 'Ferry Route' },
      { time: '12:15', location: { lat: 40.5795, lng: -74.1502, address: 'Staten Island, NY' }, speed: 35, event: 'Island Deliveries' },
      { time: '14:30', location: { lat: 40.6892, lng: -74.0445, address: 'Staten Island Ferry Terminal' }, speed: 30, event: 'Return Ferry' },
      { time: '15:45', location: { lat: 40.6782, lng: -73.9442, address: 'Fort Greene, Brooklyn' }, speed: 38, event: 'Brooklyn Route' },
      { time: '17:30', location: { lat: 40.7282, lng: -73.9942, address: 'Lower East Side, NYC' }, speed: 25, event: 'Final Pickups' },
      { time: '18:45', location: { lat: 40.7128, lng: -74.0060, address: 'Depot - 123 Main St, NYC' }, speed: 0, event: 'Shift Complete' }
    ],
    alerts: [
      { time: '13:20', type: 'geofence', message: 'Extended stop time in residential area', severity: 'low' },
      { time: '17:00', type: 'maintenance', message: 'Tire pressure low - front left tire', severity: 'medium' }
    ]
  }
};