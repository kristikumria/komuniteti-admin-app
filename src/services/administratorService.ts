import { Administrator } from '../types/administratorTypes';

// Mock data for administrators
const MOCK_ADMINISTRATORS: Administrator[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@komuniteti.com',
    phone: '+355 69 123 4567',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    assignedBuildings: ['1', '2'],
    assignedBuildingNames: ['Residence Plaza', 'Park Apartments'],
    role: 'administrator',
    status: 'active',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-05-20').toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@komuniteti.com',
    phone: '+355 69 987 6543',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    assignedBuildings: ['3'],
    assignedBuildingNames: ['City View Residences'],
    role: 'administrator',
    status: 'active',
    createdAt: new Date('2023-02-10').toISOString(),
    updatedAt: new Date('2023-06-15').toISOString(),
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex.johnson@komuniteti.com',
    phone: '+355 68 555 4433',
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    assignedBuildings: [],
    assignedBuildingNames: [],
    role: 'administrator',
    status: 'inactive',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-04-20').toISOString(),
  },
];

class AdministratorService {
  private administrators: Administrator[] = [...MOCK_ADMINISTRATORS];

  /**
   * Get all administrators
   */
  async getAdministrators(): Promise<Administrator[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.administrators]);
      }, 500);
    });
  }

  /**
   * Get an administrator by ID
   */
  async getAdministratorById(id: string): Promise<Administrator | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const administrator = this.administrators.find((a) => a.id === id);
        resolve(administrator);
      }, 300);
    });
  }

  /**
   * Get administrators by building ID
   */
  async getAdministratorsByBuilding(buildingId: string): Promise<Administrator[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.administrators.filter((a) => 
          a.assignedBuildings.includes(buildingId) && a.status === 'active'
        );
        resolve([...filtered]);
      }, 300);
    });
  }

  /**
   * Create a new administrator
   */
  async createAdministrator(administrator: Omit<Administrator, 'id' | 'role' | 'createdAt' | 'updatedAt'>): Promise<Administrator> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdministrator: Administrator = {
          id: (this.administrators.length + 1).toString(),
          ...administrator,
          role: 'administrator',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        this.administrators.push(newAdministrator);
        resolve(newAdministrator);
      }, 500);
    });
  }

  /**
   * Update an existing administrator
   */
  async updateAdministrator(id: string, updates: Partial<Omit<Administrator, 'id' | 'role' | 'createdAt'>>): Promise<Administrator | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.administrators.findIndex((a) => a.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedAdministrator: Administrator = {
          ...this.administrators[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        this.administrators[index] = updatedAdministrator;
        resolve(updatedAdministrator);
      }, 500);
    });
  }

  /**
   * Delete an administrator
   */
  async deleteAdministrator(id: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.administrators.length;
        this.administrators = this.administrators.filter((a) => a.id !== id);
        
        resolve(this.administrators.length < initialLength);
      }, 500);
    });
  }

  /**
   * Toggle administrator status (active/inactive)
   */
  async toggleAdministratorStatus(id: string): Promise<Administrator | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.administrators.findIndex((a) => a.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const status = this.administrators[index].status === 'active' ? 'inactive' : 'active';
        
        const updatedAdministrator: Administrator = {
          ...this.administrators[index],
          status,
          updatedAt: new Date().toISOString(),
        };
        
        this.administrators[index] = updatedAdministrator;
        resolve(updatedAdministrator);
      }, 300);
    });
  }

  /**
   * Assign/unassign a building to an administrator
   */
  async assignBuilding(administratorId: string, buildingId: string, buildingName: string, assign: boolean): Promise<Administrator | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.administrators.findIndex((a) => a.id === administratorId);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        let assignedBuildings = [...this.administrators[index].assignedBuildings];
        let assignedBuildingNames = [...(this.administrators[index].assignedBuildingNames || [])];
        
        if (assign) {
          // Assign building if not already assigned
          if (!assignedBuildings.includes(buildingId)) {
            assignedBuildings.push(buildingId);
            assignedBuildingNames.push(buildingName);
          }
        } else {
          // Unassign building
          const buildingIndex = assignedBuildings.indexOf(buildingId);
          if (buildingIndex !== -1) {
            assignedBuildings.splice(buildingIndex, 1);
            assignedBuildingNames.splice(buildingIndex, 1);
          }
        }
        
        const updatedAdministrator: Administrator = {
          ...this.administrators[index],
          assignedBuildings,
          assignedBuildingNames,
          updatedAt: new Date().toISOString(),
        };
        
        this.administrators[index] = updatedAdministrator;
        resolve(updatedAdministrator);
      }, 500);
    });
  }
}

export const administratorService = new AdministratorService(); 