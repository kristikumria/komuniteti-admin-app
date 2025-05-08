import axios from 'axios';
import { Payment } from '../navigation/types';

// API config (to be replaced with actual API endpoint)
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data for development until API is ready
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    residentId: '101',
    residentName: 'Alex Johnson',
    buildingId: '201',
    buildingName: 'Riviera Towers',
    amount: 750,
    type: 'rent',
    status: 'completed',
    dueDate: '2023-09-01',
    paymentDate: '2023-08-28',
    paymentMethod: 'bankTransfer',
    description: 'September rent payment',
    invoiceNumber: 'INV-2023-09-101',
    createdAt: '2023-08-15T10:00:00Z',
    updatedAt: '2023-08-28T14:30:00Z'
  },
  {
    id: '2',
    residentId: '102',
    residentName: 'Maria Garcia',
    buildingId: '201',
    buildingName: 'Riviera Towers',
    amount: 100,
    type: 'maintenance',
    status: 'completed',
    dueDate: '2023-09-05',
    paymentDate: '2023-09-02',
    paymentMethod: 'creditCard',
    description: 'Plumbing repairs',
    invoiceNumber: 'INV-2023-09-102M',
    createdAt: '2023-08-25T09:15:00Z',
    updatedAt: '2023-09-02T11:20:00Z'
  },
  {
    id: '3',
    residentId: '103',
    residentName: 'John Smith',
    buildingId: '202',
    buildingName: 'Park View Residence',
    amount: 950,
    type: 'rent',
    status: 'overdue',
    dueDate: '2023-09-01',
    description: 'September rent payment',
    invoiceNumber: 'INV-2023-09-103',
    createdAt: '2023-08-15T14:20:00Z',
    updatedAt: '2023-09-02T16:45:00Z'
  },
  {
    id: '4',
    residentId: '104',
    residentName: 'Emily Wilson',
    buildingId: '202',
    buildingName: 'Park View Residence',
    amount: 250,
    type: 'utilities',
    status: 'pending',
    dueDate: '2023-09-15',
    description: 'Electricity and water bill',
    invoiceNumber: 'INV-2023-09-104U',
    createdAt: '2023-09-01T08:30:00Z',
    updatedAt: '2023-09-01T08:30:00Z'
  },
  {
    id: '5',
    residentId: '105',
    residentName: 'David Chen',
    buildingId: '203',
    buildingName: 'Central Plaza',
    amount: 850,
    type: 'rent',
    status: 'completed',
    dueDate: '2023-09-01',
    paymentDate: '2023-08-30',
    paymentMethod: 'creditCard',
    description: 'September rent payment',
    invoiceNumber: 'INV-2023-09-105',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2023-08-30T10:15:00Z'
  },
  {
    id: '6',
    residentId: '106',
    residentName: 'Sophia Rodriguez',
    buildingId: '203',
    buildingName: 'Central Plaza',
    amount: 180,
    type: 'utilities',
    status: 'pending',
    dueDate: '2023-09-15',
    description: 'Gas and electricity bill',
    invoiceNumber: 'INV-2023-09-106U',
    createdAt: '2023-09-01T11:45:00Z',
    updatedAt: '2023-09-01T11:45:00Z'
  },
];

export const paymentService = {
  // Get all payments
  getPayments: async (): Promise<Payment[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/payments`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_PAYMENTS);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
  
  // Get payments for a specific resident
  getResidentPayments: async (residentId: string): Promise<Payment[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/residents/${residentId}/payments`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredPayments = MOCK_PAYMENTS.filter(
            payment => payment.residentId === residentId
          );
          resolve(filteredPayments);
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching payments for resident ${residentId}:`, error);
      throw error;
    }
  },
  
  // Get payments for a specific building
  getBuildingPayments: async (buildingId: string): Promise<Payment[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/buildings/${buildingId}/payments`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredPayments = MOCK_PAYMENTS.filter(
            payment => payment.buildingId === buildingId
          );
          resolve(filteredPayments);
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching payments for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  // Get a specific payment by ID
  getPaymentById: async (paymentId: string): Promise<Payment> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/payments/${paymentId}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const payment = MOCK_PAYMENTS.find(p => p.id === paymentId);
          if (payment) {
            resolve(payment);
          } else {
            reject(new Error(`Payment with ID ${paymentId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      throw error;
    }
  },
  
  // Create a new payment
  createPayment: async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/payments`, paymentData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPayment: Payment = {
            ...paymentData,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // In a real implementation, we would add the payment to the database
          // but for mock purposes, we just return the new payment
          resolve(newPayment);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
  
  // Update an existing payment
  updatePayment: async (paymentId: string, paymentData: Partial<Payment>): Promise<Payment> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.put(`${API_URL}/payments/${paymentId}`, paymentData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const paymentIndex = MOCK_PAYMENTS.findIndex(p => p.id === paymentId);
          
          if (paymentIndex !== -1) {
            const updatedPayment: Payment = {
              ...MOCK_PAYMENTS[paymentIndex],
              ...paymentData,
              updatedAt: new Date().toISOString()
            };
            
            // In a real implementation, we would update the payment in the database
            // but for mock purposes, we just return the updated payment
            resolve(updatedPayment);
          } else {
            reject(new Error(`Payment with ID ${paymentId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error updating payment ${paymentId}:`, error);
      throw error;
    }
  },
  
  // Process a payment
  processPayment: async (
    paymentId: string,
    paymentDetails: {
      paymentMethod: 'creditCard' | 'bankTransfer' | 'cash' | 'other';
      paymentDate: string;
    }
  ): Promise<Payment> => {
    try {
      // In a real implementation, this would include payment gateway integration
      // but for mock purposes, we just update the payment status
      
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/payments/${paymentId}/process`, paymentDetails);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const paymentIndex = MOCK_PAYMENTS.findIndex(p => p.id === paymentId);
          
          if (paymentIndex !== -1) {
            const processedPayment: Payment = {
              ...MOCK_PAYMENTS[paymentIndex],
              status: 'completed',
              paymentDate: paymentDetails.paymentDate,
              paymentMethod: paymentDetails.paymentMethod,
              updatedAt: new Date().toISOString()
            };
            
            // In a real implementation, we would update the payment in the database
            // but for mock purposes, we just return the processed payment
            resolve(processedPayment);
          } else {
            reject(new Error(`Payment with ID ${paymentId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error processing payment ${paymentId}:`, error);
      throw error;
    }
  },
  
  // Delete a payment
  deletePayment: async (paymentId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/payments/${paymentId}`);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const paymentIndex = MOCK_PAYMENTS.findIndex(p => p.id === paymentId);
          
          if (paymentIndex !== -1) {
            // In a real implementation, we would delete the payment from the database
            // but for mock purposes, we just resolve the promise
            resolve();
          } else {
            reject(new Error(`Payment with ID ${paymentId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  }
}; 