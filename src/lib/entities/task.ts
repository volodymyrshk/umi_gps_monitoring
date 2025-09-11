/**
 * Agricultural task and operation entity definitions
 */

import { BaseEntity, Location, MetricValue } from './base';

export type TaskType = 'plowing' | 'sowing' | 'harvesting' | 'spraying' | 'fertilizing' | 'cultivation' | 'transport';
export type TaskStatus = 'planned' | 'assigned' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Task extends BaseEntity {
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  fieldId: string;
  assignedVehicleIds: string[];
  assignedOperatorIds: string[];
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  estimatedDuration: number; // hours
  actualDuration?: number; // hours
  workArea?: WorkArea;
  requirements: TaskRequirements;
  progress?: TaskProgress;
  results?: TaskResults;
  parentTaskId?: string; // for sub-tasks
  dependencies: string[]; // task IDs that must complete first
}

export interface WorkArea {
  boundaries: Location[]; // polygon coordinates
  totalArea: number; // hectares
  completedArea?: number; // hectares
  remainingArea?: number; // hectares
}

export interface TaskRequirements {
  vehicleTypes: string[]; // required vehicle types
  operatorCount: number;
  estimatedFuelConsumption?: number; // liters
  requiredWeatherConditions?: WeatherRequirements;
  materials?: MaterialRequirement[];
  tools?: string[];
}

export interface WeatherRequirements {
  maxWindSpeed?: number; // km/h
  minTemperature?: number; // celsius
  maxTemperature?: number; // celsius
  maxHumidity?: number; // percentage
  precipitationAllowed: boolean;
}

export interface MaterialRequirement {
  type: 'seed' | 'fertilizer' | 'pesticide' | 'fuel';
  name: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
}

export interface TaskProgress {
  percentageComplete: number;
  lastUpdateDate: Date;
  currentPhase?: string;
  completedPhases: string[];
  metrics: TaskMetric[];
  issues: TaskIssue[];
}

export interface TaskMetric {
  name: string;
  value: MetricValue;
  target?: number;
  variance?: number; // percentage difference from target
}

export interface TaskIssue {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: Date;
  reportedBy: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: string;
  resolvedDate?: Date;
}

export interface TaskResults {
  actualAreaCovered: number; // hectares
  fuelConsumed: number; // liters
  materialsUsed: MaterialUsage[];
  qualityScore?: number; // 0-100
  efficiency: EfficiencyMetrics;
  costAnalysis?: CostAnalysis;
}

export interface MaterialUsage {
  materialId: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  variance: number; // percentage
}

export interface EfficiencyMetrics {
  areaPerHour: number; // hectares/hour
  fuelPerHectare: number; // liters/hectare
  timeEfficiency: number; // percentage of planned time
  qualityScore: number; // 0-100
}

export interface CostAnalysis {
  fuelCost: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  totalCost: number;
  costPerHectare: number;
  budgetVariance: number; // percentage
}

export interface TaskFilter {
  search?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  fieldId?: string;
  assignedVehicleId?: string;
  assignedOperatorId?: string;
  plannedStartAfter?: Date;
  plannedStartBefore?: Date;
  completedAfter?: Date;
  completedBefore?: Date;
  minProgress?: number;
  maxProgress?: number;
}