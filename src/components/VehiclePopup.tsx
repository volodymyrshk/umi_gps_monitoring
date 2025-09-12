"use client"

import { Vehicle } from '@/lib/entities/vehicle'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import FuelLevelChart from './FuelLevelChart'
import { 
  MapPin, 
  Clock, 
  Gauge, 
  Wifi, 
  WifiOff,
  Navigation,
  Timer,
  User,
  CreditCard,
  Thermometer,
  Calendar,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehiclePopupProps {
  vehicle: Vehicle
  onClose: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function VehiclePopup({ vehicle, onClose, position = 'right' }: VehiclePopupProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-red-100 text-red-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Активен'
      case 'warning': return 'Проблема'
      case 'offline': return 'Неактивен'
      default: return 'Неизвестно'
    }
  }

  const formatLastUpdate = () => {
    const lastUpdate = vehicle.lastUpdate || vehicle.status?.lastUpdate || new Date()
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - new Date(lastUpdate).getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'только что'
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч. назад`
    return new Date(lastUpdate).toLocaleString('ru-RU')
  }

  return (
    <Card className={cn(
      "w-96 shadow-2xl border-0 bg-white/98 backdrop-blur-lg",
      "animate-in fade-in-0 zoom-in-95 duration-200",
      position === 'left' && "slide-in-from-right-2",
      position === 'right' && "slide-in-from-left-2",
      position === 'top' && "slide-in-from-bottom-2",
      position === 'bottom' && "slide-in-from-top-2"
    )}>
      {/* Compact Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* John Deere Logo */}
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              <img 
                src="/JohnDeere.jpeg" 
                alt="John Deere" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {vehicle.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-600">{vehicle.displayName || vehicle.model}</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">{formatLastUpdate()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`${getStatusColor(vehicle.status?.status || vehicle.status)} text-xs px-2 py-0.5`}>
              {getStatusText(vehicle.status?.status || vehicle.status)}
            </Badge>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{vehicle.speed || 0}</div>
            <div className="text-xs text-gray-500">км/ч</div>
            <div className="text-xs text-gray-600">Скорость</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {(vehicle.status?.status || vehicle.status) === 'online' ? 'Онлайн' : 'Офлайн'}
            </div>
            <div className="text-xs text-gray-500">Связь</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{vehicle.fuel?.level || vehicle.fuel || 0}%</div>
            <div className="text-xs text-gray-500">Топливо</div>
          </div>
        </div>

        {/* Fuel Level Chart - Compact */}
        <div className="bg-gray-50 rounded-lg p-2 border-b border-gray-100">
          <FuelLevelChart currentLevel={vehicle.fuel?.level || vehicle.fuel || 0} />
        </div>

        {/* Technical Stats Grid - 2x2 layout */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs py-2 border-b border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <Timer className="w-3 h-3 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">{vehicle.engineHours || 0}h</div>
              <div className="text-gray-500">Моточасы</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Gauge className="w-3 h-3 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">{vehicle.rpm || 0}</div>
              <div className="text-gray-500">RPM</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Thermometer className="w-3 h-3 text-red-500" />
            <div>
              <div className="font-bold text-gray-900">{vehicle.engineTemp || 85}°C</div>
              <div className="text-gray-500">Темп.</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-3 h-3 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">{vehicle.roadTime || 0}ч</div>
              <div className="text-gray-500">В дороге</div>
            </div>
          </div>
        </div>

        {/* Bottom Info Row */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Location */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
            <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
            <span className="text-gray-700 truncate">
              {vehicle.currentLocation?.address?.slice(0, 25) || 
               `${vehicle.currentLocation?.latitude?.toFixed(4)}, ${vehicle.currentLocation?.longitude?.toFixed(4)}`}
            </span>
          </div>
          
          {/* Distance & RFID */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <div className="flex items-center space-x-1">
              <CreditCard className={`w-3 h-3 ${vehicle.rfidConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`font-medium ${vehicle.rfidConnected ? 'text-green-600' : 'text-red-600'}`}>
                {vehicle.rfidConnected ? 'OK' : 'НЕТ'}
              </span>
            </div>
            <div className="text-blue-600 font-bold">
              {((vehicle.totalDistance || 0) / 1000).toFixed(1)} км
            </div>
          </div>
        </div>

        {/* Driver Info - Compact */}
        {vehicle.operator && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-xs">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3 text-blue-500" />
              <span className="font-medium text-blue-900">{vehicle.operator}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${vehicle.isWorking ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-blue-700">
                {vehicle.isWorking ? 'Работает' : 'Не работает'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}