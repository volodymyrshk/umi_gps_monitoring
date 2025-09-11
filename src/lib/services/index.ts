/**
 * Data services exports
 */

export * from './vehicle';
export * from './path-tracking';
// export * from './enhanced-vehicle-service'; // Temporarily disabled due to compilation issues

// Service instances (singleton pattern)
import { VehicleDataService } from './vehicle';
// import { EnhancedVehicleService } from './enhanced-vehicle-service'; // Temporarily disabled

// Use legacy service as default temporarily
export const vehicleService = new VehicleDataService();

// Keep original service available for compatibility
export const legacyVehicleService = new VehicleDataService();