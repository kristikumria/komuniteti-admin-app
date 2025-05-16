import { BusinessAccount, Building } from '../store/slices/contextSlice';

// First create the building objects with their businessAccountId
const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: 'Sunrise Apartments',
    address: 'Rruga Myslym Shyri 12, Tirana',
    image: 'https://example.com/buildings/sunrise.jpg',
    businessAccountId: 'ba1',
  },
  {
    id: 'b2',
    name: 'Ocean View Residences',
    address: 'Rruga Durresit 45, Durres',
    image: 'https://example.com/buildings/ocean-view.jpg',
    businessAccountId: 'ba1',
  },
  {
    id: 'b3',
    name: 'Mountain Plaza',
    address: 'Sheshi Skenderbeg 8, Tirana',
    image: 'https://example.com/buildings/mountain-plaza.jpg',
    businessAccountId: 'ba2',
  },
  {
    id: 'b4',
    name: 'Green Hills Complex',
    address: 'Rruga e Elbasanit 112, Tirana',
    image: 'https://example.com/buildings/green-hills.jpg',
    businessAccountId: 'ba3',
  },
  {
    id: 'b5',
    name: 'Central Business Tower',
    address: 'Bulevardi Zogu I 24, Tirana',
    image: 'https://example.com/buildings/central-business.jpg',
    businessAccountId: 'ba4',
  },
];

// Then create business accounts with their buildings
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: 'ba1',
    name: 'Tirana Real Estate Management',
    logo: 'https://example.com/logos/tirana-rem.png',
    buildings: mockBuildings.filter(b => b.businessAccountId === 'ba1'),
  },
  {
    id: 'ba2',
    name: 'Durres Property Group',
    logo: 'https://example.com/logos/dpg.png',
    buildings: mockBuildings.filter(b => b.businessAccountId === 'ba2'),
  },
  {
    id: 'ba3',
    name: 'Coastal Holdings LLC',
    logo: 'https://example.com/logos/coastal.png',
    buildings: mockBuildings.filter(b => b.businessAccountId === 'ba3'),
  },
  {
    id: 'ba4',
    name: 'Mountain View Properties',
    logo: 'https://example.com/logos/mountain-view.png',
    buildings: mockBuildings.filter(b => b.businessAccountId === 'ba4'),
  },
];

/**
 * Fetch all business accounts for a business manager
 * @returns Promise resolving to array of business accounts
 */
export const fetchBusinessAccounts = async (): Promise<BusinessAccount[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBusinessAccounts);
    }, 800);
  });
};

/**
 * Fetch all buildings assigned to an administrator
 * @returns Promise resolving to array of buildings
 */
export const fetchAssignedBuildings = async (): Promise<Building[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBuildings);
    }, 800);
  });
};

/**
 * Fetch buildings for a specific business account
 * @param businessAccountId ID of the business account
 * @returns Promise resolving to array of buildings
 */
export const fetchBuildingsForBusinessAccount = async (
  businessAccountId: string
): Promise<Building[]> => {
  // Simulate API call delay with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the matching business account
      const account = mockBusinessAccounts.find(a => a.id === businessAccountId);
      if (account) {
        resolve(account.buildings);
      } else {
        resolve([]);
      }
    }, 800);
  });
}; 