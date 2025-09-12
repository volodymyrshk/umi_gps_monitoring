import { Vehicle } from '@/lib/entities/vehicle';
import { 
  MapPin, Battery, Clock, Fuel, Gauge, 
  Thermometer, Timer, Zap, User, Calendar
} from 'lucide-react';

interface VehicleDataTableProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export default function VehicleDataTable({ 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect 
}: VehicleDataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
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

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFuelColor = (fuel: number) => {
    if (fuel > 50) return 'text-blue-600';
    if (fuel > 20) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Gauge className="w-4 h-4 mr-2 text-gray-600" />
          Детальная информация по технике
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Объект
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Оператор
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Местоположение
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Скорость
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Топливо
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Заряд
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Моточасы
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Обновление
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr 
                key={vehicle.id}
                onClick={() => onVehicleSelect(vehicle)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedVehicle?.id === vehicle.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                {/* Vehicle Name & Model */}
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
                      <div className="w-6 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
                        <div className="w-3 h-2 bg-green-600 rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {vehicle.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vehicle.model}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(vehicle.status)}`}></div>
                    <span className="text-xs font-medium text-gray-700">
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>
                </td>

                {/* Operator */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs text-gray-600">
                    {vehicle.operator ? (
                      <>
                        <User className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-24">{vehicle.operator.split(' ')[0]} {vehicle.operator.split(' ')[1]?.[0]}.</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Не назначен</span>
                    )}
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="truncate max-w-32">{vehicle.location.address}</span>
                  </div>
                </td>

                {/* Speed */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs">
                    <Zap className="w-3 h-3 mr-1 text-blue-500" />
                    <span className="font-medium">{vehicle.speed || 0} км/ч</span>
                  </div>
                </td>

                {/* Fuel */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs">
                    <Fuel className="w-3 h-3 mr-1 text-blue-500" />
                    <span className={`font-medium ${getFuelColor(vehicle.fuel || 0)}`}>
                      {vehicle.fuel || 0}%
                    </span>
                  </div>
                </td>

                {/* Battery */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs">
                    <Battery className="w-3 h-3 mr-1 text-green-500" />
                    <span className={`font-medium ${getBatteryColor(vehicle.battery)}`}>
                      {vehicle.battery}%
                    </span>
                  </div>
                </td>

                {/* Engine Hours */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs">
                    <Timer className="w-3 h-3 mr-1 text-blue-500" />
                    <span className="font-medium">{vehicle.engineHours || 0}h</span>
                  </div>
                </td>

                {/* Last Update */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1 text-gray-400" />
                    {new Date(vehicle.lastUpdate).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Summary */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Всего объектов: {vehicles.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Активных: {vehicles.filter(v => v.status === 'online').length}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              Проблемы: {vehicles.filter(v => v.status === 'warning').length}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
              Неактивных: {vehicles.filter(v => v.status === 'offline').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}