import { Search, User, Map, BarChart3, FileText, PieChart, Route } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface DockHeaderProps {
  onMenuClick?: () => void;
  showPaths?: boolean;
  onTogglePaths?: (show: boolean) => void;
}

export default function DockHeader({ onMenuClick, showPaths, onTogglePaths }: DockHeaderProps) {
  const [activeMode, setActiveMode] = useState('navigation');

  const navigationItems = [
    { id: 'navigation', icon: Map, label: 'Навигация' },
    { id: 'paths', icon: Route, label: 'История движения' },
    { id: 'dashboard', icon: BarChart3, label: 'Дашборд' },
    { id: 'analytics', icon: PieChart, label: 'Аналитика' },
    { id: 'reports', icon: FileText, label: 'Отчеты' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[1002] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="h-10 rounded-xl overflow-hidden">
              <Image
                src="/cube.jpg"
                alt="Logo"
                width={71}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Поиск"
                className="pl-10 pr-4 py-2 bg-muted border-0 rounded-2xl text-sm placeholder:text-muted-foreground focus:bg-muted focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
          </div>

          {/* Center Section - Clean Navigation */}
          <div className="flex items-center">
            <TooltipProvider>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl">
                {navigationItems.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          setActiveMode(item.id);
                          if (item.id === 'paths' && onTogglePaths) {
                            onTogglePaths(!showPaths);
                          }
                        }}
                        variant={activeMode === item.id ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                          "h-8 px-3 rounded-xl transition-all duration-200",
                          activeMode === item.id 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-background/50 text-gray-700'
                        )}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Right Section - User */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground font-medium">Справочники</span>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}