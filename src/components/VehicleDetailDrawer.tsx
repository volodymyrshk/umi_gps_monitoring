'use client';

import { useState } from 'react';
import { Vehicle } from '@/lib/entities/vehicle';
import { VehicleDataGenerator } from '@/lib/generators/vehicle-generator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, ChevronDown, X, 
  Gauge, Fuel, Timer, Clock, 
  MapPin, Thermometer, AlertTriangle,
  Activity, BarChart3, History, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VehicleDetailDrawerProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'telemetry' | 'history' | 'analytics';

export default function VehicleDetailDrawer({ 
  vehicle, 
  isOpen, 
  onClose 
}: VehicleDetailDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!vehicle) return null;

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Activity },
    { id: 'telemetry', label: 'Телеметрия', icon: Gauge },
    { id: 'history', label: 'История', icon: History },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed right-4 z-[1002] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-900/10 border border-white/20 flex flex-col overflow-hidden ${
            isExpanded 
              ? 'top-20 bottom-4 w-96' 
              : 'top-20 w-80 h-auto'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img
                    src="/JohnDeere.jpeg"
                    alt="John Deere"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = 
                        '<div class="w-full h-full bg-green-500 flex items-center justify-center"><span class="text-white font-bold text-xs">JD</span></div>';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.displayName}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronUp className="w-4 h-4 text-gray-600" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation - Only show when expanded */}
            {isExpanded && (
              <div className="flex space-x-1 mt-3">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Content */}
          <div className={`${isExpanded ? 'flex-1 overflow-y-auto' : ''}`}>
            {isExpanded ? (
              <div className="p-4">
                {activeTab === 'overview' && <OverviewTab vehicle={vehicle} />}
                {activeTab === 'telemetry' && <TelemetryTab vehicle={vehicle} />}
                {activeTab === 'history' && <HistoryTab vehicle={vehicle} />}
                {activeTab === 'analytics' && <AnalyticsTab vehicle={vehicle} />}
              </div>
            ) : (
              <div className="p-4">
                <CompactOverview vehicle={vehicle} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CompactOverview({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            vehicle.status.status === 'online' ? 'bg-green-500' : 
            vehicle.status.status === 'warning' ? 'bg-red-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-gray-600">
            {vehicle.status.status === 'online' ? 'Онлайн' : 
             vehicle.status.status === 'warning' ? 'Проблема' : 'Офлайн'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Fuel className="w-3 h-3 text-green-500" />
          <span className="font-medium">{VehicleDataGenerator.getVehicleFuelLevel(vehicle.id)}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <Gauge className="w-3 h-3 text-blue-500" />
          <span>{vehicle.speed || 0} км/ч</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3 text-orange-500" />
          <span>{vehicle.roadTime || 0}ч</span>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ vehicle }: { vehicle: Vehicle }) {
  // Generate fuel level data for the last 24 hours using consistent data
  const consistentFuelLevel = VehicleDataGenerator.getVehicleFuelLevel(vehicle.id);
  const fuelData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(i);
    // Simulate fuel consumption throughout the day based on consistent base level
    const consumption = Math.max(0, consistentFuelLevel - (i * 2) + Math.random() * 10 - 5);
    return {
      time: hour.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      hour: i.toString(),
      fuel: Math.round(Math.min(100, Math.max(0, consumption))),
    };
  });

  const chartConfig = {
    fuel: {
      label: "Fuel Level (%)",
      color: "#22c55e", // Green color
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">

      {/* Fuel Level Chart */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-green-500" />
            Уровень топлива
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            За последние 24 часа • Текущий уровень: {consistentFuelLevel}%
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={chartConfig} className="h-[120px] w-full">
            <AreaChart
              accessibilityLayer
              data={fuelData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={5}
                tickFormatter={(value) => `${value}:00`}
                fontSize={10}
                fill="#6b7280"
              />
              <ChartTooltip 
                cursor={{ stroke: 'transparent' }}
                content={<ChartTooltipContent 
                  labelFormatter={(label) => `${label}:00`}
                  formatter={(value) => [`${value}%`, 'Топливо']}
                />} 
              />
              <defs>
                <linearGradient id="fillFuelOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="fuel"
                type="natural"
                fill="url(#fillFuelOverview)"
                fillOpacity={0.6}
                stroke="#22c55e"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-700">Локация</span>
          </div>
          <p className="text-xs text-gray-600 font-medium">{vehicle.currentLocation.address?.split(',')[0] || 'Неизвестно'}</p>
          <p className="text-xs text-gray-500 mt-1">
            {vehicle.currentLocation.lat?.toFixed(4) || 'N/A'}, {vehicle.currentLocation.lng?.toFixed(4) || 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Скорость</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{vehicle.speed || 0}</p>
          <p className="text-xs text-gray-500">км/ч</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Моточасы</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{vehicle.engineHours || 0}</p>
          <p className="text-xs text-gray-500">часов</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-gray-700">В дороге</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{vehicle.roadTime || 0}</p>
          <p className="text-xs text-gray-500">часов</p>
        </div>
      </div>
    </div>
  );
}

function TelemetryTab({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{vehicle.engineHours || 0}h</div>
        <div className="text-xs text-gray-500">Моточасы</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <Gauge className="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{vehicle.rpm || 0}</div>
        <div className="text-xs text-gray-500">RPM</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{vehicle.engineTemp || 85}°C</div>
        <div className="text-xs text-gray-500">Температура</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <Fuel className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{VehicleDataGenerator.getVehicleFuelLevel(vehicle.id)}%</div>
        <div className="text-xs text-gray-500">Топливо</div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <Activity className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{vehicle.battery || 0}%</div>
        <div className="text-xs text-gray-500">Заряд</div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <MapPin className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <div className="text-lg font-bold text-gray-900">{vehicle.speed || 0}</div>
        <div className="text-xs text-gray-500">км/ч</div>
      </div>
    </div>
  );
}

function HistoryTab({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Последние события:</div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900">
                {i === 0 && 'Двигатель запущен'}
                {i === 1 && 'Изменение скорости'}
                {i === 2 && 'Геозона: въезд'}
                {i === 3 && 'Остановка двигателя'}
                {i === 4 && 'Низкий уровень топлива'}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(Date.now() - i * 3600000).toLocaleTimeString('ru-RU')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ vehicle }: { vehicle: Vehicle }) {
  // Generate fuel level data for the last 24 hours using consistent data
  const consistentFuelLevel = VehicleDataGenerator.getVehicleFuelLevel(vehicle.id);
  const fuelData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(i);
    // Simulate fuel consumption throughout the day based on consistent base level
    const consumption = Math.max(0, consistentFuelLevel - (i * 2) + Math.random() * 10 - 5);
    return {
      time: hour.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      hour: i.toString(),
      fuel: Math.round(Math.min(100, Math.max(0, consumption))),
    };
  });

  const chartConfig = {
    fuel: {
      label: "Fuel Level (%)",
      color: "#22c55e", // Green color
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      {/* Fuel Level Chart */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">Уровень топлива</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            За последние 24 часа
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <AreaChart
              accessibilityLayer
              data={fuelData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={3}
                tickFormatter={(value) => `${value}:00`}
                fontSize={10}
                fill="#6b7280"
              />
              <ChartTooltip 
                cursor={{ stroke: 'transparent' }}
                content={<ChartTooltipContent 
                  labelFormatter={(label) => `${label}:00`}
                  formatter={(value) => [`${value}%`, 'Топливо']}
                />} 
              />
              <defs>
                <linearGradient id="fillFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="fuel"
                type="natural"
                fill="url(#fillFuel)"
                fillOpacity={0.6}
                stroke="#22c55e"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="pt-2 pb-0">
          <div className="flex w-full items-start gap-2 text-xs">
            <div className="grid gap-1">
              <div className="flex items-center gap-2 font-medium text-gray-700">
                Текущий уровень: {consistentFuelLevel}% <Fuel className="h-3 w-3 text-green-500" />
              </div>
              <div className="text-gray-500 flex items-center gap-2">
                {fuelData[fuelData.length - 1]?.fuel > fuelData[0]?.fuel ? 'Заправка' : 'Расход'} за день
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Сегодня</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Пробег:</span>
              <span className="font-medium">42 км</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Топливо:</span>
              <span className="font-medium">12.5 л</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Моточасы:</span>
              <span className="font-medium">3.2 ч</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">На этой неделе</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Пробег:</span>
              <span className="font-medium">287 км</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Топливо:</span>
              <span className="font-medium">89.2 л</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Моточасы:</span>
              <span className="font-medium">22.1 ч</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}