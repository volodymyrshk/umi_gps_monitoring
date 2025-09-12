'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet';
import { Vehicle } from '@/lib/entities/vehicle';
import MapControls from './MapControls';
import VehicleMarker from './VehicleMarker';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  vehicles: Vehicle[] | any[]; // Allow both new and old vehicle types
  selectedVehicle: Vehicle | any | null;
  onVehicleSelect: (vehicle: Vehicle | any) => void;
  showPaths?: boolean;
  pathSegments?: any[];
  onMapReady?: (map: L.Map) => void;
}

function MapUpdater({ selectedVehicle, pathSegments, showPaths, onMapReady }: { 
  selectedVehicle: any; 
  pathSegments?: any[];
  showPaths?: boolean;
  onMapReady?: (map: L.Map) => void;
}) {
  const map = useMap();

  // Call onMapReady callback when map is available
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (selectedVehicle) {
      // Handle both old and new vehicle data structures
      const lat = selectedVehicle.currentLocation?.latitude || selectedVehicle.location?.lat;
      const lng = selectedVehicle.currentLocation?.longitude || selectedVehicle.location?.lng;
      
      if (lat && lng) {
        map.flyTo([lat, lng], 13);
      }
    }
  }, [selectedVehicle, map]);

  // Auto-zoom to paths when displayed
  useEffect(() => {
    if (showPaths && pathSegments && pathSegments.length > 0) {
      // console.log('Auto-zooming to paths');
      
      // Collect all coordinates from all path segments
      const allCoords: [number, number][] = [];
      
      pathSegments.forEach(segment => {
        const pathPoints = segment.points || [];
        pathPoints.forEach((point: any) => {
          const lat = point.location?.latitude || point.lat;
          const lng = point.location?.longitude || point.lng;
          if (lat && lng) {
            allCoords.push([lat, lng]);
          }
        });
      });
      
      if (allCoords.length > 0) {
        console.log('Fitting map to bounds with', allCoords.length, 'coordinates');
        
        // Calculate bounds
        const bounds = L.latLngBounds(allCoords);
        
        // Fit map to bounds with some padding
        map.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 16
        });
      }
    }
  }, [showPaths, pathSegments, map]);

  return null;
}

export default function Map({ vehicles, selectedVehicle, onVehicleSelect, showPaths, pathSegments, onMapReady }: MapProps) {
  const mapRef = useRef<L.Map>(null);
  const [openPopupVehicleId, setOpenPopupVehicleId] = useState<string | null>(null);

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
        eventHandlers={{
          click: () => setOpenPopupVehicleId(null)
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={20}
          minZoom={2}
          keepBuffer={4}
          updateWhenZooming={false}
          updateWhenIdle={true}
          className="map-tiles"
        />
        
        <MapUpdater 
          selectedVehicle={selectedVehicle} 
          pathSegments={pathSegments}
          showPaths={showPaths}
          onMapReady={onMapReady}
        />
        
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle?.id === vehicle.id}
            onVehicleSelect={onVehicleSelect}
            isPopupOpen={openPopupVehicleId === vehicle.id}
            onPopupToggle={(isOpen) => {
              setOpenPopupVehicleId(isOpen ? vehicle.id : null);
            }}
          />
        ))}
        
        
        {/* Render Path Lines */}
        
        {showPaths && pathSegments && pathSegments.map((segment) => {
          
          const pathPoints = segment.points || [];
          if (pathPoints.length < 2) {
            return null;
          }
          
          const coordinates = pathPoints.map((point: any) => {
            const lat = point.location?.latitude || point.lat;
            const lng = point.location?.longitude || point.lng;
            return [lat, lng];
          }).filter(coord => coord[0] && coord[1]);
          
          console.log('Final coordinates for segment:', coordinates.length, 'points');
          
          if (coordinates.length < 2) {
            console.log('Not enough valid coordinates:', coordinates.length);
            return null;
          }
          
          // Color based on segment type
          const getPathColor = (type: string) => {
            switch (type) {
              case 'working': return '#22c55e'; // green
              case 'transport': return '#3b82f6'; // blue
              case 'idle': return '#3b82f6'; // blue
              default: return '#6b7280'; // gray
            }
          };
          
          console.log('Rendering polyline for segment:', segment.id, 'color:', getPathColor(segment.type));
          
          return (
            <Polyline
              key={segment.id}
              positions={coordinates}
              color={getPathColor(segment.type)}
              weight={8}
              opacity={1.0}
              dashArray="10, 5"
            />
          );
        })}
      </MapContainer>
      
      
      <style jsx global>{`
        .leaflet-container {
          background: #f8f9fa !important;
        }
        .map-tiles {
          background: #f8f9fa !important;
        }
        .leaflet-tile-container {
          background: #f8f9fa !important;
        }
        .leaflet-tile {
          background: #f8f9fa !important;
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