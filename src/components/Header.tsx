import { Search, Bell, HelpCircle, User, FileText, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-6">
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">
            UNI
          </div>
          <span className="text-gray-600 text-sm hidden sm:inline">Пошук</span>
        </div>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Пошук"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-48 lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          <span className="hidden sm:inline">Оголошення</span>
          <span className="sm:hidden">+</span>
        </button>
        
        <div className="hidden lg:flex items-center space-x-3 text-gray-600">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FileText className="w-5 h-5" />
          </button>
          <span className="text-sm">Довідковець</span>
        </div>

        <div className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}