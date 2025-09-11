import { useState, useRef, useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { Vehicle } from '@/lib/entities/vehicle';
import VehiclePopup from './VehiclePopup';
import L from 'leaflet';
import { createPortal } from 'react-dom';

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
  isPopupOpen?: boolean;
  onPopupToggle?: (isOpen: boolean) => void;
}

export default function VehicleMarker({ vehicle, isSelected, onVehicleSelect, isPopupOpen, onPopupToggle }: VehicleMarkerProps) {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  // Use controlled state from parent or fallback to local state
  const popupOpen = isPopupOpen || false;

  // Handle both old and new vehicle data structures
  const currentLocation = vehicle.currentLocation || vehicle.location;
  const vehicleStatus = vehicle.status?.status || vehicle.status;

  const [popupDirection, setPopupDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  // Update popup position when marker position changes or map moves
  const updatePopupPosition = () => {
    if (markerRef.current && popupOpen) {
      const marker = markerRef.current;
      const point = map.latLngToContainerPoint(marker.getLatLng());
      const mapContainer = map.getContainer();
      const mapBounds = mapContainer.getBoundingClientRect();
      
      // Popup dimensions (compact popup)
      const popupWidth = 384; // w-96 = 24rem = 384px
      const popupHeight = 250; // Much smaller now
      const offset = 30;
      
      // Navbar height and sidebar width
      const navbarHeight = 80;
      const sidebarWidth = 400;
      
      let x = point.x;
      let y = point.y;
      let direction: 'top' | 'bottom' | 'left' | 'right' = 'top';
      
      // Convert map-relative coordinates to viewport coordinates
      const viewportY = mapBounds.top + y;
      const viewportX = mapBounds.left + x;
      
      // Determine best positioning based on available space
      const spaceTop = viewportY - navbarHeight;
      const spaceBottom = window.innerHeight - viewportY;
      const spaceLeft = viewportX - sidebarWidth;
      const spaceRight = window.innerWidth - viewportX;
      
      // Choose position with most space
      if (spaceRight >= popupWidth + offset && spaceRight > spaceLeft) {
        direction = 'right';
        x = point.x + offset;
        y = point.y - popupHeight / 2;
      } else if (spaceLeft >= popupWidth + offset) {
        direction = 'left';
        x = point.x - offset;
        y = point.y - popupHeight / 2;
      } else if (spaceBottom >= popupHeight + offset && spaceBottom > spaceTop) {
        direction = 'bottom';
        x = point.x - popupWidth / 2;
        y = point.y + offset;
      } else {
        direction = 'top';
        x = point.x - popupWidth / 2;
        y = point.y - offset;
      }
      
      // Ensure popup stays within bounds
      if (direction === 'left' || direction === 'right') {
        y = Math.max(10, Math.min(y, mapBounds.height - popupHeight - 10));
      } else {
        x = Math.max(10, Math.min(x, mapBounds.width - popupWidth - 10));
      }
      
      setPopupDirection(direction);
      setPopupPosition({ x, y });
    }
  };

  // Update position when map moves/zooms or popup opens
  useEffect(() => {
    if (popupOpen) {
      const timer = setTimeout(updatePopupPosition, 10);
      
      const handleMapMove = () => updatePopupPosition();
      map.on('move', handleMapMove);
      map.on('zoom', handleMapMove);
      
      return () => {
        clearTimeout(timer);
        map.off('move', handleMapMove);
        map.off('zoom', handleMapMove);
      };
    }
  }, [popupOpen, map]);

  return (
    <>
      <Marker
        ref={markerRef}
        position={[currentLocation.latitude || currentLocation.lat, currentLocation.longitude || currentLocation.lng]}
        icon={createModernIcon(vehicleStatus, isSelected)}
        eventHandlers={{
          click: (e) => {
            e.originalEvent?.stopPropagation();
            onPopupToggle?.(!popupOpen);
            onVehicleSelect(vehicle);
          },
        }}
      />
      
      {popupOpen && createPortal(
        <div
          className="fixed z-[2000] pointer-events-none"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            transform: popupDirection === 'top' ? 'translate(-50%, -100%)' :
                      popupDirection === 'bottom' ? 'translate(-50%, 0%)' :
                      popupDirection === 'left' ? 'translate(-100%, -50%)' :
                      'translate(0%, -50%)'
          }}
        >
          <div className="pointer-events-auto">
            <VehiclePopup 
              vehicle={vehicle} 
              position={popupDirection}
              onClose={() => onPopupToggle?.(false)}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}