import { Plus, Minus, Maximize2, MapPin, Layers, BarChart3, MessageSquare, Triangle } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut, onFullscreen }: MapControlsProps) {
  return (
    <div className="space-y-1">
      {/* Primary Controls */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-900/10 border border-white/20 p-1.5 space-y-0.5">
        <button 
          onClick={onZoomIn}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5 text-gray-700" />
        </button>
        
        <button 
          onClick={onZoomOut}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Minus className="w-3.5 h-3.5 text-gray-700" />
        </button>
        
        <button 
          onClick={onFullscreen}
          className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Maximize2 className="w-3 h-3 text-gray-700" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-900/10 border border-white/20 p-1.5 space-y-0.5">
        <button className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <MapPin className="w-3 h-3 text-gray-700" />
        </button>
        
        <button className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <div className="w-3 h-3 border-2 border-gray-700 rounded"></div>
        </button>
        
        <button className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <Triangle className="w-3 h-3 text-gray-700" />
        </button>
        
        <button className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <BarChart3 className="w-3 h-3 text-gray-700" />
        </button>
        
        <button className="w-7 h-7 bg-gray-800 hover:bg-gray-900 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <MessageSquare className="w-3 h-3 text-white" />
        </button>
        
        <button className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all hover:scale-105">
          <div className="w-3.5 h-3.5 border-2 border-gray-700 flex items-center justify-center">
            <span className="text-[9px] font-bold text-gray-700">A</span>
          </div>
        </button>
      </div>
    </div>
  );
}