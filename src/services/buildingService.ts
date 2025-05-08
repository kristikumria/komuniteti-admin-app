import { Building } from '../types/buildingTypes';

// Mock data for buildings
const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Residence Plaza',
    address: 'Rruga Hoxha Tahsim 45',
    city: 'Tirana',
    zipCode: '1001',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 24,
    floors: 6,
    buildYear: 2015,
    totalArea: 2400,
    propertyManager: 'Alba Property',
    description: 'Modern residential building with 24 units in the center of Tirana.',
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
  },
  {
    id: '2',
    name: 'Park Apartments',
    address: 'Rruga Myslym Shyri 78',
    city: 'Tirana',
    zipCode: '1004',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 36,
    floors: 8,
    buildYear: 2018,
    totalArea: 3600,
    propertyManager: 'Trend Property Management',
    description: 'Luxury apartment complex near the central park with modern amenities.',
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
  },
  {
    id: '3',
    name: 'City View Residences',
    address: 'Bulevardi Bajram Curri 120',
    city: 'Tirana',
    zipCode: '1019',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 48,
    floors: 12,
    buildYear: 2020,
    totalArea: 5400,
    propertyManager: 'Komuniteti Management',
    description: 'High-rise residential building with panoramic views of the city.',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-07-10').toISOString(),
  },
];

class BuildingService {
  private buildings: Building[] = [...MOCK_BUILDINGS];

  /**
   * Get all buildings
   */
  async getBuildings(): Promise<Building[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.buildings]);
      }, 500);
    });
  }

  /**
   * Get a building by ID
   */
  async getBuildingById(id: string): Promise<Building | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const building = this.buildings.find((b) => b.id === id);
        resolve(building);
      }, 300);
    });
  }

  /**
   * Create a new building
   */
  async createBuilding(building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>): Promise<Building> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBuilding: Building = {
          id: (this.buildings.length + 1).toString(),
          ...building,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        this.buildings.push(newBuilding);
        resolve(newBuilding);
      }, 500);
    });
  }

  /**
   * Update an existing building
   */
  async updateBuilding(id: string, updates: Partial<Omit<Building, 'id' | 'createdAt'>>): Promise<Building | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.buildings.findIndex((b) => b.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedBuilding: Building = {
          ...this.buildings[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        this.buildings[index] = updatedBuilding;
        resolve(updatedBuilding);
      }, 500);
    });
  }

  /**
   * Delete a building
   */
  async deleteBuilding(id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.buildings.length;
        this.buildings = this.buildings.filter((b) => b.id !== id);
        
        resolve(this.buildings.length < initialLength);
      }, 500);
    });
  }
}

export const buildingService = new BuildingService(); 