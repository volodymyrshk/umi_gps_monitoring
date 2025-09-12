import { Search, Bell, HelpCircle, User, FileText, Menu, Map, BarChart3, Clock, Archive } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
            <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl text-sm font-bold">
              UNI
            </div>
            
            {/* Search Bar - Moved to left */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Поиск"
                className="pl-10 pr-4 py-2 bg-muted border-0 rounded-2xl text-sm placeholder:text-muted-foreground focus:bg-background w-64"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Modes */}
            <div className="flex items-center">
              <Button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-2xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                <Map className="w-4 h-4" />
                <span>Навигация</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="p-2 rounded-xl">
                <Clock className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-xl">
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-xl">
                <Archive className="w-4 h-4" />
              </Button>
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