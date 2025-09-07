import { Vehicle } from '@/types/vehicle';
import { 
  MapPin, Battery, Clock, Fuel, ChevronDown, Zap, 
  Gauge, Thermometer, Timer, CreditCard, User, Navigation,
  Wifi, WifiOff
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableVehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onClick: (vehicle: Vehicle) => void;
}

export default function ExpandableVehicleCard({ vehicle, isSelected, onClick }: ExpandableVehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'bg-green-500';
    if (battery > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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

  const handleCardClick = () => {
    onClick(vehicle);
    setIsExpanded(!isExpanded);
  };

  const contentVariants = {
    collapsed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    expanded: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }
    }
  };

  return (
    <div className="w-full">
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md hover:shadow-gray-200/50 overflow-hidden",
          isSelected ? 'ring-2 ring-primary shadow-md shadow-primary/20' : 'shadow-sm'
        )}
        onClick={handleCardClick}
      >
        {/* Header - Always Visible */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* John Deere Logo */}
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-2 bg-green-600 rounded-sm"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {vehicle.name.split(' ').slice(0, 2).join(' ')}
                </h3>
                <p className="text-xs text-gray-600">
                  {vehicle.model}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Badge variant="secondary" className={getStatusColor(vehicle.status)}>
                {getStatusText(vehicle.status)}
              </Badge>
              <div className={`w-6 h-3 rounded ${getBatteryColor(vehicle.battery)}`}>
                <div 
                  className="h-full bg-white/30 rounded" 
                  style={{ width: `${vehicle.battery}%` }}
                />
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="px-3 pb-3"
            >
              <CardContent className="p-0 space-y-4">
                {/* Driver Information */}
                {vehicle.operator && (
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        {vehicle.operator}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${vehicle.isWorking ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-muted-foreground">
                        {vehicle.isWorking ? 'Работает' : 'Не работает'}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Location */}
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{vehicle.location.address}</span>
                </motion.div>

                {/* Status Grid - More compact */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium">{vehicle.speed || 0} км/ч</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className={`w-3 h-3 ${vehicle.rfidConnected ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-xs ${vehicle.rfidConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {vehicle.rfidConnected ? 'RFID OK' : 'RFID НЕТ'}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-muted-foreground">{vehicle.roadTime || 0}ч в дороге</span>
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
                </motion.div>

                {/* Technical Data - More compact */}
                <motion.div 
                  className="grid grid-cols-3 gap-2 p-2 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Fuel className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="text-xs font-bold">{vehicle.fuel || 0}%</div>
                    <div className="text-xs text-muted-foreground">Топливо</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Gauge className="w-3 h-3 text-orange-500" />
                    </div>
                    <div className="text-xs font-bold">{vehicle.rpm || 0}</div>
                    <div className="text-xs text-muted-foreground">RPM</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Timer className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="text-xs font-bold">{vehicle.engineHours || 0}h</div>
                    <div className="text-xs text-muted-foreground">Моточасы</div>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    className="w-full" 
                    variant={vehicle.status === 'online' ? 'default' : 'secondary'}
                  >
                    {vehicle.status === 'online' ? 'Показать на карте' : 'Диагностика'}
                  </Button>
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}