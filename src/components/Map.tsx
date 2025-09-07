'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Vehicle } from '@/types/vehicle';
import MapControls from './MapControls';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom simple markers without shadows
const createCustomIcon = (status: 'online' | 'offline' | 'warning', isSelected: boolean) => {
  const color = status === 'online' ? '#22c55e' : status === 'warning' ? '#ef4444' : '#6b7280';
  const size = isSelected ? 16 : 12;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      ${isSelected ? 'box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);' : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

interface MapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

function MapUpdater({ selectedVehicle }: { selectedVehicle: Vehicle | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVehicle) {
      map.setView([selectedVehicle.location.lat, selectedVehicle.location.lng], 15);
    }
  }, [selectedVehicle, map]);

  return null;
}

export default function Map({ vehicles, selectedVehicle, onVehicleSelect }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[50.4501, 30.5234]}
        zoom={12}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={20}
        />
        
        <MapUpdater selectedVehicle={selectedVehicle} />
        
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={createCustomIcon(vehicle.status, selectedVehicle?.id === vehicle.id)}
            eventHandlers={{
              click: () => onVehicleSelect(vehicle),
            }}
          >
            <Popup>
              <div className="min-w-48">
                <h3 className="font-bold text-sm mb-2">{vehicle.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{vehicle.location.address}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">
                    Battery: {vehicle.battery}%
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    vehicle.status === 'online' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'warning' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <MapControls 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFullscreen={handleFullscreen}
      />
      
      <style jsx global>{`
        .leaflet-container {
          background: transparent;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}