/**
 * Mock path data generator for testing path tracking functionality
 */

import { PathSegment, PathPoint } from '../services/path-tracking';
import { Location } from '../entities/base';

export class PathDataGenerator {
  /**
   * Generate mock path segments for a vehicle
   */
  static generateMockPaths(vehicleId: string, startTime: Date, endTime: Date): PathSegment[] {
    const segments: PathSegment[] = [];
    const duration = endTime.getTime() - startTime.getTime();
    const segmentCount = Math.min(Math.floor(duration / (60 * 60 * 1000)), 8); // Max 8 hours of segments
    
    // Starting location (Kyiv area)
    let currentLat = 50.4501 + (Math.random() - 0.5) * 0.05;
    let currentLng = 30.5234 + (Math.random() - 0.5) * 0.05;
    
    let currentTime = startTime.getTime();
    const segmentDuration = duration / segmentCount;
    
    for (let i = 0; i < segmentCount; i++) {
      const segmentStartTime = new Date(currentTime);
      const segmentEndTime = new Date(currentTime + segmentDuration);
      
      const segmentType = this.getRandomSegmentType();
      const points = this.generateSegmentPoints(
        vehicleId,
        segmentStartTime,
        segmentEndTime,
        currentLat,
        currentLng,
        segmentType
      );
      
      if (points.length > 0) {
        // Update current position for next segment
        const lastPoint = points[points.length - 1];
        currentLat = lastPoint.location.latitude;
        currentLng = lastPoint.location.longitude;
        
        const distance = this.calculateSegmentDistance(points);
        const actualDuration = (segmentEndTime.getTime() - segmentStartTime.getTime()) / 1000;
        const averageSpeed = actualDuration > 0 ? (distance / 1000) / (actualDuration / 3600) : 0;
        const maxSpeed = Math.max(...points.map(p => p.speed));
        
        segments.push({
          id: `${vehicleId}_segment_${i}`,
          vehicleId,
          startTime: segmentStartTime,
          endTime: segmentEndTime,
          points,
          distance,
          duration: actualDuration,
          averageSpeed,
          maxSpeed,
          type: segmentType
        });
      }
      
      currentTime += segmentDuration;
    }
    
    return segments;
  }
  
  /**
   * Generate points for a single segment
   */
  private static generateSegmentPoints(
    vehicleId: string,
    startTime: Date,
    endTime: Date,
    startLat: number,
    startLng: number,
    segmentType: 'working' | 'transport' | 'idle'
  ): PathPoint[] {
    const points: PathPoint[] = [];
    const duration = endTime.getTime() - startTime.getTime();
    const pointCount = Math.max(3, Math.floor(duration / (5 * 60 * 1000))); // Point every 5 minutes minimum
    
    let currentLat = startLat;
    let currentLng = startLng;
    
    // Movement parameters based on segment type
    const movementParams = this.getMovementParams(segmentType);
    
    for (let i = 0; i < pointCount; i++) {
      const pointTime = new Date(startTime.getTime() + (duration * i / (pointCount - 1)));
      
      // Add some random movement
      if (i > 0) {
        currentLat += (Math.random() - 0.5) * movementParams.movementRange;
        currentLng += (Math.random() - 0.5) * movementParams.movementRange;
      }
      
      const point: PathPoint = {
        id: `${vehicleId}_${pointTime.getTime()}`,
        vehicleId,
        timestamp: pointTime,
        location: {
          latitude: currentLat,
          longitude: currentLng,
          accuracy: Math.random() * 10 + 2
        },
        speed: this.getRandomSpeed(segmentType),
        heading: Math.random() * 360,
        accuracy: Math.random() * 10 + 2,
        metadata: {
          engineRunning: segmentType !== 'idle',
          isWorking: segmentType === 'working',
          taskId: segmentType === 'working' ? `task_${Math.floor(Math.random() * 100)}` : undefined
        }
      };
      
      points.push(point);
    }
    
    return points;
  }
  
  /**
   * Get movement parameters based on segment type
   */
  private static getMovementParams(segmentType: string) {
    switch (segmentType) {
      case 'working':
        return {
          movementRange: 0.002, // Small field movements
          speedRange: [5, 15]
        };
      case 'transport':
        return {
          movementRange: 0.01, // Larger road movements
          speedRange: [20, 60]
        };
      case 'idle':
        return {
          movementRange: 0.0001, // Very small stationary drift
          speedRange: [0, 2]
        };
      default:
        return {
          movementRange: 0.005,
          speedRange: [0, 30]
        };
    }
  }
  
  /**
   * Get random speed based on segment type
   */
  private static getRandomSpeed(segmentType: string): number {
    const params = this.getMovementParams(segmentType);
    const [min, max] = params.speedRange;
    return Math.random() * (max - min) + min;
  }
  
  /**
   * Get random segment type with realistic distribution
   */
  private static getRandomSegmentType(): 'working' | 'transport' | 'idle' {
    const rand = Math.random();
    if (rand < 0.5) return 'working';   // 50% working
    if (rand < 0.8) return 'transport'; // 30% transport  
    return 'idle';                      // 20% idle
  }
  
  /**
   * Calculate total distance of segment points
   */
  private static calculateSegmentDistance(points: PathPoint[]): number {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistance += this.calculateDistance(
        points[i - 1].location,
        points[i].location
      );
    }
    
    return totalDistance;
  }
  
  /**
   * Calculate distance between two points using Haversine formula
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
   * Generate paths for multiple vehicles
   */
  static generateMultiVehiclePaths(vehicleIds: string[], startTime: Date, endTime: Date): PathSegment[] {
    const allSegments: PathSegment[] = [];
    
    for (const vehicleId of vehicleIds) {
      const vehicleSegments = this.generateMockPaths(vehicleId, startTime, endTime);
      allSegments.push(...vehicleSegments);
    }
    
    return allSegments;
  }
}