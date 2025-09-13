'use client';

import { dplVehiclesData, DPLVehicleData } from '@/data/dpl-vehicles';

interface DPLVehiclePanelProps {
  vehicleId: string | null;
}

export default function DPLVehiclePanel({ vehicleId }: DPLVehiclePanelProps) {
  if (!vehicleId || !dplVehiclesData[vehicleId]) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a vehicle to view DPL data</p>
      </div>
    );
  }

  const data = dplVehiclesData[vehicleId];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fuel_theft': return '⛽';
      case 'speeding': return '🚨';
      case 'unauthorized': return '🔒';
      case 'maintenance': return '🔧';
      case 'geofence': return '📍';
      default: return '⚠️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-y-auto">
      {/* Driver Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Driver Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Name:</span>
            <p className="text-gray-800">{data.driver.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">RFID ID:</span>
            <p className="text-gray-800 font-mono">{data.driver.rfidId}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">License:</span>
            <p className="text-gray-800">{data.driver.licenseNumber}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Shift:</span>
            <p className="text-gray-800">{data.driver.shiftStart} - {data.driver.shiftEnd}</p>
          </div>
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Today's Performance</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <span className="font-medium text-blue-600">Driving Time</span>
            <p className="text-lg font-bold text-blue-800">{Math.floor(data.today.drivingTimeMinutes / 60)}h {data.today.drivingTimeMinutes % 60}m</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <span className="font-medium text-green-600">Distance</span>
            <p className="text-lg font-bold text-green-800">{data.today.totalDistanceKm} km</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <span className="font-medium text-blue-600">Fuel Used</span>
            <p className="text-lg font-bold text-blue-800">{data.today.fuelConsumptionL}L</p>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <span className="font-medium text-purple-600">Avg Speed</span>
            <p className="text-lg font-bold text-purple-800">{data.today.averageSpeed} km/h</p>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <span className="font-medium text-red-600">Max Speed</span>
            <p className="text-lg font-bold text-red-800">{data.today.maxSpeed} km/h</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium text-gray-600">Stops</span>
            <p className="text-lg font-bold text-gray-800">{data.today.stops}</p>
          </div>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Current Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">RPM:</span>
            <span className="ml-2 text-gray-800">{data.today.currentRpm}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Engine Temp:</span>
            <span className="ml-2 text-gray-800">{data.today.engineTemperature}°C</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Fuel Level:</span>
            <span className="ml-2 text-gray-800">{data.today.fuelLevel}%</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Motor Hours:</span>
            <span className="ml-2 text-gray-800">{data.today.motorHours}h</span>
          </div>
        </div>
      </div>

      {/* Today's Route */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Today's Route</h2>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.movements.map((movement, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-500 w-12">{movement.time}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{movement.event}</p>
                <p className="text-xs text-gray-600">{movement.location.address}</p>
                <p className="text-xs text-gray-500">{movement.speed} km/h</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Today's Alerts</h2>
          <div className="space-y-2">
            {data.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  <span className="text-sm font-medium">{alert.time}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">{alert.severity.toUpperCase()}</span>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}