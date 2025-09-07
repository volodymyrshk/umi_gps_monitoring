import { Vehicle } from '@/types/vehicle';
import { MapPin, Battery, Clock, Fuel, Eye, ChevronDown, Zap, Activity, Gauge, Thermometer, Timer, CreditCard, User, Navigation } from 'lucide-react';
import { useState } from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onClick: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, isSelected, onClick }: VehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'bg-green-500';
    if (battery > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBatteryBg = (battery: number) => {
    if (battery > 50) return 'bg-green-50';
    if (battery > 20) return 'bg-yellow-50';  
    return 'bg-red-50';
  };

  const handleCardClick = () => {
    onClick(vehicle);
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:shadow-gray-200/50 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-md shadow-blue-200/20' : 'shadow-sm'
      }`}
      onClick={handleCardClick}
    >
      {/* Single line layout for collapsed state */}
      {!isExpanded && (
        <div className="flex items-center justify-between p-3">
          {/* John Deere Logo */}
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
              <div className="w-3 h-2 bg-green-600 rounded-sm"></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 mx-3">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {vehicle.name.split(' ').slice(0, 2).join(' ')}
            </h3>
            <p className="text-xs text-gray-500">
              {vehicle.model}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3 text-gray-400" />
            <div className={`w-8 h-4 rounded ${getBatteryColor(vehicle.battery)}`}></div>
            <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Expanded layout */}
      {isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              {/* John Deere Logo */}
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-7 h-5 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <div className="w-3.5 h-2.5 bg-green-600 rounded-sm"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {vehicle.name.split(' ').slice(0, 2).join(' ')}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {vehicle.model}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 rotate-180" />
            </div>
          </div>

          {/* Expandable Details */}
          <div className="space-y-3">
            {/* Driver Information */}
            {vehicle.operator && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {vehicle.operator}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${vehicle.isWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">
                    {vehicle.isWorking ? 'Работает' : 'Не работает'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Location */}
            <div className="flex items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{vehicle.location.address}</span>
            </div>

            {/* Current Speed and Road Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Navigation className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">
                  {vehicle.speed || 0} км/ч
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-gray-600">
                  {vehicle.roadTime || 0}ч в дороге
                </span>
              </div>
            </div>

            {/* RFID and Status Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <CreditCard className={`w-3 h-3 ${vehicle.rfidConnected ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${vehicle.rfidConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {vehicle.rfidConnected ? 'RFID OK' : 'RFID НЕТ'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <Activity className="w-3 h-3 text-blue-500" />
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-lg ${getBatteryBg(vehicle.battery)}`}>
                <span className="text-xs font-bold text-gray-900">
                  {vehicle.battery}%
                </span>
              </div>
            </div>

            {/* Additional Data Row */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Fuel className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-600">{vehicle.fuel || 0}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-gray-600">{vehicle.rpm || 0} RPM</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {new Date(vehicle.lastUpdate).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-gray-600">{vehicle.temperature || 0}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Timer className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-600">{vehicle.engineHours || 0}h</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600">
                  {vehicle.speed || 0} км/ч
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}