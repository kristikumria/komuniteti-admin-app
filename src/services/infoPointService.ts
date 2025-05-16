import axios from 'axios';
import { InfoPoint, InfoPointCategory } from '../types/infoPointTypes';

// API config
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data for development
const MOCK_INFO_POINTS: InfoPoint[] = [
  {
    id: 'ip1',
    title: 'Building Maintenance Guidelines',
    description: 'Guidelines for maintaining common areas and reporting issues.',
    content: `# Building Maintenance Guidelines\n\n## Common Areas\n\n1. Keep all common areas clean and free of clutter.\n2. Report any damage or issues to the administrator.\n3. Respect quiet hours between 10 PM and 7 AM.\n\n## Reporting Maintenance Issues\n\n1. Use the app to report any maintenance issues.\n2. Provide clear details and photos if possible.\n3. For emergencies, contact the administrator directly.`,
    category: 'guidelines',
    visibility: 'all',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    createdBy: 'admin1',
  },
  {
    id: 'ip2',
    title: 'Building Security Measures',
    description: 'Information about the building security systems and procedures.',
    content: `# Building Security Measures\n\n## Access Control\n\n1. Do not allow unauthorized people into the building.\n2. Keep the main entrance door closed at all times.\n3. Report suspicious activity to the administrator or security personnel.\n\n## Security Cameras\n\nThe building is equipped with security cameras in all common areas. These cameras are monitored 24/7 by security personnel.`,
    category: 'building',
    visibility: 'all',
    createdAt: '2023-02-10T14:30:00Z',
    updatedAt: '2023-02-10T14:30:00Z',
    createdBy: 'admin1',
  },
  {
    id: 'ip3',
    title: 'FAQ: Payments and Fees',
    description: 'Frequently asked questions about building fees and payment methods.',
    content: `# Frequently Asked Questions: Payments and Fees\n\n## When are building fees due?\n\nBuilding fees are due on the 5th of each month. Late payments will incur a 5% late fee.\n\n## What payment methods are accepted?\n\nWe accept bank transfers, credit cards, and cash payments. You can also pay through the app using a credit card.\n\n## What happens if I can't pay on time?\n\nIf you are unable to pay on time, please contact the administrator to discuss payment options and avoid late fees.`,
    category: 'faq',
    visibility: 'all',
    createdAt: '2023-03-05T09:15:00Z',
    updatedAt: '2023-03-05T09:15:00Z',
    createdBy: 'admin1',
  },
  {
    id: 'ip4',
    title: 'Visitor Guidelines',
    description: 'Rules and procedures for visitors to the building.',
    content: `# Visitor Guidelines\n\n## Visitor Registration\n\n1. All visitors must be registered with the building administrator or security personnel.\n2. Residents are responsible for the behavior of their visitors.\n3. Visitors must follow all building rules and regulations.\n\n## Parking for Visitors\n\nVisitor parking is available in designated areas. Please inform your visitors to use only the designated visitor parking spots.`,
    category: 'guidelines',
    visibility: 'all',
    createdAt: '2023-04-20T16:45:00Z',
    updatedAt: '2023-04-20T16:45:00Z',
    createdBy: 'admin1',
  },
];

/**
 * Fetches all info points
 * @returns {Promise<InfoPoint[]>} List of info points
 */
export const getInfoPoints = async (): Promise<InfoPoint[]> => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return MOCK_INFO_POINTS;
    }
    
    // For production, make API call
    const response = await axios.get(`${API_URL}/info-points`);
    return response.data;
  } catch (error) {
    console.error('Error fetching info points:', error);
    // Return mock data as fallback in case of error
    return MOCK_INFO_POINTS;
  }
};

/**
 * Fetches a single info point by ID
 * @param {string} id - Info point ID
 * @returns {Promise<InfoPoint>} Info point details
 */
