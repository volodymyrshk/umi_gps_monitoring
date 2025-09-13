/**
 * Mock data generators for vehicles and related entities
 */

import { Vehicle, VehicleType, VehicleSpecs, FuelType, EngineType, VehicleSensor } from '../entities/vehicle';
import { Operator, LicenseType } from '../entities/operator';
import { Location, StatusInfo } from '../entities/base';
import { TelemetryRecord, RealtimeMetrics } from '../telemetry/types';

export class VehicleDataGenerator {
  // Store consistent fuel levels for each vehicle
  private static readonly vehicleFuelLevels: Map<string, number> = new Map();

  private static readonly UKRAINIAN_CITIES = [
    { name: 'Київ', lat: 50.4501, lng: 30.5234, region: 'Київська область' },
    { name: 'Львів', lat: 49.8437, lng: 24.0262, region: 'Львівська область' },
    { name: 'Одеса', lat: 46.4857, lng: 30.7358, region: 'Одеська область' },
    { name: 'Харків', lat: 49.9935, lng: 36.2304, region: 'Харківська область' },
    { name: 'Дніпро', lat: 48.4647, lng: 35.0462, region: 'Дніпропетровська область' },
    { name: 'Запоріжжя', lat: 47.8388, lng: 35.1396, region: 'Запорізька область' },
    { name: 'Полтава', lat: 49.5883, lng: 34.5514, region: 'Полтавська область' },
    { name: 'Черкаси', lat: 49.4285, lng: 32.0607, region: 'Черкаська область' }
  ];

  private static readonly VEHICLE_MAKES = [
    { make: 'John Deere', models: ['6150R', '6210R', '8345R', '8R 370', '9620R'] },
    { make: 'Case IH', models: ['Magnum 340', 'Optum 300', 'Steiger 620', 'Puma 240'] },
    { make: 'New Holland', models: ['T8.435', 'T6.180', 'CR10.90', 'FR780'] },
    { make: 'Fendt', models: ['936 Vario', '1050 Vario', '516 Vario', '722 Vario'] },
    { make: 'Claas', models: ['Axion 870', 'Xerion 5000', 'Lexion 8900', 'Arion 650'] },
    { make: 'Massey Ferguson', models: ['8S.265', '7S.165', '6S.140', '5S.125'] }
  ];

  private static readonly UKRAINIAN_OPERATORS = [
    'Олексій Петренко', 'Іван Мельник', 'Сергій Ткаченко', 'Андрій Шевченко',
    'Володимир Ковальчук', 'Микола Бондаренко', 'Василь Гриценко', 'Дмитро Литвиненко',
    'Роман Кравченко', 'Олег Савченко', 'Юрій Пономаренко', 'Тарас Мороз',
    'Віктор Коваль', 'Богdan Іваненко', 'Ярослав Федоренко', 'Максим Дубенко'
  ];

  static generateVehicles(count: number = 10): Vehicle[] {
    const vehicles: Vehicle[] = [];
    
    for (let i = 0; i < count; i++) {
      const vehicle = this.generateSingleVehicle(i + 1);
      vehicles.push(vehicle);
    }
    
    return vehicles;
  }

