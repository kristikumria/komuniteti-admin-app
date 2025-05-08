import { Service } from '../types/serviceTypes';

// Mock data for services
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Maintenance',
    description: 'Regular maintenance of building facilities, including electrical, plumbing, and general repairs.',
    category: 'Technical',
    price: 150,
    priceUnit: 'monthly',
    isActive: true,
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
  },
  {
    id: '2',
    name: 'Cleaning',
    description: 'Regular cleaning of common areas, including halls, staircases, and outdoor spaces.',
    category: 'Maintenance',
    price: 100,
    priceUnit: 'monthly',
    isActive: true,
    createdAt: new Date('2023-02-10').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
  },
  {
    id: '3',
    name: 'Security',
    description: '24/7 security service including monitoring, patrol, and access control.',
    category: 'Security',
    price: 200,
    priceUnit: 'monthly',
    isActive: true,
    createdAt: new Date('2023-01-05').toISOString(),
    updatedAt: new Date('2023-04-20').toISOString(),
  },
  {
    id: '4',
    name: 'Gardening',
    description: 'Maintenance of gardens, lawns, and outdoor plants in the common areas.',
    category: 'Landscaping',
    price: 80,
    priceUnit: 'monthly',
    isActive: false,
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-07-15').toISOString(),
  },
  {
    id: '5',
    name: 'Waste Management',
    description: 'Regular collection and disposal of waste and recycling materials.',
    category: 'Maintenance',
    price: 60,
    priceUnit: 'monthly',
    isActive: true,
    createdAt: new Date('2023-01-25').toISOString(),
    updatedAt: new Date('2023-06-05').toISOString(),
  },
];

class ServiceService {
  private services: Service[] = [...MOCK_SERVICES];

  /**
   * Get all services
   */
  async getServices(): Promise<Service[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.services]);
      }, 500);
    });
  }

  /**
   * Get a service by ID
   */
  async getServiceById(id: string): Promise<Service | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = this.services.find((s) => s.id === id);
        resolve(service);
      }, 300);
    });
  }

  /**
   * Create a new service
   */
  async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newService: Service = {
          id: (this.services.length + 1).toString(),
          ...service,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        this.services.push(newService);
        resolve(newService);
      }, 500);
    });
  }

  /**
   * Update an existing service
   */
  async updateService(id: string, updates: Partial<Omit<Service, 'id' | 'createdAt'>>): Promise<Service | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.services.findIndex((s) => s.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedService: Service = {
          ...this.services[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        this.services[index] = updatedService;
        resolve(updatedService);
      }, 500);
    });
  }

  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.services.length;
        this.services = this.services.filter((s) => s.id !== id);
        
        resolve(this.services.length < initialLength);
      }, 500);
    });
  }

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(id: string): Promise<Service | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.services.findIndex((s) => s.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedService: Service = {
          ...this.services[index],
          isActive: !this.services[index].isActive,
          updatedAt: new Date().toISOString(),
        };
        
        this.services[index] = updatedService;
        resolve(updatedService);
      }, 300);
    });
  }
}

export const serviceService = new ServiceService(); 