export const getInfoPointById = async (id: string): Promise<InfoPoint> => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const infoPoint = MOCK_INFO_POINTS.find(ip => ip.id === id);
      if (!infoPoint) {
        throw new Error(`Info point with ID ${id} not found`);
      }
      return infoPoint;
    }
    
    // For production, make API call
    const response = await axios.get(`${API_URL}/info-points/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching info point ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new info point
 * @param {Partial<InfoPoint>} infoPoint - Info point data
 * @returns {Promise<InfoPoint>} Created info point
 */
export const createInfoPoint = async (infoPoint: Partial<InfoPoint>): Promise<InfoPoint> => {
  try {
    // For production, make API call
    if (process.env.NODE_ENV !== 'development') {
      const response = await axios.post(`${API_URL}/info-points`, infoPoint);
      return response.data;
    }
    
    // For development, simulate creation
    const newInfoPoint: InfoPoint = {
      id: `ip${Date.now()}`,
      title: infoPoint.title || 'New Info Point',
      description: infoPoint.description || '',
      content: infoPoint.content || '',
      category: infoPoint.category || 'guidelines',
      visibility: infoPoint.visibility || 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin1', // Assume current user
      ...infoPoint,
    };
    
    return newInfoPoint;
  } catch (error) {
    console.error('Error creating info point:', error);
    throw error;
  }
};

/**
 * Updates an existing info point
 * @param {string} id - Info point ID
 * @param {Partial<InfoPoint>} infoPoint - Updated info point data
 * @returns {Promise<InfoPoint>} Updated info point
 */
export const updateInfoPoint = async (id: string, infoPoint: Partial<InfoPoint>): Promise<InfoPoint> => {
  try {
    // For production, make API call
    if (process.env.NODE_ENV !== 'development') {
      const response = await axios.put(`${API_URL}/info-points/${id}`, infoPoint);
      return response.data;
    }
    
    // For development, simulate update
    const existingInfoPoint = MOCK_INFO_POINTS.find(ip => ip.id === id);
    if (!existingInfoPoint) {
      throw new Error(`Info point with ID ${id} not found`);
    }
    
    const updatedInfoPoint: InfoPoint = {
      ...existingInfoPoint,
      ...infoPoint,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedInfoPoint;
  } catch (error) {
    console.error(`Error updating info point ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes an info point
 * @param {string} id - Info point ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteInfoPoint = async (id: string): Promise<boolean> => {
  try {
    // For production, make API call
    if (process.env.NODE_ENV !== 'development') {
      await axios.delete(`${API_URL}/info-points/${id}`);
      return true;
    }
    
    // For development, simulate deletion
    const infoPoint = MOCK_INFO_POINTS.find(ip => ip.id === id);
    if (!infoPoint) {
      throw new Error(`Info point with ID ${id} not found`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting info point ${id}:`, error);
    throw error;
  }
};

class InfoPointService {
  private infoPoints: InfoPoint[] = [...MOCK_INFO_POINTS];

  /**
   * Get all info points
   */
  async getInfoPoints(): Promise<InfoPoint[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.infoPoints]);
      }, 500);
    });
  }

  /**
   * Get info points by building
   */
  async getInfoPointsByBuilding(buildingId: string): Promise<InfoPoint[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.infoPoints.filter((ip) => ip.buildingId === buildingId);
        resolve(filtered);
      }, 300);
    });
  }

  /**
   * Get info points by category
   */
  async getInfoPointsByCategory(category: InfoPointCategory): Promise<InfoPoint[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.infoPoints.filter((ip) => ip.category === category);
        resolve(filtered);
      }, 300);
    });
  }

  /**
   * Toggle pin status
   */
  async togglePinStatus(id: string): Promise<InfoPoint | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.infoPoints.findIndex((ip) => ip.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedInfoPoint: InfoPoint = {
          ...this.infoPoints[index],
          pinned: !this.infoPoints[index].pinned,
          updatedAt: new Date().toISOString(),
        };
        
        this.infoPoints[index] = updatedInfoPoint;
        resolve(updatedInfoPoint);
      }, 300);
    });
  }

  /**
   * Toggle publish status
   */
  async togglePublishStatus(id: string): Promise<InfoPoint | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.infoPoints.findIndex((ip) => ip.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedInfoPoint: InfoPoint = {
          ...this.infoPoints[index],
          published: !this.infoPoints[index].published,
          updatedAt: new Date().toISOString(),
        };
        
        this.infoPoints[index] = updatedInfoPoint;
        resolve(updatedInfoPoint);
      }, 300);
    });
  }
}

export const infoPointService = new InfoPointService(); 