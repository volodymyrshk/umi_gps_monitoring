/**
 * Mathematical calculations and analytics utilities
 */

import { Location } from '../entities/base';
import { PathPoint } from '../services/path-tracking';

export class CalculationUtils {
  /**
   * Calculate distance between two GPS points using Haversine formula
   */
  static calculateDistance(point1: Location, point2: Location): number {
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
   * Calculate total path distance from array of points
   */
  static calculatePathDistance(points: PathPoint[]): number {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistance += this.calculateDistance(points[i - 1].location, points[i].location);
    }
    return totalDistance;
  }

  /**
   * Calculate average speed from path points
   */
  static calculateAverageSpeed(points: PathPoint[]): number {
    if (points.length === 0) return 0;
    
    const totalSpeed = points.reduce((sum, point) => sum + point.speed, 0);
    return totalSpeed / points.length;
  }

  /**
   * Calculate fuel efficiency (liters per 100km)
   */
  static calculateFuelEfficiency(fuelConsumed: number, distanceKm: number): number {
    if (distanceKm === 0) return 0;
    return (fuelConsumed / distanceKm) * 100;
  }

  /**
   * Calculate work area covered from GPS path and implement width
   */
  static calculateAreaCovered(points: PathPoint[], implementWidth: number): number {
    if (points.length < 2) return 0;

    const workingPoints = points.filter(p => p.metadata?.isWorking);
    if (workingPoints.length < 2) return 0;

    const distance = this.calculatePathDistance(workingPoints);
    return (distance * implementWidth) / 10000; // Convert to hectares
  }

  /**
   * Calculate bearing between two GPS points
   */
  static calculateBearing(point1: Location, point2: Location): number {
    const lat1 = point1.latitude * Math.PI / 180;
    const lat2 = point2.latitude * Math.PI / 180;
    const deltaLon = (point2.longitude - point1.longitude) * Math.PI / 180;

    const x = Math.sin(deltaLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

    const bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360; // Normalize to 0-360
  }

  /**
   * Calculate center point of multiple GPS coordinates
   */
  static calculateCenter(points: Location[]): Location {
    if (points.length === 0) {
      throw new Error('Cannot calculate center of empty points array');
    }

    const sumLat = points.reduce((sum, point) => sum + point.latitude, 0);
    const sumLng = points.reduce((sum, point) => sum + point.longitude, 0);

    return {
      latitude: sumLat / points.length,
      longitude: sumLng / points.length
    };
  }

  /**
   * Calculate bounding box for an array of points
   */
  static calculateBounds(points: Location[]): {
    north: number;
    south: number;
    east: number;
    west: number;
  } {
    if (points.length === 0) {
      throw new Error('Cannot calculate bounds of empty points array');
    }

    return {
      north: Math.max(...points.map(p => p.latitude)),
      south: Math.min(...points.map(p => p.latitude)),
      east: Math.max(...points.map(p => p.longitude)),
      west: Math.min(...points.map(p => p.longitude))
    };
  }

  /**
   * Calculate utilization percentage
   */
  static calculateUtilization(workingHours: number, totalHours: number): number {
    if (totalHours === 0) return 0;
    return (workingHours / totalHours) * 100;
  }

  /**
   * Calculate efficiency score based on multiple factors
   */
  static calculateEfficiencyScore(
    fuelEfficiency: number, 
    timeEfficiency: number, 
    qualityScore: number
  ): number {
    // Weighted average: fuel 40%, time 40%, quality 20%
    return (fuelEfficiency * 0.4) + (timeEfficiency * 0.4) + (qualityScore * 0.2);
  }

  /**
   * Calculate moving average for smoothing data
   */
  static calculateMovingAverage(values: number[], windowSize: number): number[] {
    if (windowSize > values.length) return values;

    const result: number[] = [];
    for (let i = 0; i <= values.length - windowSize; i++) {
      const window = values.slice(i, i + windowSize);
      const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
      result.push(average);
    }
    return result;
  }

  /**
   * Calculate area of polygon from GPS coordinates
   */
  static calculatePolygonArea(coordinates: Location[]): number {
    if (coordinates.length < 3) return 0;

    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i].latitude * coordinates[j].longitude;
      area -= coordinates[j].latitude * coordinates[i].longitude;
    }

    area = Math.abs(area) / 2;
    
    // Convert to square meters (rough approximation)
    const earthRadius = 6371000; // Earth's radius in meters
    const areaInSquareMeters = area * Math.pow(earthRadius * Math.PI / 180, 2);
    
    return areaInSquareMeters / 10000; // Convert to hectares
  }

  /**
   * Check if a point is inside a polygon
   */
  static isPointInPolygon(point: Location, polygon: Location[]): boolean {
    const x = point.latitude;
    const y = point.longitude;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Calculate time difference in various units
   */
  static calculateTimeDifference(startTime: Date, endTime: Date): {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  } {
    const diff = endTime.getTime() - startTime.getTime();
    
    return {
      milliseconds: diff,
      seconds: diff / 1000,
      minutes: diff / (1000 * 60),
      hours: diff / (1000 * 60 * 60),
      days: diff / (1000 * 60 * 60 * 24)
    };
  }
}