import { Vehicle } from '@/lib/entities/vehicle';
import { User, Truck, Clock, MapPin, Wifi, WifiOff, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VehicleMapPopoverProps {
  vehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onClose?: () => void;
}

export default function VehicleMapPopover({ vehicle, onSelectVehicle, onClose }: VehicleMapPopoverProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Active';
      case 'warning': return 'Warning';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const updateTime = new Date(vehicle.status?.lastUpdate || now);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return updateTime.toLocaleDateString();
  };

  // Handle both old and new vehicle structures
  const vehicleStatus = vehicle.status?.status || vehicle.status;
  const vehicleModel = vehicle.specs?.model || vehicle.model;
  const currentLocation = vehicle.currentLocation || vehicle.location;
  const vehicleName = vehicle.displayName || vehicle.name;

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[320px] max-w-[90vw]">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {vehicleName}
            </h3>
            <p className="text-xs text-gray-500 truncate">{vehicle.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`text-xs ${getStatusColor(vehicleStatus)}`}>
            {getStatusText(vehicleStatus)}
          </Badge>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Driver/Operator Info */}
      {vehicle.operator && (
        <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-md">
          <User className="w-4 h-4 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{vehicle.operator}</p>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${vehicle.isWorking ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500">
                {vehicle.isWorking ? 'Working' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Info */}
      <div className="space-y-2 text-xs mb-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Speed:</span>
          <span className="font-medium">{vehicle.speed || 0} km/h</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex-shrink-0">Location:</span>
          <span className="font-medium text-right text-xs truncate ml-2">
            {currentLocation?.address || `${currentLocation?.latitude?.toFixed(4)}, ${currentLocation?.longitude?.toFixed(4)}`}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Last Update:</span>
          <span className="font-medium">{formatLastUpdate()}</span>
        </div>

        {vehicle.fuel && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Fuel:</span>
            <span className="font-medium">{vehicle.fuel}%</span>
          </div>
        )}

        {vehicle.engineHours && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Engine Hours:</span>
            <span className="font-medium">{vehicle.engineHours}h</span>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-3">
        <div className="flex items-center space-x-1">
          {vehicleStatus === 'online' ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          <span className="text-xs text-gray-600">Connection</span>
        </div>
        
        {vehicle.rfidConnected !== undefined && (
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${vehicle.rfidConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">RFID</span>
          </div>
        )}
        
        {vehicle.roadTime && (
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-600">{vehicle.roadTime}h</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button 
        className="w-full h-8 text-xs" 
        onClick={() => onSelectVehicle(vehicle)}
        variant={vehicleStatus === 'online' ? 'default' : 'secondary'}
        size="sm"
      >
        {vehicleStatus === 'online' ? 'View Details' : 'Diagnostics'}
      </Button>
    </div>
  );
}