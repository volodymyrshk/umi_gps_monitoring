'use client';

import dynamic from 'next/dynamic';
import DockHeader from '@/components/DockHeader';
import ComprehensiveSidebar from '@/components/ComprehensiveSidebar';
import VehicleDetailDrawer from '@/components/VehicleDetailDrawer';
import { useState, useEffect } from 'react';
import { vehicleService } from '@/lib/services';
import { Vehicle, VehicleFilter } from '@/lib/entities/vehicle';
import { PathQuery, PathSegment } from '@/lib/services/path-tracking';
import { PathDataGenerator } from '@/lib/generators/path-generator';
import { getSelectedVehicleDPLPath } from '@/lib/dpl-paths';
import { mockVehicles } from '@/data/vehicles';
import MapControls from '@/components/MapControls';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  
  // Path tracking state
  const [showPaths, setShowPaths] = useState(false);
  const [pathQuery, setPathQuery] = useState<PathQuery>({
    vehicleIds: [],
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    endTime: new Date(),
    resolution: 'medium'
  });
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([]);
  const [dplPaths, setDplPaths] = useState<PathSegment[]>([]);

  // Load vehicles on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const vehicleData = await vehicleService.getAll();
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        // Fallback to mock data if service fails
        setVehicles(mockVehicles as Vehicle[]);
        setFilteredVehicles(mockVehicles as Vehicle[]);
      }
    };

    loadVehicles();
  }, []);

  const handleFilterChange = async (filters: VehicleFilter) => {
    try {
      const filtered = await vehicleService.getAll(filters);
      setFilteredVehicles(filtered);
    } catch (error) {
      console.error('Failed to filter vehicles:', error);
      // Fallback to client-side filtering
      let filtered = vehicles;

      if (filters.search) {
        filtered = filtered.filter(v => 
          v.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          v.displayName.toLowerCase().includes(filters.search!.toLowerCase()) ||
          v.currentLocation.address?.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.status) {
        filtered = filtered.filter(v => v.status.status === filters.status);
      }

      if (filters.type) {
        filtered = filtered.filter(v => v.type === filters.type);
      }

      setFilteredVehicles(filtered);
    }
  };

  // Handle path query changes
  const handlePathQueryChange = (newQuery: PathQuery) => {
    console.log('Path query changed:', newQuery);
    setPathQuery(newQuery);
    
    // Generate mock path data
    if (newQuery.vehicleIds && newQuery.vehicleIds.length > 0) {
      const mockPaths = PathDataGenerator.generateMultiVehiclePaths(
        newQuery.vehicleIds,
        newQuery.startTime,
        newQuery.endTime
      );
      console.log('Generated paths:', mockPaths);
      setPathSegments(mockPaths);
      setShowPaths(true);
    } else {
      setPathSegments([]);
    }
  };

  // Handle vehicle selection and show DPL path
  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    
    if (vehicle) {
      // Show DPL path for selected vehicle
      const vehicleDplPaths = getSelectedVehicleDPLPath(vehicle.id);
      setDplPaths(vehicleDplPaths);
      setShowPaths(true); // Automatically show paths when vehicle is selected
      setDetailDrawerOpen(true); // Open detail drawer
    } else {
      // Clear DPL paths when no vehicle selected
      setDplPaths([]);
      setShowPaths(false); // Also hide paths when no vehicle selected
      setDetailDrawerOpen(false); // Close detail drawer
    }
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Full-screen map as base layer */}
      <div className="absolute inset-0 z-0">
        <Map 
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
          showPaths={showPaths}
          pathSegments={showPaths ? [...pathSegments, ...dplPaths] : []}
        />
      </div>
      
      {/* Top Header */}
      <DockHeader 
        onMenuClick={() => setSidebarOpen(true)}
        showPaths={showPaths}
        onTogglePaths={setShowPaths}
      />
      
      {/* Sidebar */}
      <ComprehensiveSidebar 
        vehicles={filteredVehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
        onFilterChange={handleFilterChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pathQuery={pathQuery}
        onPathQueryChange={handlePathQueryChange}
        showPaths={showPaths}
      />

      {/* Map Controls positioned on map next to sidebar */}
      <div className="fixed left-[415px] top-[80px] z-[1000]">
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFullscreen={handleFullscreen}
        />
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vehicle Detail Drawer */}
      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        isOpen={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedVehicle(null);
        }}
      />
    </div>
  );
}
