import { useState } from 'react';
import { Property, PropertyFilter } from '@/types/property';
import PropertyCard from './PropertyCard';
import { Filter, Calendar, Plus, X } from 'lucide-react';

interface SidebarProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  onFilterChange: (filters: PropertyFilter) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ properties, selectedProperty, onPropertySelect, onFilterChange, isOpen, onClose }: SidebarProps) {
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<PropertyFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col md:relative md:transform-none md:transition-none ${
      isOpen ? 'sidebar-mobile open' : 'sidebar-mobile'
    } md:block`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Об'єкти</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Тип операції
              </label>
              <select
                className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange({ type: e.target.value as 'rent' | 'sale' || undefined })}
              >
                <option value="">Всі</option>
                <option value="rent">Оренда</option>
                <option value="sale">Продаж</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ціна від
                </label>
                <input
                  type="number"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  до
                </label>
                <input
                  type="number"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                  placeholder="∞"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Торгова: Август 2024</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">3</span>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          17 Авг 2024 - 23 Авг 2024
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={onPropertySelect}
            />
          ))}
          
          {properties.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Не знайдено жодного об'єкта</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Додати об'єкт</span>
        </button>
      </div>
    </div>
  );
}