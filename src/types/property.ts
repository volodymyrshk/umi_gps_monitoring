export interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  rooms?: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  description?: string;
  features: string[];
  type: 'rent' | 'sale';
}

export interface PropertyFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
  type?: 'rent' | 'sale';
}