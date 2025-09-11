/**
 * Path tracking service for vehicle movement history
 * Handles time-series position data for path visualization
 */

import { TelemetryRecord, GpsData } from '../telemetry/types';
import { Location } from '../entities/base';

export interface PathPoint {
  id: string;
  vehicleId: string;
  timestamp: Date;
  location: Location;
  speed: number;
  heading: number;
  accuracy: number;
  eventType?: 'start' | 'stop' | 'pause' | 'resume' | 'waypoint';
  metadata?: {
    engineRunning?: boolean;
    isWorking?: boolean;
    taskId?: string;
    operatorId?: string;
  };
}

export interface PathSegment {
  id: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  points: PathPoint[];
  distance: number; // total distance in meters
  duration: number; // duration in seconds
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  type: 'transport' | 'working' | 'idle' | 'unknown';
}

export interface PathQuery {
  vehicleIds: string[];
  startTime: Date;
  endTime: Date;
  resolution?: 'high' | 'medium' | 'low'; // affects point density
  includeStops?: boolean;
  minDistance?: number; // minimum distance between points in meters
  eventTypes?: string[];
}

export interface PathVisualizationOptions {
  colorBySpeed?: boolean;
  colorByStatus?: boolean;
  showDirection?: boolean;
  showStops?: boolean;
  smoothing?: boolean;
  clustering?: boolean;
  heatmap?: boolean;
}

export class PathTrackingService {
  /**
   * Retrieves path data for vehicles within specified time range
   */
  static async getVehiclePaths(query: PathQuery): Promise<PathSegment[]> {
    // This would typically query a time-series database
    const segments: PathSegment[] = [];
    
    for (const vehicleId of query.vehicleIds) {
      const points = await this.getPathPoints(vehicleId, query.startTime, query.endTime, query.resolution);
      const vehicleSegments = this.segmentPath(points);
      segments.push(...vehicleSegments);
    }
    
    return segments;
  }

  /**
   * Gets individual GPS points for a vehicle within time range
   */
  private static async getPathPoints(
    vehicleId: string, 
    startTime: Date, 
    endTime: Date, 
    resolution: string = 'medium'
  ): Promise<PathPoint[]> {
    // Resolution determines how many points to return
    const intervalSeconds = this.getIntervalByResolution(resolution);
    
    // In real implementation, this would query telemetry database
    // For now, return mock data structure
    return [];
  }

  /**
   * Segments continuous path into logical segments based on stops and activity
   */
  private static segmentPath(points: PathPoint[]): PathSegment[] {
    if (points.length === 0) return [];

    const segments: PathSegment[] = [];
    let currentSegmentStart = 0;
    let lastMovementTime = points[0].timestamp;

    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      
      // Check for segment break conditions
      const isLongStop = this.isLongStop(previous, current);
      const isActivityChange = this.isActivityChange(previous, current);
      
      if (isLongStop || isActivityChange || i === points.length - 1) {
        // Create segment from currentSegmentStart to i
        const segmentPoints = points.slice(currentSegmentStart, i + 1);
        if (segmentPoints.length > 1) {
          const segment = this.createSegment(segmentPoints);
          segments.push(segment);
        }
        currentSegmentStart = i;
      }
    }