  private static generateSingleVehicle(index: number): Vehicle {
    const city = this.getRandomElement(this.UKRAINIAN_CITIES);
    const vehicleMake = this.getRandomElement(this.VEHICLE_MAKES);
    const model = this.getRandomElement(vehicleMake.models);
    const operator = this.getRandomElement(this.UKRAINIAN_OPERATORS);
    
    // Generate registration number in Ukrainian format
    const regNumber = this.generateUkrainianRegNumber();
    
    const specs: VehicleSpecs = {
      make: vehicleMake.make,
      model: model,
      year: this.getRandomBetween(2015, 2024),
      vin: this.generateVIN(),
      serialNumber: this.generateSerialNumber(vehicleMake.make),
      engineType: this.getRandomElement(['diesel', 'diesel', 'diesel', 'electric']) as EngineType,
      fuelType: this.getRandomElement(['diesel', 'diesel', 'diesel', 'electric']) as FuelType,
      fuelCapacity: this.getRandomBetween(200, 800),
      powerRating: this.getRandomBetween(150, 500),
      weight: this.getRandomBetween(8000, 15000)
    };

    const location: Location = {
      latitude: city.lat + (Math.random() - 0.5) * 0.1, // Small random offset
      longitude: city.lng + (Math.random() - 0.5) * 0.1,
      altitude: this.getRandomBetween(100, 300),
      accuracy: this.getRandomBetween(2, 8),
      address: this.generateAddress(city),
      city: city.name,
      region: city.region,
      country: 'Україна'
    };

    const status: StatusInfo = {
      status: this.getRandomElement(['online', 'online', 'online', 'warning', 'offline']),
      lastUpdate: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      message: this.generateStatusMessage()
    };

    const sensors: VehicleSensor[] = [
      { id: 'gps_1', type: 'gps', name: 'GPS Tracker', unit: 'coordinates', isActive: true },
      { id: 'fuel_1', type: 'fuel_level', name: 'Fuel Level Sensor', unit: 'liters', isActive: true },
      { id: 'rpm_1', type: 'engine_rpm', name: 'RPM Sensor', unit: 'rpm', isActive: true },
      { id: 'speed_1', type: 'speed', name: 'Speed Sensor', unit: 'km/h', isActive: true },
      { id: 'temp_1', type: 'temperature', name: 'Coolant Temp', unit: '°C', isActive: true },
      { id: 'battery_1', type: 'battery', name: 'Battery Monitor', unit: '%', isActive: true }
    ];

    return {
      id: `vehicle_${index.toString().padStart(3, '0')}`,
      name: `${regNumber} ${vehicleMake.make} ${model}`,
      displayName: `${vehicleMake.make} ${model}`,
      type: this.getVehicleType(model),
      specs,
      registrationNumber: regNumber,
      currentLocation: location,
      status,
      operatorId: `operator_${Math.ceil(Math.random() * 16).toString().padStart(3, '0')}`,
      assignedFieldIds: this.generateFieldIds(),
      sensors,
      maintenanceInfo: {
        lastServiceDate: new Date(Date.now() - Math.random() * 90 * 24 * 3600000),
        nextServiceDate: new Date(Date.now() + Math.random() * 60 * 24 * 3600000),
        serviceInterval: 250,
        totalEngineHours: this.getRandomBetween(500, 5000),
        serviceHistory: []
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600000),
      updatedAt: new Date(),
      isActive: true
    };
  }

  static generateOperators(count: number = 16): Operator[] {
    const operators: Operator[] = [];
    
    for (let i = 0; i < count; i++) {
      const operator = this.generateSingleOperator(i + 1);
      operators.push(operator);
    }
    
    return operators;
  }

