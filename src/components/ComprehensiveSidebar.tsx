import { useState, useEffect, useRef } from 'react';
import { Vehicle, VehicleFilter } from '@/lib/entities/vehicle';
import ExpandableVehicleCard from './ExpandableVehicleCard';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, ChevronDown, Calendar, 
  Users, MapPin, Settings, AlertTriangle,
  Truck, Car, Wrench, FileText, Map, Layers, Filter,
  Folder, FolderOpen
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
  const [secondFolderExpanded, setSecondFolderExpanded] = useState(false);
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

        </div>

        {/* Folder Structure */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* First Folder: Tariff August 2024 */}
          <div className="mb-2">
            <button 
              onClick={() => setFolderExpanded(!folderExpanded)}
              className="w-full text-left flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors group"
            >
              {folderExpanded ? (
                <FolderOpen className="w-4 h-4 text-gray-600 flex-shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-gray-900 flex-1">Тарировка Август 2024</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{vehicles.length}</span>
            </button>
            
            {/* Vehicle List for First Folder */}
            {folderExpanded && (
              <div className="ml-4 relative">
                {/* Tree line */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200"></div>
                
                <div ref={vehicleListRef} className="space-y-2 pt-2">
                  {getFilteredVehicles().map((vehicle, index) => (
                    <div key={vehicle.id} data-vehicle-id={vehicle.id} className="relative">
                      {/* Tree connector */}
                      <div className="absolute left-2 top-4 w-3 h-px bg-gray-200"></div>
                      <div className="ml-6 pl-2">
                        <ExpandableVehicleCard
                          vehicle={vehicle}
                          isSelected={selectedVehicle?.id === vehicle.id}
                          onClick={onVehicleSelect}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Second Folder: Historical Data */}
          <div className="mb-2">
            <button 
              onClick={() => setSecondFolderExpanded(!secondFolderExpanded)}
              className="w-full text-left flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors group"
            >
              {secondFolderExpanded ? (
                <FolderOpen className="w-4 h-4 text-gray-600 flex-shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-gray-900 flex-1">Архивные данные</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">2</span>
            </button>
            
            {/* Archive List for Second Folder */}
            {secondFolderExpanded && (
              <div className="ml-4 relative">
                {/* Tree line */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200"></div>
                
                <div className="space-y-1 pt-2">
                  <div className="relative">
                    <div className="absolute left-2 top-4 w-3 h-px bg-gray-200"></div>
                    <div className="ml-6 pl-2 flex items-center space-x-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Тарировка Июль 2024</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-2 top-4 w-3 h-px bg-gray-200"></div>
                    <div className="ml-6 pl-2 flex items-center space-x-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Тарировка Июнь 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Folders to match reference */}
          <div className="mb-2">
            <button className="w-full text-left flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors group">
              <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 flex-1">Данные телеметрии</span>
            </button>
          </div>

          <div className="mb-2">
            <button className="w-full text-left flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors group">
              <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 flex-1">Отчеты работы</span>
            </button>
          </div>
        </div>

        {/* Enhanced Footer with Path Tracking and Stats */}
        <div className="p-4 border-t border-gray-100/50 space-y-3">
          

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