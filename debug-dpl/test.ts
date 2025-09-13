import { VehicleDataProcessor } from './processor';
import { TrackerDataPacket } from './types';

// Test the DPL processor
const processor = new VehicleDataProcessor();

const mockData: TrackerDataPacket = {
  timestamp: Date.now(),
  longitude: -74.006,
  latitude: 40.7128,
  speed: 50,
  fuel_level: 75,
  engine_on: true,
  rfid_id: 'driver123'
};

const result = processor.processData('device001', mockData);
console.log('Processed data:', result);

export { processor, mockData };