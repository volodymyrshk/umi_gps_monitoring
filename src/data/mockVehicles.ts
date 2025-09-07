import { Vehicle } from '@/types/vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: '15321 ВМ JohnDeere 6150R B2E7',
    model: 'JohnDeere 6150R',
    operator: 'Олексій Петренко',
    location: {
      address: 'Київська область',
      lat: 50.4501,
      lng: 30.5234
    },
    battery: 85,
    status: 'online',
    lastUpdate: new Date(),
    speed: 12,
    fuel: 78,
    rpm: 1850,
    engineHours: 1247,
    temperature: 85,
    workingTime: 6.5,
    distance: 142,
    isWorking: true,
    rfidConnected: true,
    roadTime: 3.2
  },
  {
    id: '2',
    name: '65421 ВМ JohnDeere 6210 B1F3',
    model: 'JohnDeere 6210',
    operator: 'Нагорний Ігор Григорович',
    location: {
      address: 'Лесі Українки пров., 2, Переяслав, Київська область',
      lat: 50.4601,
      lng: 30.5334
    },
    battery: 82,
    status: 'online',
    lastUpdate: new Date(),
    speed: 8,
    fuel: 65,
    rpm: 1420,
    engineHours: 892,
    temperature: 78,
    workingTime: 4.2,
    distance: 88,
    isWorking: true,
    rfidConnected: true,
    roadTime: 2.8
  },
  {
    id: '3',
    name: '15-321 ВМ JohnDeere 6151R R7B2',
    model: 'JohnDeere 6151R',
    operator: 'Володимир Ковальчук',
    location: {
      address: 'Центр міста',
      lat: 50.4401,
      lng: 30.5134
    },
    battery: 12,
    status: 'warning',
    lastUpdate: new Date(),
    speed: 0,
    fuel: 23,
    rpm: 0,
    engineHours: 2156,
    temperature: 45,
    workingTime: 0,
    distance: 0,
    isWorking: false,
    rfidConnected: false,
    roadTime: 0
  }
];