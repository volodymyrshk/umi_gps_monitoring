# Path Tracking System - Implementation Guide

## Overview
The U-Monitoring system now includes a sophisticated path tracking system that allows users to select time periods and view vehicle movement paths on the map.

## Key Features

### 1. Time-Based Position Tracking
- **GPS Points**: Every telemetry record includes precise GPS coordinates with timestamps
- **High-Resolution Data**: Configurable sampling rates (10 seconds to 5 minutes)
- **Path Segmentation**: Automatically separates working, transport, and idle periods
- **Real-time Updates**: Live tracking with latest position data

### 2. Time Period Selection
```typescript
interface PathQuery {
  vehicleIds: string[];
  startTime: Date;        // User-selected start time
  endTime: Date;          // User-selected end time
  resolution: 'high' | 'medium' | 'low'; // Data density
  includeStops?: boolean;
  minDistance?: number;   // Filter out small movements
}
```

### 3. Path Visualization Options
- **Color Coding**: By speed, activity status, or operator
- **Direction Indicators**: Arrow markers showing travel direction
- **Stop Markers**: Significant pause locations with duration
- **Segment Types**: Visual distinction between work/transport/idle periods

## How to Use Path Tracking

### 1. Time Range Selection
**Pre-defined Ranges:**
- Last Hour (high resolution)
- Today (medium resolution)
- Yesterday (medium resolution)
- Last 7 Days (low resolution)
- Last 30 Days (low resolution)

**Custom Range:**
Users can select any start/end datetime combination using the date picker interface.

### 2. Vehicle Selection
- Select single or multiple vehicles from the fleet list
- Filter by vehicle type, operator, or status
- Toggle individual vehicle paths on/off

### 3. Display Controls
```typescript
interface PathVisualizationOptions {
  colorBySpeed?: boolean;     // Color paths by speed
  colorByStatus?: boolean;    // Color by working/idle status
  showDirection?: boolean;    // Show movement direction
  showStops?: boolean;        // Display stop markers
  smoothing?: boolean;        // Apply path smoothing
  clustering?: boolean;       // Group nearby stops
  heatmap?: boolean;         // Show activity heat map
}
```

## Data Structure

### Path Points
```typescript
interface PathPoint {
  id: string;
  vehicleId: string;
  timestamp: Date;           // Exact time of GPS reading
  location: Location;        // GPS coordinates
  speed: number;            // Speed at this moment
  heading: number;          // Travel direction
  metadata?: {
    engineRunning?: boolean;
    isWorking?: boolean;    // Implement active
    taskId?: string;        // Associated field task
    operatorId?: string;    // Current driver
  };
}
```

### Path Segments
```typescript
interface PathSegment {
  id: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  points: PathPoint[];      // Array of GPS points
  distance: number;         // Total segment distance (meters)
  duration: number;         // Time duration (seconds)
  averageSpeed: number;     // km/h
  maxSpeed: number;         // km/h  
  type: 'transport' | 'working' | 'idle' | 'unknown';
}
```

## Implementation in Components

### Updated Map Component
```typescript
<Map 
  vehicles={filteredVehicles}
  selectedVehicle={selectedVehicle}
  onVehicleSelect={setSelectedVehicle}
  showPaths={showPaths}           // Toggle path display
  pathSegments={pathSegments}     // Path data to render
/>
```

### Updated Sidebar with Path Controls
```typescript
<ComprehensiveSidebar 
  vehicles={filteredVehicles}
  selectedVehicle={selectedVehicle}
  onVehicleSelect={setSelectedVehicle}
  onFilterChange={handleFilterChange}
  pathQuery={pathQuery}           // Current time/vehicle selection
  onPathQueryChange={setPathQuery} // Update path query
  showPaths={showPaths}
  // ... other props
/>
```

## Data Service Usage

### Fetching Path Data
```typescript
import { PathTrackingService } from '@/lib/services/path-tracking';

const pathSegments = await PathTrackingService.getVehiclePaths({
  vehicleIds: ['vehicle_001', 'vehicle_002'],
  startTime: new Date('2025-09-07T00:00:00Z'),
  endTime: new Date('2025-09-07T23:59:59Z'),
  resolution: 'medium',
  includeStops: true
});
```

### Path Optimization
```typescript
// Reduce points for better performance
const optimizedPoints = PathTrackingService.optimizePathForDisplay(
  pathPoints, 
  1000 // maximum points
);
```

## User Interface Flow

### 1. Enable Path Mode
- User clicks "Show Paths" toggle in header
- Map switches to path visualization mode
- Path controls become available in sidebar

### 2. Select Time Period
- Choose from preset ranges (Today, Yesterday, etc.)
- Or use custom date/time pickers
- Resolution automatically adjusts based on range

### 3. Select Vehicles
- Check vehicles in sidebar list
- Path query updates with selected vehicle IDs
- Map immediately shows paths for selected vehicles

### 4. Customize Display
- Toggle path colors (speed vs. status)
- Show/hide direction arrows
- Show/hide stop markers
- Apply path smoothing for cleaner display

## Performance Considerations

### Data Optimization
- **Point Reduction**: Automatically reduces points for large time ranges
- **Viewport Filtering**: Only loads paths visible in current map view
- **Lazy Loading**: Loads path data on-demand when switching vehicles
- **Caching**: Caches frequently accessed path segments

### Memory Management
- **Segment Chunking**: Breaks long paths into manageable segments
- **Progressive Loading**: Loads high-resolution data as user zooms in
- **Cleanup**: Removes off-screen path data from memory

## Example Usage Scenarios

### 1. Daily Route Analysis
```typescript
// Show today's routes for specific vehicle
const query: PathQuery = {
  vehicleIds: ['vehicle_001'],
  startTime: new Date().setHours(0, 0, 0, 0),
  endTime: new Date(),
  resolution: 'medium'
};
```

### 2. Multi-Vehicle Comparison
```typescript
// Compare efficiency of multiple operators
const query: PathQuery = {
  vehicleIds: ['vehicle_001', 'vehicle_002', 'vehicle_003'],
  startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endTime: new Date(),
  resolution: 'low'
};
```

### 3. Detailed Work Analysis
```typescript
// High-resolution analysis of specific field work
const query: PathQuery = {
  vehicleIds: ['vehicle_001'],
  startTime: new Date('2025-09-07T08:00:00Z'),
  endTime: new Date('2025-09-07T17:00:00Z'),
  resolution: 'high',
  includeStops: true
};
```

## Next Steps

The system is now ready for:
1. **Real-time Integration**: Connect to actual GPS tracking devices
2. **Advanced Analytics**: Add efficiency scoring and route optimization
3. **Export Functions**: Allow users to export path data as GPX/KML files
4. **Playback Controls**: Time-based animation of vehicle movements
5. **Heat Maps**: Activity density visualization for field operations