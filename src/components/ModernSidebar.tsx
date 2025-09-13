import { useState } from 'react';
import { Vehicle, VehicleFilter } from '@/lib/entities/vehicle';
import VehicleCard from './VehicleCard';
import { Filter, Calendar, Menu, X, ChevronDown } from 'lucide-react';

interface ModernSidebarProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  onFilterChange: (filters: VehicleFilter) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ModernSidebar({ 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect, 
  onFilterChange, 
  isOpen, 
  onClose 
}: ModernSidebarProps) {
  const [filters, setFilters] = useState<VehicleFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<VehicleFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className={`fixed top-20 left-4 bottom-4 w-80 z-[1001] ${
      isOpen ? 'block' : 'hidden'
    } lg:block`} style={{top: '80px'}}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-900/10 border border-white/20 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Menu className="w-4 h-4 text-gray-700" />
              <h1 className="text-lg font-bold text-gray-900">Объекты</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Фильтры</span>
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Fleet Overview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded"></div>
                </div>
                <span className="text-sm font-bold text-gray-900">Флот Август 2024</span>
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-lg text-xs font-medium">{vehicles.length}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-green-700">{vehicles.filter(v => v.status === 'online').length}</div>
                <div className="text-gray-600">В работе</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">{Math.round(vehicles.reduce((acc, v) => acc + (v.fuel || 0), 0) / vehicles.length)}%</div>
                <div className="text-gray-600">Топливо</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">{Math.round(vehicles.reduce((acc, v) => acc + (v.battery || 0), 0) / vehicles.length)}%</div>
                <div className="text-gray-600">Заряд</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle?.id === vehicle.id}
              onClick={onVehicleSelect}
            />
          ))}
        </div>

        {/* Enhanced Footer with Calendar and Stats */}
        <div className="p-4 border-t border-gray-100/50 space-y-3">
          {/* Calendar Section */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">Период</span>
              <Calendar className="w-3 h-3 text-gray-500" />
            </div>
            <div className="text-xs font-medium text-gray-600">
              17 Авг 2024 – 23 Авг 2024
            </div>
            <div className="text-xs text-gray-500 mt-1">
              7 дней выбрано
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-xs font-bold text-blue-800">Активных</div>
              <div className="text-sm font-black text-blue-900">{vehicles.filter(v => v.status === 'online').length}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <div className="text-xs font-bold text-red-800">Проблемы</div>
              <div className="text-sm font-black text-red-900">{vehicles.filter(v => v.status === 'warning').length}</div>
            </div>
          </div>
          
          <div className="text-center">
            <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}