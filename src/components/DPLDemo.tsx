'use client';

import { useState, useEffect } from 'react';
import { dplService, TrackerData, ProcessedData } from '@/lib/dpl-simple';

export default function DPLDemo() {
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Generate demo tracker data
      const rawData = dplService.generateDemoData('demo_device_001');
      const processed = dplService.process(rawData);
      
      setTrackerData(rawData);
      setProcessedData(processed);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl">
      <h3 className="text-lg font-bold mb-4">DPL Demo - Real-time Processing</h3>
      
      <button
        onClick={() => setIsActive(!isActive)}
        className={`px-4 py-2 rounded mb-4 ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isActive ? 'Stop Processing' : 'Start Processing'}
      </button>

      {trackerData && processedData && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Raw Tracker Data</h4>
            <div className="text-sm space-y-1">
              <div>Device: {trackerData.deviceId}</div>
              <div>Speed: {trackerData.speed.toFixed(1)} km/h</div>
              <div>Fuel: {trackerData.fuel.toFixed(1)}%</div>
              <div>Engine: {trackerData.engineOn ? 'ON' : 'OFF'}</div>
              <div>Driver: {trackerData.driverRfid || 'None'}</div>
              <div>Location: {trackerData.location.lat.toFixed(4)}, {trackerData.location.lng.toFixed(4)}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-600 mb-2">Processed Data</h4>
            <div className="text-sm space-y-1">
              <div>Driving Time: {processedData.drivingTimeMinutes.toFixed(1)} min</div>
              <div>Fuel Used: {processedData.fuelConsumptionL.toFixed(2)} L</div>
              <div>Est. RPM: {processedData.estimatedRpm}</div>
              <div>Auth Driver: {processedData.hasAuthenticatedDriver ? 'YES' : 'NO'}</div>
              <div>Connection: {processedData.connectionOk ? 'OK' : 'FAIL'}</div>
              <div>Motor Hours: {processedData.motorHours.toFixed(2)}h</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}