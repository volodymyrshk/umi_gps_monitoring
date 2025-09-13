/**
 * Generated vehicle data using the new modular system
 */

import { VehicleDataGenerator } from '../lib/generators/vehicle-generator';
import { vehicleService } from '../lib/services';

// Generate realistic vehicle fleet data
export const vehicles = VehicleDataGenerator.generateVehicles(12);
export const operators = VehicleDataGenerator.generateOperators(16);

// Seed the service with generated data
vehicleService.seedWithMockData(vehicles);

// Generate realtime metrics for all vehicles
vehicles.forEach(vehicle => {
  const metrics = VehicleDataGenerator.generateRealtimeMetrics(vehicle.id);
  vehicleService.updateRealtimeMetrics(vehicle.id, metrics);
});

// Export for backward compatibility with existing components
export const mockVehicles = vehicles.map(vehicle => {
  // Get realtime metrics synchronously for initial render
  const realtimeMetrics = VehicleDataGenerator.generateRealtimeMetrics(vehicle.id);
  
  return {
    id: vehicle.id,
    name: vehicle.name,
    specs: vehicle.specs,
    currentLocation: vehicle.currentLocation,
    status: vehicle.status,
    operatorId: vehicle.operatorId,
    // Backward compatibility fields
    model: vehicle.specs.model,
    operator: operators.find(op => op.id === vehicle.operatorId)?.fullName || 'Не призначено',
    location: {
      address: vehicle.currentLocation.address || '',
      lat: vehicle.currentLocation.latitude,
      lng: vehicle.currentLocation.longitude
    },
    battery: realtimeMetrics.batteryLevel,
    lastUpdate: vehicle.status.lastUpdate,
    speed: realtimeMetrics.currentSpeed,
    fuel: realtimeMetrics.fuelLevel,
    rpm: realtimeMetrics.engineRpm,
    engineHours: vehicle.maintenanceInfo?.totalEngineHours || 0,
    temperature: 85, // Mock temperature
    workingTime: 0, // Will be calculated from telemetry
    distance: 0, // Will be calculated from telemetry  
    isWorking: realtimeMetrics.workingStatus === 'working',
    rfidConnected: Math.random() > 0.3, // 70% have RFID
    roadTime: 0 // Will be calculated from telemetry
  };
});