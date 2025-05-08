import { InfoPoint, InfoPointCategory } from '../types/infoPointTypes';

// Mock data for InfoPoints
const MOCK_INFO_POINTS: InfoPoint[] = [
  {
    id: '1',
    title: 'Building Rules and Regulations',
    content: 'Please respect the following rules: No noise after 10 PM, keep common areas clean, and follow waste disposal guidelines. For any questions, contact the building administrator.',
    category: 'guidelines',
    buildingId: '1',
    buildingName: 'Residence Plaza',
    pinned: true,
    published: true,
    attachments: [],
    createdAt: new Date('2023-05-15').toISOString(),
    updatedAt: new Date('2023-07-10').toISOString(),
  },
  {
    id: '2',
    title: 'Maintenance Request Process',
    content: 'To request maintenance, use the app to submit a ticket. Our team will respond within 24 hours. Emergency requests are handled with priority.',
    category: 'maintenance',
    pinned: false,
    published: true,
    attachments: [],
    createdAt: new Date('2023-06-05').toISOString(),
    updatedAt: new Date('2023-06-05').toISOString(),
  },
  {
    id: '3',
    title: 'Emergency Contact Information',
    content: 'For emergencies, please contact: Building Manager: +355 69 123 4567, Emergency Services: 112, Plumbing Emergency: +355 68 765 4321',
    category: 'emergency',
    buildingId: '2',
    buildingName: 'Park Apartments',
    pinned: true,
    published: true,
    attachments: [],
    createdAt: new Date('2023-04-20').toISOString(),
    updatedAt: new Date('2023-08-15').toISOString(),
  },
  {
    id: '4',
    title: 'Community Events Calendar',
    content: 'Join us for our monthly community events! We have scheduled a BBQ party on June 15th, a movie night on June 22nd, and a flea market on June 29th. All events are held in the common area.',
    category: 'community',
    pinned: false,
    published: true,
    attachments: [],
    createdAt: new Date('2023-06-01').toISOString(),
    updatedAt: new Date('2023-06-10').toISOString(),
  },
  {
    id: '5',
    title: 'Frequently Asked Questions',
    content: 'Q: How do I pay my maintenance fee? A: Through the app or at the management office. Q: When is trash collection? A: Monday, Wednesday, and Friday. Q: Can I renovate my apartment? A: Yes, but approval is required.',
    category: 'faq',
    buildingId: '3',
    buildingName: 'City View Residences',
    pinned: false,
    published: true,
    attachments: [],
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-05-25').toISOString(),
  },
];

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
   * Get an info point by ID
   */
  async getInfoPointById(id: string): Promise<InfoPoint | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const infoPoint = this.infoPoints.find((ip) => ip.id === id);
        resolve(infoPoint);
      }, 300);
    });
  }

  /**
   * Create a new info point
   */
  async createInfoPoint(infoPoint: Omit<InfoPoint, 'id' | 'createdAt' | 'updatedAt'>): Promise<InfoPoint> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInfoPoint: InfoPoint = {
          id: (this.infoPoints.length + 1).toString(),
          ...infoPoint,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        this.infoPoints.push(newInfoPoint);
        resolve(newInfoPoint);
      }, 500);
    });
  }

  /**
   * Update an existing info point
   */
  async updateInfoPoint(id: string, updates: Partial<Omit<InfoPoint, 'id' | 'createdAt'>>): Promise<InfoPoint | undefined> {
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
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        this.infoPoints[index] = updatedInfoPoint;
        resolve(updatedInfoPoint);
      }, 500);
    });
  }

  /**
   * Delete an info point
   */
  async deleteInfoPoint(id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.infoPoints.length;
        this.infoPoints = this.infoPoints.filter((ip) => ip.id !== id);
        
        resolve(this.infoPoints.length < initialLength);
      }, 500);
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