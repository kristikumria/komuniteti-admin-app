import { Report } from '../../../navigation/types';

// Mock data for reports
export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Water Leak in Apartment 3B',
    submitter: 'John Smith',
    submitterId: 'user1',
    location: 'Building A, Floor 3, Apartment 3B',
    building: 'Building A',
    status: 'open',
    priority: 'high',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Water leaking from ceiling in bathroom. Needs immediate attention.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/leak1/400/300']
  },
  {
    id: '3',
    title: 'Heating System Issue',
    submitter: 'Mike Davis',
    submitterId: 'user3',
    location: 'Building A, All units',
    building: 'Building A',
    status: 'open',
    priority: 'medium',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Heating system not working properly in multiple units.',
    assignedTo: 'HVAC Specialist',
    images: ['https://picsum.photos/seed/heating/400/300']
  },
  {
    id: '5',
    title: 'Noise Complaint',
    submitter: 'Robert Chen',
    submitterId: 'user5',
    location: 'Building A, Floor 5, Apartment 5C',
    building: 'Building A',
    status: 'open',
    priority: 'low',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    description: 'Excessive noise from apartment 5D during late hours.',
    assignedTo: 'Building Manager',
    images: []
  },
  {
    id: '6',
    title: 'Parking Space Dispute',
    submitter: 'Lisa Brown',
    submitterId: 'user6',
    location: 'Building A, Parking Area',
    building: 'Building A',
    status: 'in-progress',
    priority: 'low',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    description: 'Dispute over assigned parking space with neighbor.',
    assignedTo: 'Building Manager',
    images: ['https://picsum.photos/seed/parking/400/300']
  },
  {
    id: '7',
    title: 'Mailbox Broken',
    submitter: 'David Kim',
    submitterId: 'user7',
    location: 'Building A, Entrance Hall',
    building: 'Building A',
    status: 'resolved',
    priority: 'medium',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    description: 'Mailbox lock is broken and cannot be secured.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/mailbox/400/300'],
    resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  }
]; 