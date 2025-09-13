import { useRef } from 'react';
import { Marker } from 'react-leaflet';
import { Vehicle } from '@/lib/entities/vehicle';
import L from 'leaflet';

// Create modern simple markers
const createModernIcon = (status: 'online' | 'offline' | 'warning', isSelected: boolean) => {
  const color = status === 'online' ? '#22c55e' : status === 'warning' ? '#ef4444' : '#6b7280';
  const size = isSelected ? 20 : 16;
  const pulseSize = size + 8;
  
  return L.divIcon({
    className: 'modern-marker',
    html: `
      <div style="position: relative; width: ${pulseSize}px; height: ${pulseSize}px; pointer-events: auto;">
        ${status === 'online' && !isSelected ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${pulseSize}px;
            height: ${pulseSize}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse 2s infinite;
            pointer-events: none;
          "></div>
        ` : ''}
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          ${isSelected ? 'box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.4), 0 2px 8px rgba(0,0,0,0.15);' : ''}
          cursor: pointer;
          pointer-events: auto;
        "></div>
      </div>
    `,
    iconSize: [pulseSize, pulseSize],
    iconAnchor: [pulseSize/2, pulseSize/2]
  });
};

interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export default function VehicleMarker({ vehicle, isSelected, onVehicleSelect }: VehicleMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  // Handle both old and new vehicle data structures
  const currentLocation = vehicle.currentLocation || vehicle.location;
  const vehicleStatus = vehicle.status?.status || vehicle.status;

  return (
    <Marker
      ref={markerRef}
      position={[currentLocation.latitude || currentLocation.lat, currentLocation.longitude || currentLocation.lng]}
      icon={createModernIcon(vehicleStatus, isSelected)}
      eventHandlers={{
        click: (e) => {
          e.originalEvent?.stopPropagation();
          onVehicleSelect(vehicle);
        },
      }}
    />
  );
}