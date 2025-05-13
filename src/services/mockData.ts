// This file contains mock data used for development and testing

export const mockBuildings = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main Street',
    units: 30,
    floors: 5,
    yearBuilt: 2010
  },
  {
    id: '2',
    name: 'Ocean View Residences',
    address: '456 Beach Road',
    units: 50,
    floors: 8,
    yearBuilt: 2015
  },
  {
    id: '3',
    name: 'Mountain Heights',
    address: '789 Summit Avenue',
    units: 20,
    floors: 4,
    yearBuilt: 2018
  }
];

export const mockProperties = [
  {
    id: '1',
    name: 'Apartment 101',
    buildingId: '1',
    floor: 1,
    size: 65,
    bedrooms: 1,
    bathrooms: 1,
    status: 'Occupied',
    residentId: '1',
    rent: 850
  },
  {
    id: '2',
    name: 'Apartment 102',
    buildingId: '1',
    floor: 1,
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Vacant',
    residentId: null,
    rent: 1200
  },
  {
    id: '3',
    name: 'Apartment 201',
    buildingId: '1',
    floor: 2,
    size: 100,
    bedrooms: 2,
    bathrooms: 2,
    status: 'Occupied',
    residentId: '2',
    rent: 1350
  },
  {
    id: '4',
    name: 'Apartment 301',
    buildingId: '2',
    floor: 3,
    size: 120,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Vacant',
    residentId: null,
    rent: 1600
  },
  {
    id: '5',
    name: 'Apartment 401',
    buildingId: '2',
    floor: 4,
    size: 150,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Occupied',
    residentId: '3',
    rent: 1800
  }
]; 