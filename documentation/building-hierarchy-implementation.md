# Building Hierarchy Implementation

## Overview

This document outlines how the building hierarchy is implemented in the Komuniteti admin application, adhering to the core modules documentation requirements.

## Role-Based Hierarchy

Based on the core modules documentation, we've implemented two distinct hierarchical views for the different user roles:

### Business Manager Hierarchy

For Business Managers, the hierarchy follows this structure:
```
Business Manager
    │
    ├── Business Account 1
    │   │
    │   ├── Building 1 ──► Residential Units/Business Units ──► Residents
    │   │
    │   ├── Building 2 ──► Residential Units/Business Units ──► Residents
    │   │
    │   └── Building 3 ──► Residential Units/Business Units ──► Residents
    │
    ├── Business Account 2
    │   │
    │   ├── Building 4 ──► Residential Units/Business Units ──► Residents
    │   │
    │   └── Building 5 ──► Residential Units/Business Units ──► Residents
    │
    └── Business Account 3
        │
        └── Building 6 ──► Residential Units/Business Units ──► Residents
```

Business Managers can:
- Switch between different business accounts they manage
- For each business, view and manage all associated buildings
- Access all the residential units, business units, and residents within each building
- Have a comprehensive view of the entire organizational structure

### Administrator Hierarchy

For Administrators, the hierarchy is simplified to focus on their assigned buildings:
```
Administrator
    │
    ├── Building 1 ──► Residential Units/Business Units ──► Residents
    │
    ├── Building 2 ──► Residential Units/Business Units ──► Residents
    │
    └── Building 3 ──► Residential Units/Business Units ──► Residents
```

Administrators can:
- Switch between different buildings they're responsible for
- Focus on one building at a time
- Manage the residential units, business units, and residents within their assigned buildings
- Cannot access the business account level or other buildings they're not assigned to

## Implementation Details

### Account Switcher

The account switcher component implements this hierarchy by:

1. **Detecting User Role**: The component checks whether the current user is a Business Manager or an Administrator.

2. **For Business Managers**:
   - Initially displays a list of business accounts
   - When a business account is selected, shows all buildings associated with that business
   - Allows selecting a building to focus on that building's management

3. **For Administrators**:
   - Directly displays a list of buildings assigned to the administrator
   - Allows switching between different buildings to focus management on one building at a time

### Building Information Display

Each building in the list shows:
- Building name and address
- Building type (Residential, Commercial, or Mixed-Use)
- Total number of units
- Additional metadata relevant to the building type

### Navigation Flow

1. **Business Manager Flow**:
   - Select a business account
   - View buildings under that business
   - Select a building to manage
   - Access units and residents within that building

2. **Administrator Flow**:
   - Select a building from assigned buildings
   - Focus UI on that building
   - Access units and residents within that building

## Data Structure

The application uses the following data model to represent the hierarchy:

```typescript
// Business Account (only for Business Managers)
interface BusinessAccount {
  id: string;
  name: string;
  email?: string;
  buildings: Building[];
}

// Building (for both roles)
interface Building {
  id: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial' | 'mixed';
  totalUnits: number;
  residentialUnits?: number;
  businessUnits?: number;
}

// Units (accessed through building)
interface ResidentialUnit {
  id: string;
  number: string;
  floor: number;
  size: number;
  residents: Resident[];
}

interface BusinessUnit {
  id: string;
  number: string;
  floor: number;
  size: number;
  businessName: string;
  businessType: string;
}

// Residents
interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  // Other resident properties
}
```

## Future Enhancements

Planned enhancements to the building hierarchy implementation include:

1. **Real-time synchronization** between business managers and administrators when changes are made to buildings
2. **Advanced filtering** of buildings based on type, occupancy, and other metrics
3. **Hierarchical reporting** that aggregates data at each level of the hierarchy
4. **Permission-based access control** for more granular control over what users can see and modify
5. **Building grouping** to organize buildings by geographical regions or other classifications 