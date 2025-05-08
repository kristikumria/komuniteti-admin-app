import axios from 'axios';
import { Resident } from '../navigation/types';
import { API_URL } from '../utils/constants';

// This would be replaced with real API endpoints
const MOCK_RESIDENTS: Resident[] = [
  {
    id: '1',
    name: 'Endri Aliaj',
    email: 'endri.aliaj@example.com',
    phone: '+355 69 123 4567',
    unit: 'A203',
    building: 'Riviera Towers',
    status: 'owner',
    moveInDate: '2020-03-15',
    familyMembers: 3,
    pets: 'Cat (1)',
    paymentStatus: 'current',
    communicationPreference: 'Email',
    accountBalance: '€0.00',
    lastPaymentDate: '2023-05-01',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Elona Varfi',
    email: 'elona.varfi@example.com',
    phone: '+355 68 765 4321',
    unit: 'B112',
    building: 'Park View Residence',
    status: 'tenant',
    moveInDate: '2022-01-10',
    familyMembers: 2,
    pets: 'None',
    paymentStatus: 'overdue',
    communicationPreference: 'Phone',
    accountBalance: '€120.00',
    lastPaymentDate: '2023-04-15',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'Besnik Hoxha',
    email: 'besnik.hoxha@example.com',
    phone: '+355 69 876 5432',
    unit: 'C405',
    building: 'Central Plaza',
    status: 'owner',
    moveInDate: '2021-05-20',
    familyMembers: 4,
    pets: 'Dog (1)',
    paymentStatus: 'current',
    communicationPreference: 'App',
    accountBalance: '€50.00',
    lastPaymentDate: '2023-05-05',
    image: 'https://randomuser.me/api/portraits/men/55.jpg'
  }
];

export const residentService = {
  getResidents: async (): Promise<Resident[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/residents`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_RESIDENTS), 500);
      });
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw error;
    }
  },
  
  getResidentById: async (id: string): Promise<Resident> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/residents/${id}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const resident = MOCK_RESIDENTS.find(r => r.id === id);
          if (resident) {
            resolve(resident);
          } else {
            reject(new Error('Resident not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching resident ${id}:`, error);
      throw error;
    }
  },
  
  createResident: async (residentData: Omit<Resident, 'id'>): Promise<Resident> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/residents`, residentData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newResident: Resident = {
            ...residentData,
            id: Math.random().toString(36).substring(2, 9)
          };
          resolve(newResident);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating resident:', error);
      throw error;
    }
  },
  
  updateResident: async (id: string, residentData: Partial<Resident>): Promise<Resident> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.put(`${API_URL}/residents/${id}`, residentData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_RESIDENTS.findIndex(r => r.id === id);
          if (index >= 0) {
            const updatedResident = {
              ...MOCK_RESIDENTS[index],
              ...residentData
            };
            resolve(updatedResident);
          } else {
            reject(new Error('Resident not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error updating resident ${id}:`, error);
      throw error;
    }
  },
  
  deleteResident: async (id: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/residents/${id}`);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_RESIDENTS.findIndex(r => r.id === id);
          if (index >= 0) {
            resolve();
          } else {
            reject(new Error('Resident not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error deleting resident ${id}:`, error);
      throw error;
    }
  }
}; 