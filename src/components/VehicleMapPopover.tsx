import { Vehicle } from '@/types/vehicle';
import { Battery, Fuel, Gauge, Timer, User, CreditCard, Wifi, WifiOff } from 'lucide-react';
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardTitle,
} from '@/components/ui/minimal-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VehicleMapPopoverProps {
  vehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function VehicleMapPopover({ vehicle, onSelectVehicle }: VehicleMapPopoverProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Активен';
      case 'warning': return 'Проблема';
      case 'offline': return 'Неактивен';
      default: return 'Неизвестно';
    }
  };

  return (
    <MinimalCard className="w-80 p-4 shadow-lg border-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* John Deere Logo */}
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <div className="w-7 h-5 bg-yellow-400 rounded-sm flex items-center justify-center">
              <div className="w-3.5 h-2.5 bg-green-600 rounded-sm"></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <MinimalCardTitle className="text-base font-bold text-gray-900 mt-0">
              {vehicle.name.split(' ').slice(0, 2).join(' ')}
            </MinimalCardTitle>
            <p className="text-sm text-gray-600 mt-1">{vehicle.model}</p>
          </div>
        </div>
        
        <Badge variant="secondary" className={getStatusColor(vehicle.status)}>
          {getStatusText(vehicle.status)}
        </Badge>
      </div>

      {/* Driver Info */}
      {vehicle.operator && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{vehicle.operator}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${vehicle.isWorking ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {vehicle.isWorking ? 'Работает' : 'Не работает'}
            </span>
          </div>
        </div>
      )}

      {/* Address */}
      <MinimalCardDescription className="mb-3 text-sm">
        📍 {vehicle.location.address}
      </MinimalCardDescription>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{vehicle.speed || 0} км/ч</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-3 h-3 ${vehicle.rfidConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${vehicle.rfidConnected ? 'text-green-600' : 'text-red-600'}`}>
              {vehicle.rfidConnected ? 'RFID OK' : 'RFID НЕТ'}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{vehicle.roadTime || 0}ч в дороге</span>
          </div>
          <div className="flex items-center space-x-2">
            {vehicle.status === 'online' ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
            <span className="text-xs text-muted-foreground">Связь</span>
          </div>
        </div>
      </div>

      {/* Technical Data */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-muted rounded-lg mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Fuel className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold">{vehicle.fuel || 0}%</div>
          <div className="text-xs text-muted-foreground">Топливо</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Gauge className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-sm font-bold">{vehicle.rpm || 0}</div>
          <div className="text-xs text-muted-foreground">RPM</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Timer className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-sm font-bold">{vehicle.engineHours || 0}h</div>
          <div className="text-xs text-muted-foreground">Моточасы</div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        className="w-full" 
        onClick={() => onSelectVehicle(vehicle)}
        variant={vehicle.status === 'online' ? 'default' : 'secondary'}
      >
        {vehicle.status === 'online' ? 'Выбрать в боковой панели' : 'Диагностика'}
      </Button>
    </MinimalCard>
  );
}