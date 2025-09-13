import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: '2к кв Шулявська 65100 8567',
    price: 65100,
    area: 55,
    rooms: 2,
    location: {
      address: 'вул. Шулявська',
      lat: 50.4501,
      lng: 30.5234
    },
    images: ['/api/placeholder/300/200'],
    features: ['Ліфт', 'Балкон', 'Ремонт'],
    type: 'rent'
  },
  {
    id: '2',
    title: '1к кв Лобановка 63120 8567',
    price: 63120,
    area: 42,
    rooms: 1,
    location: {
      address: 'вул. Лобановська',
      lat: 50.4601,
      lng: 30.5334
    },
    images: ['/api/placeholder/300/200'],
    features: ['Новобудова', 'Паркінг'],
    type: 'rent'
  },
  {
    id: '3',
    title: '3к кв центр 125638 км',
    price: 125638,
    area: 85,
    rooms: 3,
    location: {
      address: 'Центр міста',
      lat: 50.4401,
      lng: 30.5134
    },
    images: ['/api/placeholder/300/200'],
    features: ['Центр', 'Метро поруч', 'Євроремонт'],
    type: 'sale'
  }
];