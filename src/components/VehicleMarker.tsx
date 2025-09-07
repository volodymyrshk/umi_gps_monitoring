import { useState } from 'react';
import { Marker } from 'react-leaflet';
import { Vehicle } from '@/types/vehicle';
import VehicleMapPopover from './VehicleMapPopover';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import L from 'leaflet';

// Create modern simple markers
const createModernIcon = (status: 'online' | 'offline' | 'warning', isSelected: boolean) => {
  const color = status === 'online' ? '#22c55e' : status === 'warning' ? '#ef4444' : '#6b7280';
  const size = isSelected ? 20 : 16;
  const pulseSize = size + 8;
  
  return L.divIcon({
    className: 'modern-marker',
    html: `
      <div style="position: relative; width: ${pulseSize}px; height: ${pulseSize}px;">
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div>
          <Marker
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={createModernIcon(vehicle.status, isSelected)}
            eventHandlers={{
              click: () => setPopoverOpen(true),
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 border-0 shadow-xl bg-white rounded-2xl" 
        side="top" 
        align="center"
        sideOffset={8}
      >
        <VehicleMapPopover 
          vehicle={vehicle} 
          onSelectVehicle={(selectedVehicle) => {
            onVehicleSelect(selectedVehicle);
            setPopoverOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}