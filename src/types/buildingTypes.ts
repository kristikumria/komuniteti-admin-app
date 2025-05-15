export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  image?: string;
  units: number;
  floors: number;
  buildYear: number;
  totalArea: number;
  propertyManager?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for the UI
  residents?: number;
  issues?: number;
  occupancyRate?: number;
  maintenanceCost?: string;
  propertyType?: string;
  amenities?: string[];
  residentialUnits?: number;
  businessUnits?: number;
  status?: 'active' | 'maintenance' | 'development';
  adminAssigned?: boolean;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  floorArea?: number;
}

export interface BuildingFormData {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  image?: string;
  units: number;
  floors: number;
  buildYear: number;
  totalArea: number;
  propertyManager?: string;
  description?: string;
  residents?: number;
  occupancyRate?: number;
  maintenanceCost?: string;
  propertyType?: string;
  amenities?: string[];
  residentialUnits?: number;
  businessUnits?: number;
  status?: 'active' | 'maintenance' | 'development';
} 