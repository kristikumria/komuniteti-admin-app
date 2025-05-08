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
} 