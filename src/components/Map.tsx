'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Vehicle } from '@/types/vehicle';
import MapControls from './MapControls';
import VehicleMarker from './VehicleMarker';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

function MapUpdater({ selectedVehicle }: { selectedVehicle: Vehicle | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo([selectedVehicle.location.lat, selectedVehicle.location.lng], 15);
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
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle?.id === vehicle.id}
            onVehicleSelect={onVehicleSelect}
          />
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
        .modern-marker {
          background: none !important;
          border: none !important;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}