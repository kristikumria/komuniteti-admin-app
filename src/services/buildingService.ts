import { Building } from '../types/buildingTypes';

// Mock data for buildings
const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Riviera Towers',
    address: '145 Rruga Ismail Qemali, Tirana',
    city: 'Tirana',
    zipCode: '1001',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 65,
    floors: 18,
    buildYear: 2018,
    totalArea: 12500,
    propertyManager: 'Komuniteti Management',
    description: 'Luxury residential and commercial complex in central Tirana',
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
    // Additional fields used by the UI
    residents: 220,
    issues: 2,
    occupancyRate: 92,
    maintenanceCost: '€1,500/month',
    propertyType: 'Residential',
    amenities: ['Gym', 'Pool', 'Parking', 'Security'],
    residentialUnits: 58,
    businessUnits: 7,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3275,
        longitude: 19.8187
      }
    },
    floorArea: 12500
  },
  {
    id: '2',
    name: 'Park View Residence',
    address: '78 Rruga Sami Frasheri, Tirana',
    city: 'Tirana',
    zipCode: '1004',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 42,
    floors: 12,
    buildYear: 2016,
    totalArea: 8750,
    propertyManager: 'Trend Property Management',
    description: 'Modern mixed-use building with premium apartments and office spaces',
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
    // Additional fields used by the UI
    residents: 150,
    issues: 1,
    occupancyRate: 85,
    maintenanceCost: '€1,200/month',
    propertyType: 'Mixed Use',
    amenities: ['Gym', 'Parking', 'Security'],
    residentialUnits: 32,
    businessUnits: 10,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3217,
        longitude: 19.8233
      }
    },
    floorArea: 8750
  },
  {
    id: '3',
    name: 'Central Plaza',
    address: '25 Bulevardi Dëshmorët e Kombit, Tirana',
    city: 'Tirana',
    zipCode: '1019',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    units: 30,
    floors: 10,
    buildYear: 2020,
    totalArea: 9000,
    propertyManager: 'Komuniteti Management',
    description: 'Premium commercial building in the heart of Tirana',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-07-10').toISOString(),
    // Additional fields used by the UI
    residents: 10,
    issues: 0,
    occupancyRate: 95,
    maintenanceCost: '€2,000/month',
    propertyType: 'Commercial',
    amenities: ['Parking', 'Security', 'Conference Room'],
    residentialUnits: 0,
    businessUnits: 30,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3275,
        longitude: 19.8187
      }
    },
    floorArea: 9000
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
    console.log('buildingService.getBuildingById called with ID:', id);
    console.log('Available building IDs:', this.buildings.map(b => b.id));
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ensure string comparison
        const building = this.buildings.find((b) => String(b.id) === String(id));
        console.log('Found building:', building?.name || 'Not found');
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