export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  price: number | string;
  priceUnit: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
  isActive: boolean;
} 