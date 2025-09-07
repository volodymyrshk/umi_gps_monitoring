import { Property } from '@/types/property';
import { MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  onClick: (property: Property) => void;
}

export default function PropertyCard({ property, isSelected, onClick }: PropertyCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-orange-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={() => onClick(property)}
    >
      <div className="flex space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {property.title}
          </h3>
          
          <div className="flex items-center mt-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{property.location.address}</span>
          </div>
          
          <div className="mt-2 text-sm">
            <span className="font-semibold text-gray-900">
              {property.price.toLocaleString()} ₴
            </span>
            {property.area && (
              <span className="text-gray-600 ml-2">
                {property.area} м²
              </span>
            )}
          </div>
          
          {property.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {property.features.slice(0, 2).map((feature, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{property.features.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}