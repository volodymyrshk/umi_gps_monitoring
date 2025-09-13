import { dplVehiclesData } from '@/data/dpl-vehicles';
import { PathSegment } from '@/lib/services/path-tracking';

// Convert DPL movement data to map path segments
export function getDPLPathsForVehicle(vehicleId: string): PathSegment[] {
  const dplData = dplVehiclesData[vehicleId];
  if (!dplData) return [];

  const paths: PathSegment[] = [];
  
  for (let i = 0; i < dplData.movements.length - 1; i++) {
    const current = dplData.movements[i];
    const next = dplData.movements[i + 1];
    
    // Create a path segment between current and next location
    paths.push({
      id: `${vehicleId}_segment_${i}`,
      vehicleId: vehicleId,
      startTime: new Date(`${new Date().toDateString()} ${current.time}`),
      endTime: new Date(`${new Date().toDateString()} ${next.time}`),
      coordinates: [
        current.location,
        next.location
      ],
      averageSpeed: (current.speed + next.speed) / 2,
      distance: calculateDistance(current.location, next.location),
      color: getPathColor(current.speed, next.speed),
      events: [
        {
          timestamp: new Date(`${new Date().toDateString()} ${current.time}`),
          location: current.location,
          type: 'movement',
          description: current.event
        }
      ]
    });
  }
  
  return paths;
}

// Get all DPL paths for multiple vehicles
export function getDPLPathsForVehicles(vehicleIds: string[]): PathSegment[] {
  const allPaths: PathSegment[] = [];
  
  vehicleIds.forEach(vehicleId => {
    const vehiclePaths = getDPLPathsForVehicle(vehicleId);
    allPaths.push(...vehiclePaths);
  });
  
  return allPaths;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(point1: {lat: number, lng: number}, point2: {lat: number, lng: number}): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get path color based on speed
function getPathColor(speed1: number, speed2: number): string {
  const avgSpeed = (speed1 + speed2) / 2;
  
  if (avgSpeed >= 60) return '#ef4444'; // Red for high speed
  if (avgSpeed >= 40) return '#3b82f6'; // Blue for medium speed  
  if (avgSpeed >= 20) return '#10b981'; // Green for normal speed
  return '#6b7280'; // Gray for low speed/stopped
}

// Get DPL paths for currently selected vehicle
export function getSelectedVehicleDPLPath(selectedVehicleId: string | null): PathSegment[] {
  if (!selectedVehicleId) return [];
  return getDPLPathsForVehicle(selectedVehicleId);
}