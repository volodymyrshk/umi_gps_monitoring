import { useState, useEffect, useRef } from 'react';
import { Vehicle, VehicleFilter } from '@/lib/entities/vehicle';
import ExpandableVehicleCard from './ExpandableVehicleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Menu, X, ChevronDown, ChevronRight, Calendar, 
  Users, MapPin, Fuel, Settings, AlertTriangle,
  Truck, Car, Wrench, FileText, Map, Layers, Filter,
  Clock, History, Play, Route, CheckSquare
} from 'lucide-react';

interface ComprehensiveSidebarProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  onFilterChange: (filters: VehicleFilter) => void;
  isOpen?: boolean;
  onClose?: () => void;
  pathQuery?: any;
  onPathQueryChange?: (query: any) => void;
  showPaths?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
  isExpanded: boolean;
  items?: Array<{
    id: string;
    name: string;
    count?: number;
    status?: 'online' | 'offline' | 'warning';
  }>;
}

export default function ComprehensiveSidebar({ 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect, 
  onFilterChange, 
  isOpen, 
  onClose,
  pathQuery,
  onPathQueryChange,
  showPaths
}: ComprehensiveSidebarProps) {
  const [folderExpanded, setFolderExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const vehicleListRef = useRef<HTMLDivElement>(null);
  
  // Scroll to selected vehicle when it changes
  useEffect(() => {
    if (selectedVehicle && vehicleListRef.current && folderExpanded) {
      const vehicleElement = vehicleListRef.current.querySelector(`[data-vehicle-id="${selectedVehicle.id}"]`);
      if (vehicleElement) {
        vehicleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedVehicle, folderExpanded]);
  
  // Path tracking state
  const [showPathControls, setShowPathControls] = useState(false);
  const [selectedVehiclesForPath, setSelectedVehiclesForPath] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('objects');
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    {
      id: 'objects',
      name: 'Объекты',
      icon: <Truck className="w-4 h-4" />,
      count: vehicles.length,
      isExpanded: false,
      items: [
        { id: 'all', name: 'Все объекты', count: vehicles.length },
        { id: 'online', name: 'Активные', count: vehicles.filter(v => v.status === 'online').length, status: 'online' },
        { id: 'warning', name: 'Проблемы', count: vehicles.filter(v => v.status === 'warning').length, status: 'warning' },
        { id: 'offline', name: 'Неактивные', count: vehicles.filter(v => v.status === 'offline').length, status: 'offline' }
      ]
    },
    {
      id: 'users',
      name: 'Пользователи',
      icon: <Users className="w-4 h-4" />,
      count: 3,
      isExpanded: false
    },
    {
      id: 'regions',
      name: 'Районы',
      icon: <MapPin className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'control-zones',
      name: 'Контрольные зоны',
      icon: <Map className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'fields',
      name: 'Поля',
      icon: <Layers className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'land-plots',
      name: 'Земельные участки',
      icon: <FileText className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'agro-culture',
      name: 'Агрокультуры',
      icon: <Settings className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'attached-devices',
      name: 'Прицепные устройства',
      icon: <Wrench className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'aggregates',
      name: 'Агрегаты',
      icon: <Car className="w-4 h-4" />,
      isExpanded: false
    },
    {
      id: 'agroavions',
      name: 'Агроавионы',
      icon: <AlertTriangle className="w-4 h-4" />,
      isExpanded: false
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const toggleCategory = (categoryId: string) => {
    setMenuCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isExpanded: !cat.isExpanded }
          : cat
      )
    );
    setActiveCategory(categoryId);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    if (categoryId === 'objects') {
      let filters: VehicleFilter = {};
      
      switch (subcategoryId) {
        case 'all':
          filters = {};
          break;
        case 'online':
          filters = { status: 'online' };
          break;
        case 'warning':
          filters = { status: 'warning' };
          break;
        case 'offline':
          filters = { status: 'offline' };
          break;
      }
      
      onFilterChange(filters);
    }
  };

  const getFilteredVehicles = () => {
    return vehicles;
  };

  return (
    <div className={`fixed top-20 left-4 bottom-4 w-96 z-[1001] ${
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
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Фильтры</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
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

          {/* Simple Filters Dropdown */}
          {showFilters && (
            <div className="px-4 pb-3">
              <div className="bg-muted rounded-lg p-2">
                <div className="flex items-center justify-between space-x-2">
                  <Button
                    onClick={() => {setActiveFilter('all'); onFilterChange({});}}
                    variant={activeFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Все
                  </Button>
                  <Button
                    onClick={() => {setActiveFilter('online'); onFilterChange({status: 'online'});}}
                    variant={activeFilter === 'online' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Активные
                  </Button>
                  <Button
                    onClick={() => {setActiveFilter('warning'); onFilterChange({status: 'warning'});}}
                    variant={activeFilter === 'warning' ? 'default' : 'ghost'}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Проблемы
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Folder: Tariff August 2024 */}
          <button 
            onClick={() => setFolderExpanded(!folderExpanded)}
            className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-3 h-3 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-gray-900">Тарировка Август 2024</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-lg text-xs font-medium">{vehicles.length}</span>
              </div>
              {folderExpanded ? 
                <ChevronDown className="w-3 h-3 text-gray-500" /> : 
                <ChevronRight className="w-3 h-3 text-gray-500" />
              }
            </div>
          </button>
        </div>

        {/* Vehicle List */}
        {folderExpanded && (
          <div ref={vehicleListRef} className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4">
            {getFilteredVehicles().map((vehicle) => (
              <div key={vehicle.id} data-vehicle-id={vehicle.id}>
                <ExpandableVehicleCard
                  vehicle={vehicle}
                  isSelected={selectedVehicle?.id === vehicle.id}
                  onClick={onVehicleSelect}
                />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Footer with Path Tracking and Stats */}
        <div className="p-4 border-t border-gray-100/50 space-y-3">
          
          {/* Path Tracking Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant={showPaths ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log('Path controls toggle clicked, current state:', showPathControls);
                setShowPathControls(!showPathControls);
              }}
              className="flex items-center space-x-2"
            >
              <Route className="w-4 h-4" />
              <span>История движения</span>
            </Button>
          </div>

          {/* Path Controls - Show when enabled */}
          {showPathControls && (
            <div className="bg-gray-50 rounded-xl p-3 space-y-3">
              {/* Time Range Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Период</span>
                  <Calendar className="w-3 h-3 text-gray-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {[
                    { key: 'today', label: 'Сегодня' },
                    { key: 'yesterday', label: 'Вчера' },
                    { key: 'week', label: '7 дней' },
                    { key: 'custom', label: 'Выбрать' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setTimeRange(option.key)}
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        timeRange === option.key 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range */}
                {timeRange === 'custom' && (
                  <div className="space-y-2">
                    <input
                      type="datetime-local"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full text-xs p-1 border border-gray-200 rounded"
                      placeholder="Начало"
                    />
                    <input
                      type="datetime-local"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full text-xs p-1 border border-gray-200 rounded"
                      placeholder="Конец"
                    />
                  </div>
                )}
              </div>

              {/* Vehicle Selection for Path */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Транспорт</span>
                  <CheckSquare className="w-3 h-3 text-gray-500" />
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {vehicles.slice(0, 5).map(vehicle => (
                    <label key={vehicle.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVehiclesForPath.includes(vehicle.id)}
                        onChange={(e) => {
                          console.log('Vehicle selection changed:', vehicle.id, 'checked:', e.target.checked);
                          if (e.target.checked) {
                            const newSelection = [...selectedVehiclesForPath, vehicle.id];
                            console.log('New selection:', newSelection);
                            setSelectedVehiclesForPath(newSelection);
                          } else {
                            const newSelection = selectedVehiclesForPath.filter(id => id !== vehicle.id);
                            console.log('New selection after removal:', newSelection);
                            setSelectedVehiclesForPath(newSelection);
                          }
                        }}
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-xs text-gray-700 truncate">
                        {vehicle.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  console.log('Show paths button clicked');
                  console.log('Selected vehicles:', selectedVehiclesForPath);
                  console.log('Time range:', timeRange);
                  console.log('onPathQueryChange exists:', !!onPathQueryChange);
                  
                  if (onPathQueryChange) {
                    const startTime = timeRange === 'custom' && customStartDate 
                      ? new Date(customStartDate)
                      : timeRange === 'yesterday'
                      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
                      : timeRange === 'week'
                      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      : new Date(new Date().setHours(0, 0, 0, 0));
                      
                    const endTime = timeRange === 'custom' && customEndDate
                      ? new Date(customEndDate)
                      : new Date();

                    console.log('Calling onPathQueryChange with:', {
                      vehicleIds: selectedVehiclesForPath,
                      startTime,
                      endTime,
                      resolution: 'medium'
                    });

                    onPathQueryChange({
                      vehicleIds: selectedVehiclesForPath,
                      startTime,
                      endTime,
                      resolution: 'medium'
                    });
                  } else {
                    console.error('onPathQueryChange is not provided');
                  }
                }}
                disabled={selectedVehiclesForPath.length === 0}
              >
                <Play className="w-3 h-3 mr-1" />
                Показать пути
              </Button>
            </div>
          )}

          {/* Standard Calendar Display when not in path mode */}
          {!showPathControls && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700">Период</span>
                <Calendar className="w-3 h-3 text-gray-500" />
              </div>
              <div className="text-xs font-medium text-gray-600">
                Сегодня - {new Date().toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
          
          {/* Simplified Stats - Just text */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600 font-medium">
              Активных: {vehicles.filter(v => (v.status?.status || v.status) === 'online').length}
            </span>
            <span className="text-red-600 font-medium">
              Проблемы: {vehicles.filter(v => (v.status?.status || v.status) === 'warning').length}
            </span>
          </div>
          
          <div className="text-center">
            <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}