  private static generateSingleOperator(index: number): Operator {
    const fullName = this.UKRAINIAN_OPERATORS[Math.min(index - 1, this.UKRAINIAN_OPERATORS.length - 1)];
    const [firstName, lastName] = fullName.split(' ');

    return {
      id: `operator_${index.toString().padStart(3, '0')}`,
      firstName,
      lastName,
      fullName,
      employeeId: `EMP${index.toString().padStart(4, '0')}`,
      contact: {
        phone: this.generateUkrainianPhone(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@umonitoring.ua`,
        address: this.generateAddress(this.getRandomElement(this.UKRAINIAN_CITIES))
      },
      licenses: this.generateLicenses(),
      employmentStatus: 'active',
      hireDate: new Date(Date.now() - Math.random() * 1000 * 24 * 3600000),
      assignedVehicleIds: [],
      performance: {
        totalWorkingHours: this.getRandomBetween(1000, 8000),
        fuelEfficiencyScore: this.getRandomBetween(70, 95),
        safetyScore: this.getRandomBetween(85, 100),
        punctualityScore: this.getRandomBetween(80, 100),
        completedTasks: this.getRandomBetween(50, 500),
        lastEvaluationDate: new Date(Date.now() - Math.random() * 90 * 24 * 3600000)
      },
      createdAt: new Date(Date.now() - Math.random() * 1000 * 24 * 3600000),
      updatedAt: new Date(),
      isActive: true
    };
  }

  static generateRealtimeMetrics(vehicleId: string): RealtimeMetrics {
    const isOnline = Math.random() > 0.2; // 80% online rate
    const isWorking = isOnline && Math.random() > 0.4; // 60% working when online
    
    // Get or generate consistent fuel level for this vehicle
    let fuelLevel = this.vehicleFuelLevels.get(vehicleId);
    if (fuelLevel === undefined) {
      fuelLevel = this.getRandomBetween(15, 95);
      this.vehicleFuelLevels.set(vehicleId, fuelLevel);
    }
    
    return {
      vehicleId,
      timestamp: new Date(),
      isOnline,
      currentSpeed: isOnline ? (isWorking ? this.getRandomBetween(8, 25) : this.getRandomBetween(0, 5)) : 0,
      currentLocation: this.generateRandomLocation(),
      fuelLevel,
      engineRpm: isOnline ? (isWorking ? this.getRandomBetween(1500, 2200) : this.getRandomBetween(0, 800)) : 0,
      batteryLevel: this.getRandomBetween(70, 100),
      activeAlerts: Math.random() > 0.8 ? this.getRandomBetween(1, 3) : 0,
      workingStatus: isWorking ? 'working' : (isOnline ? 'idle' : 'offline'),
      efficiency: {
        current: this.getRandomBetween(75, 95),
        trend: this.getRandomElement(['up', 'down', 'stable']),
        comparison: this.getRandomBetween(-10, 15)
      }
    };
  }

  // Get consistent fuel level for a vehicle
  static getVehicleFuelLevel(vehicleId: string): number {
    let fuelLevel = this.vehicleFuelLevels.get(vehicleId);
    if (fuelLevel === undefined) {
      fuelLevel = this.getRandomBetween(15, 95);
      this.vehicleFuelLevels.set(vehicleId, fuelLevel);
    }
    return fuelLevel;
  }

  // Helper methods
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static generateUkrainianRegNumber(): string {
    const letters = 'АВЕКМНОРСТУХ';
    const digits = Math.floor(Math.random() * 90000) + 10000;
    const regionCode = this.getRandomElement(['АА', 'ВВ', 'ВМ', 'КВ', 'АК', 'ВК']);
    
    return `${digits} ${regionCode}`;
  }

  private static generateVIN(): string {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let vin = '';
    for (let i = 0; i < 17; i++) {
      vin += chars[Math.floor(Math.random() * chars.length)];
    }
    return vin;
  }

  private static generateSerialNumber(make: string): string {
    const prefix = make.substring(0, 2).toUpperCase();
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${prefix}${number}`;
  }

  private static getVehicleType(model: string): VehicleType {
    if (model.includes('Combine') || model.includes('Lexion') || model.includes('CR')) return 'combine';
    if (model.includes('Sprayer') || model.includes('FR')) return 'sprayer';
    return 'tractor'; // Default to tractor
  }

  private static generateAddress(city: any): string {
    const streets = ['вул. Шевченка', 'проспект Перемоги', 'вул. Центральна', 'пров. Польовий', 'вул. Миру'];
    const street = this.getRandomElement(streets);
    const number = this.getRandomBetween(1, 150);
    return `${street}, ${number}, ${city.name}`;
  }

  private static generateStatusMessage(): string | undefined {
    if (Math.random() > 0.7) return undefined;
    
    const messages = [
      'Система працює нормально',
      'Завершено планове обслуговування',
      'Низький рівень палива',
      'Потрібна діагностика',
      'Робота в полі'
    ];
    return this.getRandomElement(messages);
  }

  private static generateFieldIds(): string[] {
    const count = this.getRandomBetween(1, 4);
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push(`field_${this.getRandomBetween(1, 50).toString().padStart(3, '0')}`);
    }
    return ids;
  }

  private static generateUkrainianPhone(): string {
    const operators = ['067', '068', '096', '097', '098', '063', '073', '093'];
    const operator = this.getRandomElement(operators);
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `+380${operator}${number}`;
  }

  private static generateLicenses() {
    return [
      {
        id: `license_${Date.now()}`,
        type: 'tractor' as LicenseType,
        licenseNumber: `TL${Math.floor(Math.random() * 900000) + 100000}`,
        issueDate: new Date(Date.now() - Math.random() * 2000 * 24 * 3600000),
        expiryDate: new Date(Date.now() + Math.random() * 1000 * 24 * 3600000),
        issuingAuthority: 'Міністерство аграрної політики України',
        isValid: true
      }
    ];
  }

  private static generateRandomLocation() {
    const city = this.getRandomElement(this.UKRAINIAN_CITIES);
    return {
      latitude: city.lat + (Math.random() - 0.5) * 0.1,
      longitude: city.lng + (Math.random() - 0.5) * 0.1
    };
  }
}