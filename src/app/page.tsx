'use client';

import dynamic from 'next/dynamic';
import DockHeader from '@/components/DockHeader';
import ComprehensiveSidebar from '@/components/ComprehensiveSidebar';
import { useState } from 'react';
import { Vehicle, VehicleFilter } from '@/types/vehicle';
import { mockVehicles } from '@/data/mockVehicles';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterChange = (filters: VehicleFilter) => {
    let filtered = vehicles;

    if (filters.search) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        v.location.address.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(v => v.status === filters.status);
    }

    if (filters.batteryMin) {
      filtered = filtered.filter(v => v.battery >= filters.batteryMin!);
    }

    setFilteredVehicles(filtered);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Full-screen map as base layer */}
      <div className="absolute inset-0 z-0">
        <Map 
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={setSelectedVehicle}
        />
      </div>
      
      {/* Floating UI elements */}
      <DockHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <ComprehensiveSidebar 
        vehicles={filteredVehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={setSelectedVehicle}
        onFilterChange={handleFilterChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
