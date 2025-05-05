import axios from 'axios';
import { Building } from '../navigation/types';
import { API_URL } from '../utils/constants';

// This would be replaced with real API endpoints
const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Riviera Towers',
    address: '123 Coastal Blvd, Tirana',
    units: 48,
    residents: 112,
    issues: 4,
    occupancyRate: 92,
    maintenanceCost: '€4,800',
    yearBuilt: 2018,
    propertyType: 'Apartment Complex',
    amenities: ['Pool', 'Gym', 'Parking', 'Security'],
    image: 'https://images.unsplash.com/photo-1665686310429-ee4d8b4c7cbc?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Park View Residence',
    address: '45 Green Park St, Tirana',
    units: 32,
    residents: 75,
    issues: 2,
    occupancyRate: 88,
    maintenanceCost: '€3,200',
    yearBuilt: 2020,
    propertyType: 'Residential Complex',
    amenities: ['Garden', 'Parking', 'Playground'],
    image: 'https://images.unsplash.com/photo-1669071192880-0a94316e6e09?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Central Plaza',
    address: '78 Main Square, Tirana',
    units: 64,
    residents: 145,
    issues: 7,
    occupancyRate: 95,
    maintenanceCost: '€5,600',
    yearBuilt: 2016,
    propertyType: 'Mixed-Use Building',
    amenities: ['Roof Terrace', 'Gym', 'Commercial Area', 'Security'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
];

export const buildingService = {
  getBuildings: async (): Promise<Building[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/buildings`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_BUILDINGS), 500);
      });
    } catch (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }
  },
  
  getBuildingById: async (id: string): Promise<Building> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/buildings/${id}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const building = MOCK_BUILDINGS.find(b => b.id === id);
          if (building) {
            resolve(building);
          } else {
            reject(new Error('Building not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching building ${id}:`, error);
      throw error;
    }
  },
  
  createBuilding: async (buildingData: Omit<Building, 'id'>): Promise<Building> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/buildings`, buildingData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBuilding: Building = {
            ...buildingData,
            id: Math.random().toString(36).substring(2, 9)
          };
          resolve(newBuilding);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  },
  
  updateBuilding: async (id: string, buildingData: Partial<Building>): Promise<Building> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.put(`${API_URL}/buildings/${id}`, buildingData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_BUILDINGS.findIndex(b => b.id === id);
          if (index >= 0) {
            const updatedBuilding = {
              ...MOCK_BUILDINGS[index],
              ...buildingData
            };
            resolve(updatedBuilding);
          } else {
            reject(new Error('Building not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error updating building ${id}:`, error);
      throw error;
    }
  },
  
  deleteBuilding: async (id: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/buildings/${id}`);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_BUILDINGS.findIndex(b => b.id === id);
          if (index >= 0) {
            resolve();
          } else {
            reject(new Error('Building not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error deleting building ${id}:`, error);
      throw error;
    }
  }
}; 