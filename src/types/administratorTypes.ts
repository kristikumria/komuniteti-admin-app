export interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  assignedBuildings: string[]; // Building IDs
  assignedBuildingNames?: string[]; // Building names for display
  role: 'administrator';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AdministratorFormData {
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  assignedBuildings: string[];
  status: 'active' | 'inactive';
} 