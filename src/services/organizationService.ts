import { User } from '../navigation/types';

// Define organization node type
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  image?: string;
  children?: OrgNode[];
}

// Define organization service
export const organizationService = {
  /**
   * Get organization chart data for the current business
   */
  async getOrganizationChart(userId: string, viewMode: 'hierarchy' | 'buildings' = 'hierarchy'): Promise<OrgNode> {
    // In a real implementation, this would fetch data from the API
    // For now, return mock data
    return this.getMockOrganizationData(userId, viewMode);
  },

  /**
   * Generate mock organization data
   */
  async getMockOrganizationData(userId: string, viewMode: 'hierarchy' | 'buildings'): Promise<OrgNode> {
    // Mock data
    const mockAdministrators = [
      {
        id: 'admin1',
        name: 'John Smith',
        role: 'Administrator',
        image: 'https://randomuser.me/api/portraits/men/41.jpg',
        assignedBuildings: ['building1', 'building2']
      },
      {
        id: 'admin2',
        name: 'Sarah Johnson',
        role: 'Administrator',
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        assignedBuildings: ['building3']
      },
      {
        id: 'admin3',
        name: 'Robert Lee',
        role: 'Administrator',
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
        assignedBuildings: ['building4', 'building5']
      }
    ];

    const mockBuildings = [
      {
        id: 'building1',
        name: 'Sunset Apartments',
        type: 'Residential',
        image: 'https://images.unsplash.com/photo-1554469384-e58fac937c33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        administratorId: 'admin1',
        units: 24,
        residents: 38
      },
      {
        id: 'building2',
        name: 'Harbor View Residences',
        type: 'Residential',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        administratorId: 'admin1',
        units: 42,
        residents: 67
      },
      {
        id: 'building3',
        name: 'Downtown Business Plaza',
        type: 'Commercial',
        image: 'https://images.unsplash.com/photo-1554435493-93422e8d1c46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        administratorId: 'admin2',
        units: 18,
        residents: 12
      },
      {
        id: 'building4',
        name: 'Skyline Towers',
        type: 'Residential',
        image: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        administratorId: 'admin3',
        units: 50,
        residents: 82
      },
      {
        id: 'building5',
        name: 'Riverside Mall',
        type: 'Commercial',
        image: 'https://images.unsplash.com/photo-1533012339124-8a3f8927143c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        administratorId: 'admin3',
        units: 30,
        residents: 24
      }
    ];

    // Create the root node (business manager)
    const rootNode: OrgNode = {
      id: userId || 'bm1',
      name: 'Business Manager',
      role: 'Business Manager',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      children: []
    };

    if (viewMode === 'hierarchy') {
      // Hierarchical view: Business Manager -> Administrators -> Buildings
      mockAdministrators.forEach(admin => {
        const adminNode: OrgNode = {
          id: admin.id,
          name: admin.name,
          role: 'Administrator',
          image: admin.image,
          children: []
        };
        
        // Add buildings for each administrator
        const adminBuildings = mockBuildings.filter(b => b.administratorId === admin.id);
        
        adminBuildings.forEach(building => {
          adminNode.children?.push({
            id: building.id,
            name: building.name,
            role: building.type,
            image: building.image,
            children: [
              {
                id: `${building.id}-units`,
                name: `${building.units} Units`,
                role: 'Units',
                children: []
              },
              {
                id: `${building.id}-residents`,
                name: `${building.residents} Residents`,
                role: 'Residents',
                children: []
              }
            ]
          });
        });
        
        rootNode.children?.push(adminNode);
      });
    } else {
      // Buildings-focused view: Group by building type
      const buildingsByType: Record<string, any[]> = {};
      
      // Group buildings by type
      mockBuildings.forEach(building => {
        if (!buildingsByType[building.type]) {
          buildingsByType[building.type] = [];
        }
        buildingsByType[building.type].push(building);
      });
      
      // Add building types as first level, then buildings under each type
      Object.entries(buildingsByType).forEach(([type, buildings]) => {
        const typeNode: OrgNode = {
          id: `type-${type}`,
          name: type,
          role: 'Building Type',
          children: []
        };
        
        buildings.forEach(building => {
          // Find the administrator for this building
          const admin = mockAdministrators.find(a => a.id === building.administratorId);
          
          const buildingNode: OrgNode = {
            id: building.id,
            name: building.name,
            role: 'Building',
            image: building.image,
            children: []
          };
          
          // Add administrator as child
          if (admin) {
            buildingNode.children?.push({
              id: admin.id,
              name: admin.name,
              role: 'Administrator',
              image: admin.image,
            });
          }
          
          // Add units and residents info
          buildingNode.children?.push({
            id: `${building.id}-units`,
            name: `${building.units} Units`,
            role: 'Units',
            children: []
          });
          
          buildingNode.children?.push({
            id: `${building.id}-residents`,
            name: `${building.residents} Residents`,
            role: 'Residents',
            children: []
          });
          
          typeNode.children?.push(buildingNode);
        });
        
        rootNode.children?.push(typeNode);
      });
    }
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(() => resolve(rootNode), 1000));
  },
  
  /**
   * Get organization chart for an administrator
   * Shows only the buildings assigned to them
   */
  async getAdministratorOrganizationChart(adminId: string): Promise<OrgNode> {
    // Mock buildings for the administrator
    const mockBuildings = [
      {
        id: 'building1',
        name: 'Sunset Apartments',
        type: 'Residential',
        image: 'https://images.unsplash.com/photo-1554469384-e58fac937c33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        units: 24,
        residents: 38
      },
      {
        id: 'building2',
        name: 'Harbor View Residences',
        type: 'Residential',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        units: 42,
        residents: 67
      }
    ];
    
    // Create root node (administrator)
    const rootNode: OrgNode = {
      id: adminId,
      name: 'Administrator',
      role: 'Administrator',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      children: []
    };
    
    // Add buildings assigned to this administrator
    mockBuildings.forEach(building => {
      const buildingNode: OrgNode = {
        id: building.id,
        name: building.name,
        role: building.type,
        image: building.image,
        children: [
          {
            id: `${building.id}-units`,
            name: `${building.units} Units`,
            role: 'Units',
            children: []
          },
          {
            id: `${building.id}-residents`,
            name: `${building.residents} Residents`,
            role: 'Residents',
            children: []
          }
        ]
      };
      
      rootNode.children?.push(buildingNode);
    });
    
    // Simulate API delay
    return new Promise(resolve => setTimeout(() => resolve(rootNode), 1000));
  }
}; 