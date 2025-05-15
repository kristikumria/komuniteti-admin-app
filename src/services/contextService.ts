import { BusinessAccount, Building } from '../store/slices/contextSlice';

/**
 * Mock data for business accounts that a business manager would have access to
 */
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: 'ba1',
    name: 'Tirana Real Estate Management',
    logo: 'https://example.com/logos/tirana-rem.png',
  },
  {
    id: 'ba2',
    name: 'Durres Property Group',
    logo: 'https://example.com/logos/dpg.png',
  },
  {
    id: 'ba3',
    name: 'Coastal Holdings LLC',
    logo: 'https://example.com/logos/coastal.png',
  },
  {
    id: 'ba4',
    name: 'Mountain View Properties',
    logo: 'https://example.com/logos/mountain-view.png',
  },
];

/**
 * Mock data for buildings that an administrator would have access to
 */
const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: 'Sunrise Apartments',
    address: 'Rruga Myslym Shyri 12, Tirana',
    image: 'https://example.com/buildings/sunrise.jpg',
  },
  {
    id: 'b2',
    name: 'Ocean View Residences',
    address: 'Rruga Durresit 45, Durres',
    image: 'https://example.com/buildings/ocean-view.jpg',
  },
  {
    id: 'b3',
    name: 'Mountain Plaza',
    address: 'Sheshi Skenderbeg 8, Tirana',
    image: 'https://example.com/buildings/mountain-plaza.jpg',
  },
  {
    id: 'b4',
    name: 'Green Hills Complex',
    address: 'Rruga e Elbasanit 112, Tirana',
    image: 'https://example.com/buildings/green-hills.jpg',
  },
  {
    id: 'b5',
    name: 'Central Business Tower',
    address: 'Bulevardi Zogu I 24, Tirana',
    image: 'https://example.com/buildings/central-business.jpg',
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
 * (In a real app, this would filter by the business account ID)
 * @param businessAccountId ID of the business account
 * @returns Promise resolving to array of buildings
 */
export const fetchBuildingsForBusinessAccount = async (
  businessAccountId: string
): Promise<Building[]> => {
  // Simulate API call delay with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would filter buildings by business account
      // Here we're simulating different buildings for different business accounts
      if (businessAccountId === 'ba1') {
        resolve(mockBuildings.slice(0, 3));
      } else if (businessAccountId === 'ba2') {
        resolve(mockBuildings.slice(2, 5));
      } else if (businessAccountId === 'ba3') {
        resolve(mockBuildings.slice(1, 4));
      } else {
        resolve(mockBuildings.slice(0, 2));
      }
    }, 800);
  });
}; 