    return segments;
  }

  /**
   * Creates a path segment from a series of points
   */
  private static createSegment(points: PathPoint[]): PathSegment {
    const distance = this.calculateTotalDistance(points);
    const duration = (points[points.length - 1].timestamp.getTime() - points[0].timestamp.getTime()) / 1000;
    const averageSpeed = duration > 0 ? (distance / 1000) / (duration / 3600) : 0;
    const maxSpeed = Math.max(...points.map(p => p.speed));
    
    return {
      id: `segment_${points[0].vehicleId}_${points[0].timestamp.getTime()}`,
      vehicleId: points[0].vehicleId,
      startTime: points[0].timestamp,
      endTime: points[points.length - 1].timestamp,
      points,
      distance,
      duration,
      averageSpeed,
      maxSpeed,
      type: this.determineSegmentType(points)
    };
  }

  /**
   * Determines if there's a long stop between two points
   */
  private static isLongStop(point1: PathPoint, point2: PathPoint): boolean {
    const timeDiff = (point2.timestamp.getTime() - point1.timestamp.getTime()) / 1000 / 60; // minutes
    const distance = this.calculateDistance(point1.location, point2.location);
    
    // Long stop: more than 15 minutes with less than 50 meters movement
    return timeDiff > 15 && distance < 50;
  }

  /**
   * Determines if activity changed between two points
   */
  private static isActivityChange(point1: PathPoint, point2: PathPoint): boolean {
    return point1.metadata?.isWorking !== point2.metadata?.isWorking ||
           point1.metadata?.taskId !== point2.metadata?.taskId;
  }

  /**
   * Determines the type of segment based on points
   */
  private static determineSegmentType(points: PathPoint[]): 'transport' | 'working' | 'idle' | 'unknown' {
    const workingPoints = points.filter(p => p.metadata?.isWorking).length;
    const movingPoints = points.filter(p => p.speed > 1).length;
    
    if (workingPoints / points.length > 0.8) return 'working';
    if (movingPoints / points.length > 0.8) return 'transport';
    if (movingPoints / points.length < 0.2) return 'idle';
    return 'unknown';
  }

  /**
   * Calculates total distance of a path
   */
  private static calculateTotalDistance(points: PathPoint[]): number {
    let totalDistance = 0;
    
    for (let i = 1; i < points.length; i++) {
      totalDistance += this.calculateDistance(points[i - 1].location, points[i].location);
    }
    
    return totalDistance;
  }

  /**
   * Calculates distance between two GPS points using Haversine formula
   */
  private static calculateDistance(point1: Location, point2: Location): number {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = point1.latitude * Math.PI / 180;
    const lat2Rad = point2.latitude * Math.PI / 180;
    const deltaLatRad = (point2.latitude - point1.latitude) * Math.PI / 180;
    const deltaLonRad = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Gets sampling interval based on resolution setting
   */
  private static getIntervalByResolution(resolution: string): number {
    switch (resolution) {
      case 'high': return 10; // every 10 seconds
      case 'medium': return 60; // every minute
      case 'low': return 300; // every 5 minutes
      default: return 60;
    }
  }

  /**
   * Optimizes path for display by reducing unnecessary points
   */
  static optimizePathForDisplay(points: PathPoint[], maxPoints: number = 1000): PathPoint[] {
    if (points.length <= maxPoints) return points;
    
    // Use Douglas-Peucker algorithm or simple decimation
    const step = Math.ceil(points.length / maxPoints);
    const optimized: PathPoint[] = [];
    
    for (let i = 0; i < points.length; i += step) {
      optimized.push(points[i]);
    }
    
    // Always include the last point
    if (optimized[optimized.length - 1] !== points[points.length - 1]) {
      optimized.push(points[points.length - 1]);
    }
    
    return optimized;
  }

  /**
   * Converts telemetry records to path points
   */
  static telemetryToPathPoints(records: TelemetryRecord[]): PathPoint[] {
    return records.map(record => ({
      id: `${record.vehicleId}_${record.timestamp.getTime()}`,
      vehicleId: record.vehicleId,
      timestamp: record.timestamp,
      location: {
        latitude: record.location.latitude,
        longitude: record.location.longitude,
        altitude: record.location.altitude,
        accuracy: record.location.accuracy
      },
      speed: record.location.speed,
      heading: record.location.heading,
      accuracy: record.location.accuracy || 0,
      metadata: {
        engineRunning: record.engine?.isRunning,
        isWorking: record.implement?.isActive,
        taskId: record.taskId,
        operatorId: record.operatorId
      }
    }));
  }
}

export interface TimeRangePreset {
  label: string;
  startTime: Date;
  endTime: Date;
  resolution: 'high' | 'medium' | 'low';
}

export class TimeRangePresets {
  static getPresets(): TimeRangePreset[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return [
      {
        label: 'Last Hour',
        startTime: new Date(now.getTime() - 60 * 60 * 1000),
        endTime: now,
        resolution: 'high'
      },
      {
        label: 'Today',
        startTime: today,
        endTime: now,
        resolution: 'medium'
      },
      {
        label: 'Yesterday',
        startTime: yesterday,
        endTime: today,
        resolution: 'medium'
      },
      {
        label: 'Last 7 Days',
        startTime: weekAgo,
        endTime: now,
        resolution: 'low'
      },
      {
        label: 'Last 30 Days',
        startTime: monthAgo,
        endTime: now,
        resolution: 'low'
      }
    ];
  }
}