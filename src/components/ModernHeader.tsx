import { Search, Bell, HelpCircle, User, FileText, Menu, Map, BarChart3, Clock, Archive } from 'lucide-react';
import { useState } from 'react';

interface ModernHeaderProps {
  onMenuClick?: () => void;
}

export default function ModernHeader({ onMenuClick }: ModernHeaderProps) {
  const [activeMode, setActiveMode] = useState('map');

  return (
    <div className="fixed top-0 left-0 right-0 z-[1002] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold">
              UNI
            </div>
            
            {/* Search Bar - Moved to left */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск"
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all w-64"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Modes */}
            <div className="flex items-center">
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-2xl text-sm font-medium shadow-sm hover:bg-orange-600 transition-colors">
                <Map className="w-4 h-4" />
                <span>Навигация</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Clock className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <BarChart3 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Archive className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right Section - Documentation & User */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Справочники</span>
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}