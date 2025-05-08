import React, { useState, useEffect } from 'react';
import { BarChart3, Building, Users, Wallet, Wrench, Bell, MessageSquare, HelpCircle, BarChart, LogOut, Menu, ArrowLeft, Plus, Edit, Trash2, User, Home, Mail, Phone, UserCheck, ChevronRight, CheckCircle, XCircle, Clock, FileText, Search, Calendar, Archive, PieChart, Settings, FileBarChart, AlertTriangle, CheckSquare, X, Map, Info, Zap, Lock, DollarSign } from 'lucide-react';

const KomunitetiApp = () => {
  // App state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedAdministrator, setSelectedAdministrator] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Mock data
  const mockBuildings = [
    { 
      id: 1, 
      name: 'Panorama Residence', 
      address: 'Rruga Ismail Qemali 45, Tirana', 
      units: 24, 
      residents: 68, 
      issues: 3, 
      occupancyRate: 95,
      maintenanceCost: '€1,250/month',
      yearBuilt: 2018,
      propertyType: 'Residential',
      amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security'],
      image: '/api/placeholder/120/80' 
    },
    { 
      id: 2, 
      name: 'Green Tower', 
      address: 'Bulevardi Zogu I 132, Tirana', 
      units: 48, 
      residents: 142, 
      issues: 7, 
      occupancyRate: 88,
      maintenanceCost: '€2,800/month',
      yearBuilt: 2015,
      propertyType: 'Mixed Use',
      amenities: ['Retail Space', 'Offices', 'Rooftop Garden', 'Parking'],
      image: '/api/placeholder/120/80' 
    },
    { 
      id: 3, 
      name: 'Lakeview Apartments', 
      address: 'Rruga e Elbasanit 103, Tirana', 
      units: 36, 
      residents: 95, 
      issues: 2, 
      occupancyRate: 97,
      maintenanceCost: '€1,780/month',
      yearBuilt: 2020,
      propertyType: 'Residential',
      amenities: ['Playground', 'Parking', 'Smart Home Systems'],
      image: '/api/placeholder/120/80' 
    },
    { 
      id: 4, 
      name: 'City Garden Complex', 
      address: 'Rruga Myslym Shyri 72, Tirana', 
      units: 60, 
      residents: 175, 
      issues: 5, 
      occupancyRate: 91,
      maintenanceCost: '€3,560/month',
      yearBuilt: 2017,
      propertyType: 'Residential',
      amenities: ['Community Garden', 'Fitness Center', 'Dog Park', 'Concierge'],
      image: '/api/placeholder/120/80' 
    },
    { 
      id: 5, 
      name: 'Tirana Business Center', 
      address: 'Bulevardi Dëshmorët e Kombit 12, Tirana', 
      units: 32, 
      residents: 28, 
      issues: 1, 
      occupancyRate: 85,
      maintenanceCost: '€4,200/month',
      yearBuilt: 2016,
      propertyType: 'Commercial',
      amenities: ['Conference Rooms', 'High-speed Internet', 'Security', 'Cafeteria'],
      image: '/api/placeholder/120/80' 
    },
  ];

  const mockAdmins = [
    { 
      id: 1, 
      name: 'Arben Hoxha', 
      email: 'arben.hoxha@komuniteti.al', 
      phone: '+355 69 123 4567', 
      buildings: 3,
      buildingsList: ['Panorama Residence', 'Green Tower', 'Lakeview Apartments'],
      role: 'Senior Property Manager',
      hireDate: '2019-03-15',
      performance: 95,
      tenantSatisfaction: 4.7,
      issueResolutionTime: '24 hours',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 2, 
      name: 'Miranda Kola', 
      email: 'miranda.kola@komuniteti.al', 
      phone: '+355 69 234 5678', 
      buildings: 2,
      buildingsList: ['City Garden Complex', 'Tirana Business Center'],
      role: 'Property Manager',
      hireDate: '2020-07-11',
      performance: 88,
      tenantSatisfaction: 4.2,
      issueResolutionTime: '36 hours',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 3, 
      name: 'Genti Malaj', 
      email: 'genti.malaj@komuniteti.al', 
      phone: '+355 69 345 6789', 
      buildings: 4,
      buildingsList: ['Panorama Residence', 'Green Tower', 'City Garden Complex', 'Lakeview Apartments'],
      role: 'Assistant Property Manager',
      hireDate: '2021-05-22',
      performance: 91,
      tenantSatisfaction: 4.5,
      issueResolutionTime: '28 hours',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 4, 
      name: 'Elira Hoxha', 
      email: 'elira.hoxha@komuniteti.al', 
      phone: '+355 69 456 7890', 
      buildings: 1,
      buildingsList: ['Tirana Business Center'],
      role: 'Commercial Property Specialist',
      hireDate: '2022-01-10',
      performance: 93,
      tenantSatisfaction: 4.6,
      issueResolutionTime: '24 hours',
      image: '/api/placeholder/60/60' 
    }
  ];

  const mockResidents = [
    { 
      id: 1, 
      name: 'Klara Dervishi', 
      email: 'klara.dervishi@gmail.com', 
      phone: '+355 69 987 6543', 
      unit: 'A-103', 
      building: 'Panorama Residence',
      status: 'owner', 
      moveInDate: '2019-06-12',
      familyMembers: 3,
      pets: 'Cat',
      paymentStatus: 'current',
      communicationPreference: 'Email',
      accountBalance: '€0.00',
      lastPaymentDate: '2025-04-01',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 2, 
      name: 'Bledi Hasani', 
      email: 'bledi.h@hotmail.com', 
      phone: '+355 69 876 5432', 
      unit: 'A-207', 
      building: 'Panorama Residence',
      status: 'tenant', 
      moveInDate: '2022-03-15',
      familyMembers: 1,
      pets: 'None',
      paymentStatus: 'current',
      communicationPreference: 'Phone',
      accountBalance: '€0.00',
      lastPaymentDate: '2025-04-02',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 3, 
      name: 'Elona Kraja', 
      email: 'elona.kraja@gmail.com', 
      phone: '+355 69 765 4321', 
      unit: 'B-105', 
      building: 'Green Tower',
      status: 'owner', 
      moveInDate: '2020-11-20',
      familyMembers: 4,
      pets: 'Dog',
      paymentStatus: 'overdue',
      communicationPreference: 'Email',
      accountBalance: '€120.00',
      lastPaymentDate: '2025-03-01',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 4, 
      name: 'Dritan Mema', 
      email: 'dritan.m@gmail.com', 
      phone: '+355 69 654 3210', 
      unit: 'B-302', 
      building: 'Green Tower',
      status: 'tenant', 
      moveInDate: '2023-01-05',
      familyMembers: 2,
      pets: 'None',
      paymentStatus: 'current',
      communicationPreference: 'In-app',
      accountBalance: '€0.00',
      lastPaymentDate: '2025-04-01',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 5, 
      name: 'Arta Lushi', 
      email: 'arta.lushi@gmail.com', 
      phone: '+355 69 543 2109', 
      unit: 'C-201', 
      building: 'Lakeview Apartments',
      status: 'owner', 
      moveInDate: '2022-05-15',
      familyMembers: 3,
      pets: 'None',
      paymentStatus: 'current',
      communicationPreference: 'Email',
      accountBalance: '€0.00',
      lastPaymentDate: '2025-04-03',
      image: '/api/placeholder/60/60' 
    },
    { 
      id: 6, 
      name: 'Erion Basha', 
      email: 'erion.basha@gmail.com', 
      phone: '+355 69 432 1098', 
      unit: 'A-105', 
      building: 'City Garden Complex',
      status: 'tenant', 
      moveInDate: '2023-06-01',
      familyMembers: 2,
      pets: 'Cat',
      paymentStatus: 'overdue',
      communicationPreference: 'Phone',
      accountBalance: '€120.00',
      lastPaymentDate: '2025-03-01',
      image: '/api/placeholder/60/60' 
    }
  ];

  const mockPayments = [
    { 
      id: 1, 
      resident: 'Klara Dervishi',
      residentId: 1,
      amount: '120.00', 
      dueDate: '2025-05-15', 
      status: 'pending', 
      description: 'Monthly maintenance fee - May',
      building: 'Panorama Residence',
      unit: 'A-103',
      invoiceNumber: 'INV-2025-0512',
      paymentMethod: '',
      createdDate: '2025-04-25'
    },
    { 
      id: 2, 
      resident: 'Bledi Hasani',
      residentId: 2,
      amount: '120.00', 
      dueDate: '2025-05-15', 
      status: 'paid', 
      description: 'Monthly maintenance fee - May',
      building: 'Panorama Residence',
      unit: 'A-207',
      invoiceNumber: 'INV-2025-0513',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-04-28',
      createdDate: '2025-04-25'
    },
    { 
      id: 3, 
      resident: 'Elona Kraja',
      residentId: 3,
      amount: '120.00', 
      dueDate: '2025-04-15', 
      status: 'overdue', 
      description: 'Monthly maintenance fee - April',
      building: 'Green Tower',
      unit: 'B-105',
      invoiceNumber: 'INV-2025-0421',
      paymentMethod: '',
      createdDate: '2025-03-25'
    },
    { 
      id: 4, 
      resident: 'Dritan Mema',
      residentId: 4,
      amount: '120.00', 
      dueDate: '2025-05-15', 
      status: 'pending', 
      description: 'Monthly maintenance fee - May',
      building: 'Green Tower',
      unit: 'B-302',
      invoiceNumber: 'INV-2025-0514',
      paymentMethod: '',
      createdDate: '2025-04-25'
    },
    { 
      id: 5, 
      resident: 'Arta Lushi',
      residentId: 5,
      amount: '150.00', 
      dueDate: '2025-05-15', 
      status: 'paid', 
      description: 'Monthly maintenance fee - May',
      building: 'Lakeview Apartments',
      unit: 'C-201',
      invoiceNumber: 'INV-2025-0515',
      paymentMethod: 'Credit Card',
      paymentDate: '2025-04-30',
      createdDate: '2025-04-25'
    },
    { 
      id: 6, 
      resident: 'Erion Basha',
      residentId: 6,
      amount: '135.00', 
      dueDate: '2025-04-15', 
      status: 'overdue', 
      description: 'Monthly maintenance fee - April',
      building: 'City Garden Complex',
      unit: 'A-105',
      invoiceNumber: 'INV-2025-0422',
      paymentMethod: '',
      createdDate: '2025-03-25'
    },
    { 
      id: 7, 
      resident: 'Klara Dervishi',
      residentId: 1,
      amount: '85.00', 
      dueDate: '2025-04-15', 
      status: 'paid', 
      description: 'Parking fee - April',
      building: 'Panorama Residence',
      unit: 'A-103',
      invoiceNumber: 'INV-2025-0422-P',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-04-10',
      createdDate: '2025-03-25'
    }
  ];

  const mockReports = [
    { 
      id: 1, 
      title: 'Water leak in hallway', 
      submitter: 'Klara Dervishi',
      submitterId: 1, 
      location: 'Panorama Residence, Building A, 1st floor',
      building: 'Panorama Residence',
      status: 'open', 
      priority: 'high', 
      date: '2025-04-29',
      description: 'There is water leaking from the ceiling near apartment A-105. The leak is getting worse and starting to damage the carpet.',
      assignedTo: 'Unassigned',
      images: ['/api/placeholder/120/80', '/api/placeholder/120/80'],
      estimatedCost: '€150-300',
      comments: [
        { author: 'Arben Hoxha', text: 'I will inspect this today', timestamp: '2025-04-29 15:30' }
      ]
    },
    { 
      id: 2, 
      title: 'Elevator malfunction', 
      submitter: 'Bledi Hasani',
      submitterId: 2, 
      location: 'Panorama Residence, Building A, elevator 2',
      building: 'Panorama Residence',
      status: 'in-progress', 
      priority: 'urgent', 
      date: '2025-04-28',
      description: 'Elevator #2 is making loud noises and stopping between floors. Multiple residents have reported feeling unsafe.',
      assignedTo: 'Elevator Maintenance Co.',
      images: ['/api/placeholder/120/80'],
      estimatedCost: '€500-1200',
      serviceAppointment: '2025-04-30 10:00',
      comments: [
        { author: 'Arben Hoxha', text: 'Technician has been called, will arrive tomorrow morning', timestamp: '2025-04-28 14:15' },
        { author: 'Genti Malaj', text: 'I\'ve put up warning signs and disabled the elevator', timestamp: '2025-04-28 16:45' }
      ]
    },
    { 
      id: 3, 
      title: 'Broken light fixture', 
      submitter: 'Elona Kraja',
      submitterId: 3, 
      location: 'Green Tower, Building B, 3rd floor',
      building: 'Green Tower',
      status: 'resolved', 
      priority: 'medium', 
      date: '2025-04-25',
      description: 'The light fixture near apartment B-302 is broken and hanging from the ceiling. Could be a safety hazard.',
      assignedTo: 'Maintenance Staff',
      resolvedDate: '2025-04-27',
      resolutionDetails: 'Replaced fixture with new LED model',
      actualCost: '€85',
      images: ['/api/placeholder/120/80', '/api/placeholder/120/80'],
      comments: [
        { author: 'Miranda Kola', text: 'Scheduled for replacement tomorrow', timestamp: '2025-04-25 11:20' },
        { author: 'Maintenance Staff', text: 'Fixture has been replaced with a new LED model', timestamp: '2025-04-27 14:30' }
      ]
    },
    { 
      id: 4, 
      title: 'Parking gate malfunction', 
      submitter: 'Dritan Mema',
      submitterId: 4, 
      location: 'Green Tower, Underground parking',
      building: 'Green Tower',
      status: 'in-progress', 
      priority: 'high', 
      date: '2025-04-30',
      description: 'The parking garage gate is not opening consistently with access cards. Sometimes it takes 5-6 attempts.',
      assignedTo: 'Security Systems Ltd.',
      serviceAppointment: '2025-05-02 09:00',
      images: ['/api/placeholder/120/80'],
      estimatedCost: '€200-350',
      comments: [
        { author: 'Miranda Kola', text: 'I\'ve contacted the security system company', timestamp: '2025-04-30 10:15' }
      ]
    },
    { 
      id: 5, 
      title: 'Garbage disposal area needs cleaning', 
      submitter: 'Arta Lushi',
      submitterId: 5, 
      location: 'Lakeview Apartments, Rear entrance',
      building: 'Lakeview Apartments',
      status: 'open', 
      priority: 'medium', 
      date: '2025-05-01',
      description: 'The garbage collection area behind the building needs urgent cleaning. There are unpleasant odors and some waste outside the bins.',
      assignedTo: 'Unassigned',
      images: ['/api/placeholder/120/80'],
      comments: []
    }
  ];

  // Effect for generating mock notifications
  useEffect(() => {
    if (userRole) {
      const notificationTypes = [
        { title: 'New maintenance request', message: 'A new maintenance request has been submitted', icon: 'Wrench' },
        { title: 'Payment received', message: 'A payment has been received', icon: 'DollarSign' },
        { title: 'Issue resolved', message: 'A maintenance issue has been marked as resolved', icon: 'CheckCircle' },
        { title: 'New resident added', message: 'A new resident has been added to the system', icon: 'UserCheck' },
        { title: 'Overdue payment', message: 'A payment is now overdue', icon: 'AlertTriangle' }
      ];
      
      const mockNotifications = Array.from({length: 5}, (_, i) => {
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        return {
          id: i + 1,
          title: type.title,
          message: type.message,
          icon: type.icon,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
          read: Math.random() > 0.5
        };
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(mockNotifications);
    }
  }, [userRole]);

  // Navigation functions
  const navigateTo = (screen) => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setCurrentScreen(screen);
      setMenuOpen(false);
      setLoading(false);
    }, 300);
  };

  const handleLogin = (role) => {
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      setUserRole(role);
      setCurrentScreen(role === 'business' ? 'bmDashboard' : 'pmDashboard');
      setLoading(false);
    }, 800);
  };

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentScreen('login');
      setUserRole(null);
      setSelectedBuilding(null);
      setSelectedResident(null);
      setSelectedAdministrator(null);
      setSelectedReport(null);
      setSelectedProperty(null);
      setLoading(false);
    }, 500);
  };

  const viewBuildingDetails = (building) => {
    setSelectedBuilding(building);
    navigateTo('buildingDetails');
  };

  const viewResidentDetails = (resident) => {
    setSelectedResident(resident);
    navigateTo('residentDetails');
  };
  
  const viewAdministratorDetails = (admin) => {
    setSelectedAdministrator(admin);
    navigateTo('administratorDetails');
  };
  
  const viewReportDetails = (report) => {
    setSelectedReport(report);
    navigateTo('reportDetails');
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const selectProperty = (property) => {
    setSelectedProperty(property);
  };

  // UI Components
  const MobileFrame = ({ children }) => (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <div className={`relative w-96 h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg flex items-center">
              <div className="w-6 h-6 border-2 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mr-3"></div>
              <p className="text-gray-700">Loading...</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );

  const Header = ({ title, showBack = false, showMenu = true, action = null }) => (
    <div className={`flex items-center justify-between p-4 ${darkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white`}>
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={() => navigateTo(userRole === 'business' ? 'bmDashboard' : 'pmDashboard')} 
            className="mr-2 hover:bg-blue-700 p-1 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center">
        {action && (
          <button onClick={action.onClick} className="mr-3 hover:bg-blue-700 p-1 rounded-full transition-colors">
            {action.icon}
          </button>
        )}
        {showMenu && (
          <button 
            onClick={() => setMenuOpen(true)}
            className="hover:bg-blue-700 p-1 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const BottomNav = () => {
    const isBusinessManager = userRole === 'business';
    
    return (
      <div className={`absolute bottom-0 left-0 right-0 flex justify-around items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-2`}>
        <button 
          onClick={() => navigateTo(isBusinessManager ? 'bmDashboard' : 'pmDashboard')} 
          className="flex flex-col items-center p-1">
          <BarChart3 
            size={22} 
            className={currentScreen.includes('Dashboard') 
              ? 'text-blue-600' 
              : darkMode ? 'text-gray-400' : 'text-gray-500'} 
          />
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dashboard</span>
        </button>
        
        <button 
          onClick={() => navigateTo(isBusinessManager ? 'buildings' : 'residents')} 
          className="flex flex-col items-center p-1">
          {isBusinessManager ? (
            <Building 
              size={22} 
              className={currentScreen === 'buildings' || currentScreen === 'buildingDetails' 
                ? 'text-blue-600' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'} 
            />
          ) : (
            <Users 
              size={22} 
              className={currentScreen === 'residents' || currentScreen === 'residentDetails' 
                ? 'text-blue-600' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'} 
            />
          )}
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBusinessManager ? 'Buildings' : 'Residents'}
          </span>
        </button>
        
        <button 
          onClick={() => navigateTo(isBusinessManager ? 'administrators' : 'payments')} 
          className="flex flex-col items-center p-1">
          {isBusinessManager ? (
            <UserCheck 
              size={22} 
              className={currentScreen === 'administrators' || currentScreen === 'administratorDetails' 
                ? 'text-blue-600' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'} 
            />
          ) : (
            <Wallet 
              size={22} 
              className={currentScreen === 'payments' || currentScreen === 'paymentDetails' 
                ? 'text-blue-600' 
                : darkMode ? 'text-gray-400' : 'text-gray-500'} 
            />
          )}
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBusinessManager ? 'Admins' : 'Payments'}
          </span>
        </button>
        
        <button 
          onClick={() => navigateTo('reports')} 
          className="flex flex-col items-center p-1">
          <Wrench 
            size={22} 
            className={currentScreen === 'reports' || currentScreen === 'reportDetails' 
              ? 'text-blue-600' 
              : darkMode ? 'text-gray-400' : 'text-gray-500'} 
          />
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reports</span>
        </button>

        <button 
          onClick={() => navigateTo('notifications')} 
          className="flex flex-col items-center p-1 relative">
          <Bell 
            size={22} 
            className={currentScreen === 'notifications' 
              ? 'text-blue-600' 
              : darkMode ? 'text-gray-400' : 'text-gray-500'} 
          />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-0 right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alerts</span>
        </button>
      </div>
    );
  };

  const SideMenu = () => (
    <div className={`absolute inset-0 z-10 ${menuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}></div>
      <div className={`absolute right-0 top-0 bottom-0 w-72 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg transition-all duration-300 ease-in-out transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`${darkMode ? 'bg-blue-800' : 'bg-blue-600'} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Komuniteti</h2>
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center">
            <img src="/api/placeholder/48/48" alt="User" className="w-12 h-12 rounded-full mr-3 border-2 border-white" />
            <div>
              <p className="font-medium">{userRole === 'business' ? 'Elena Koci' : 'Arben Hoxha'}</p>
              <p className="text-sm text-blue-100">{userRole === 'business' ? 'Business Manager' : 'Property Manager'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>NAVIGATION</p>
            <button 
              onClick={toggleDarkMode} 
              className={`flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => navigateTo(userRole === 'business' ? 'bmDashboard' : 'pmDashboard')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen.includes('Dashboard') 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <BarChart3 size={20} className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo(userRole === 'business' ? 'buildings' : 'residents')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  (currentScreen === 'buildings' || currentScreen === 'residents') 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {userRole === 'business' ? (
                  <Building size={20} className="mr-3" />
                ) : (
                  <Users size={20} className="mr-3" />
                )}
                <span>{userRole === 'business' ? 'Buildings' : 'Residents'}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('notifications')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'notifications' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <Bell size={20} className="mr-3" />
                <span>Notifications</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('messages')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'messages' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <MessageSquare size={20} className="mr-3" />
                <span>Messages</span>
              </button>
            </li>
            
            <div className="mt-4 mb-2">
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>TOOLS</p>
            </div>
            
            <li>
              <button 
                onClick={() => navigateTo('info')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'info' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <Info size={20} className="mr-3" />
                <span>InfoPoints</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('polls')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'polls' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <BarChart size={20} className="mr-3" />
                <span>Polls & Surveys</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('organigram')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'organigram' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <Users size={20} className="mr-3" />
                <span>Organigram</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('analytics')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'analytics' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <FileBarChart size={20} className="mr-3" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('settings')} 
                className={`flex items-center py-2 px-3 w-full rounded-lg ${
                  currentScreen === 'settings' 
                    ? 'bg-blue-100 text-blue-800' 
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <Settings size={20} className="mr-3" />
                <span>Settings</span>
              </button>
            </li>
            
            <li className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4`}>
              <button 
                onClick={logout} 
                className={`flex items-center py-2 px-3 w-full rounded-lg text-red-600 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Screen Components
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [useBiometrics, setUseBiometrics] = useState(false);
    
    return (
      <div className={`flex flex-col items-center justify-center h-full p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="relative mb-8">
          <img src="/api/placeholder/120/120" alt="Komuniteti Logo" className="rounded-full shadow-lg" />
          <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white rounded-full p-2">
            <Building size={18} />
          </div>
        </div>
        
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-1`}>Komuniteti</h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-8`}>Property Management Platform</p>
        
        <div className="space-y-5 w-full max-w-xs">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="youremail@example.com"
              />
              <Mail size={18} className={`absolute left-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
            <div className="relative">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} 
                placeholder="••••••••"
              />
              <Lock size={18} className={`absolute left-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Remember me
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="biometrics" 
                type="checkbox" 
                checked={useBiometrics}
                onChange={() => setUseBiometrics(!useBiometrics)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="biometrics" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Use biometrics
              </label>
            </div>
          </div>
          
          <button 
            onClick={() => handleLogin('business')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
          >
            <User size={18} className="mr-2" />
            Login as Business Manager
          </button>
          
          <button 
            onClick={() => handleLogin('property')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
          >
            <Building size={18} className="mr-2" />
            Login as Property Manager
          </button>
          
          <div className="flex justify-between text-sm">
            <a href="#" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Forgot Password?</a>
            <a href="#" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Create Account</a>
          </div>
        </div>
        
        <div className="absolute bottom-5 text-center">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>© 2025 Komuniteti. All rights reserved.</p>
        </div>
      </div>
    );
  };

  const BusinessManagerDashboard = () => {
    const [greeting, setGreeting] = useState('');
    
    useEffect(() => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    }, []);
    
    return (
      <>
        <Header 
          title="Business Dashboard" 
          action={{ 
            icon: <Settings size={20} />, 
            onClick: () => navigateTo('settings') 
          }} 
        />
        <div className={`p-4 pb-20 overflow-y-auto h-full ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <div className="mb-6">
            <h1 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{greeting}, Elena</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Here's what's happening across your properties
            </p>
          </div>
        
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-4 rounded-lg`}>
              <div className="flex items-center mb-1">
                <Building size={16} className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} mr-1`} />
                <p className={`text-xs font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Buildings</p>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>{mockBuildings.length}</p>
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>+1 this month</p>
            </div>
            <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} p-4 rounded-lg`}>
              <div className="flex items-center mb-1">
                <UserCheck size={16} className={`${darkMode ? 'text-green-300' : 'text-green-600'} mr-1`} />
                <p className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Admins</p>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-green-100' : 'text-green-800'}`}>{mockAdmins.length}</p>
              <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-600'}`}>All active</p>
            </div>
            <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} p-4 rounded-lg`}>
              <div className="flex items-center mb-1">
                <Zap size={16} className={`${darkMode ? 'text-purple-300' : 'text-purple-600'} mr-1`} />
                <p className={`text-xs font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Services</p>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-purple-100' : 'text-purple-800'}`}>8</p>
              <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>2 maintenance, 6 amenities</p>
            </div>
            <div className={`${darkMode ? 'bg-amber-900' : 'bg-amber-100'} p-4 rounded-lg`}>
              <div className="flex items-center mb-1">
                <Users size={16} className={`${darkMode ? 'text-amber-300' : 'text-amber-600'} mr-1`} />
                <p className={`text-xs font-medium ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}>Residents</p>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>508</p>
              <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}>+12 this month</p>
            </div>
          </div>
          
          <div className={`mb-6 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
            <div className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
              <h2 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Financial Overview</h2>
              <button className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>View Report</button>
            </div>
            <div className="p-4">
              <div className={`h-36 w-full rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                <div className="h-full w-full flex items-center justify-center">
                  <PieChart size={80} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Revenue</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>€68,450</p>
                  <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>+5.2% from last month</p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Outstanding</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>€4,680</p>
                  <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>6.8% of total</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Maintenance Issues</h2>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm`}>
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Open Issues</p>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-red-600">8</p>
                      <span className="ml-1 text-xs text-red-500">+2</span>
                    </div>
                  </div>
                  <div className={`h-12 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mx-2`}></div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>In Progress</p>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-yellow-500">5</p>
                      <span className="ml-1 text-xs text-yellow-500">+1</span>
                    </div>
                  </div>
                  <div className={`h-12 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mx-2`}></div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Resolved</p>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-green-600">12</p>
                      <span className="ml-1 text-xs text-green-500">+7</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. resolution time: <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>30 hours</span></p>
                <button onClick={() => navigateTo('reports')} className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>View All</button>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Properties</h2>
              <button onClick={() => navigateTo('buildings')} className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center`}>
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {mockBuildings.slice(0, 3).map(building => (
                <div 
                  key={building.id} 
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3 flex items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => viewBuildingDetails(building)}
                >
                  <img src={building.image} alt={building.name} className="w-14 h-14 rounded-md mr-3 object-cover" />
                  <div className="flex-1">
                    <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{building.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{building.address}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} px-2 py-0.5 rounded-full mr-2`}>
                        {building.units} units
                      </span>
                      <span className={`text-xs ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'} px-2 py-0.5 rounded-full`}>
                        {building.occupancyRate}% occupied
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2`} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Activity</h2>
              <button className={`text-xs ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'} px-2 py-1 rounded-md border flex items-center`}>
                <Calendar size={14} className="mr-1" /> Today
              </button>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
              <div className="p-3 flex">
                <div className={`mr-3 mt-0.5 p-2 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <CheckCircle size={16} className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Arben Hoxha</span> 
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> resolved a maintenance issue at </span>
                    <span className="font-medium">Panorama Residence</span>
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>2 hours ago</p>
                </div>
              </div>
              <div className="p-3 flex">
                <div className={`mr-3 mt-0.5 p-2 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                  <UserCheck size={16} className={`${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Miranda Kola</span> 
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> added a new resident to </span>
                    <span className="font-medium">Green Tower</span>
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Yesterday</p>
                </div>
              </div>
              <div className="p-3 flex">
                <div className={`mr-3 mt-0.5 p-2 rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <FileText size={16} className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">System</span> 
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> generated monthly payment invoices for </span>
                    <span className="font-medium">All Properties</span>
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>2 days ago</p>
                </div>
              </div>
              <div className={`p-3 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} text-center`}>
                <button className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>View All Activity</button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };

  const PropertyManagerDashboard = () => (
    <>
      <Header title="Property Dashboard" />
      <div className="p-4 pb-20 overflow-y-auto h-full">
        <div className="mb-4">
          <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
            <option>Panorama Residence</option>
            <option>Green Tower</option>
            <option>Lakeview Apartments</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Units</p>
            <p className="text-2xl font-bold text-blue-800">24</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-xs text-green-600 font-medium">Residents</p>
            <p className="text-2xl font-bold text-green-800">68</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-xs text-red-600 font-medium">Open Issues</p>
            <p className="text-2xl font-bold text-red-800">3</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-xs text-yellow-600 font-medium">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-800">12</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Recent Issues</h2>
            <button onClick={() => navigateTo('reports')} className="text-sm text-blue-600">View All</button>
          </div>
          
          <div className="space-y-3">
            {mockReports.slice(0, 2).map(report => (
              <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex justify-between">
                  <h3 className="font-medium">{report.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'open' ? 'bg-red-100 text-red-800' : 
                    report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{report.submitter} - {report.location}</p>
                <p className="text-xs text-gray-500">{report.date}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Recent Residents</h2>
            <button onClick={() => navigateTo('residents')} className="text-sm text-blue-600">View All</button>
          </div>
          
          <div className="space-y-3">
            {mockResidents.slice(0, 2).map(resident => (
              <div 
                key={resident.id} 
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-sm"
                onClick={() => viewResidentDetails(resident)}
              >
                <img src={resident.image} alt={resident.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h3 className="font-medium">{resident.name}</h3>
                  <p className="text-sm text-gray-500">Unit {resident.unit}</p>
                  <p className="text-xs text-blue-600">{resident.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
      {menuOpen && <SideMenu />}
    </>
  );

  const BuildingsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
      propertyType: 'all',
      sortBy: 'name'
    });
    
    const filteredBuildings = mockBuildings.filter(building => 
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <>
        <Header 
          title="Buildings" 
          showBack={true} 
          action={{ 
            icon: <Plus size={20} />, 
            onClick: () => alert('Add new building') 
          }} 
        />
        <div className={`pb-20 overflow-y-auto h-full ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <div className="p-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900'
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setViewType('grid')} 
                  className={`p-1.5 rounded ${
                    viewType === 'grid' 
                      ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600' 
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Archive size={18} />
                </button>
                <button 
                  onClick={() => setViewType('list')} 
                  className={`p-1.5 rounded ${
                    viewType === 'list' 
                      ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600' 
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <BarChart3 size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center text-sm px-3 py-1.5 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <Settings size={14} className="mr-1.5" /> 
                Filter
              </button>
            </div>
            
            {filterOpen && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <div className="mb-3">
                  <p className={`text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Property Type</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setFilters({...filters, propertyType: 'all'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.propertyType === 'all' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, propertyType: 'residential'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.propertyType === 'residential' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Residential
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, propertyType: 'commercial'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.propertyType === 'commercial' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Commercial
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, propertyType: 'mixed'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.propertyType === 'mixed' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Mixed Use
                    </button>
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort By</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setFilters({...filters, sortBy: 'name'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.sortBy === 'name' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Name
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, sortBy: 'residents'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.sortBy === 'residents' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Residents
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, sortBy: 'issues'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.sortBy === 'issues' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Issues
                    </button>
                    <button 
                      onClick={() => setFilters({...filters, sortBy: 'newest'})}
                      className={`px-2 py-1 text-xs rounded-full ${
                        filters.sortBy === 'newest' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Newest
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filteredBuildings.length} properties found
            </p>
          </div>
          
          {viewType === 'grid' ? (
            <div className="px-4 space-y-4 mb-4">
              {filteredBuildings.map(building => (
                <div 
                  key={building.id} 
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                  onClick={() => viewBuildingDetails(building)}
                >
                  <div className="h-40 bg-gray-300 relative">
                    <img 
                      src="/api/placeholder/384/160" 
                      alt={building.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        building.propertyType === 'Residential' 
                          ? 'bg-blue-500 text-white' 
                          : building.propertyType === 'Commercial'
                            ? 'bg-purple-500 text-white'
                            : 'bg-green-500 text-white'
                      }`}>
                        {building.propertyType}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                      <h3 className="font-semibold text-white text-lg">{building.name}</h3>
                      <p className="text-sm text-gray-200">{building.address}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="mb-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{building.occupancyRate}%</span> Occupancy Rate
                      </p>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            building.occupancyRate > 90 ? 'bg-green-500' :
                            building.occupancyRate > 80 ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} 
                          style={{ width: `${building.occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded-full`}>
                        {building.units} units
                      </span>
                      <span className={`text-xs ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'} px-2 py-1 rounded-full`}>
                        {building.residents} residents
                      </span>
                      <span className={`text-xs ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full`}>
                        {building.issues} {building.issues === 1 ? 'issue' : 'issues'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-800'} px-2 py-1 rounded-full`}>
                        Built {building.yearBuilt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 space-y-2 mb-4">
              {filteredBuildings.map(building => (
                <div 
                  key={building.id} 
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3 flex items-center hover:shadow-md transition-shadow`}
                  onClick={() => viewBuildingDetails(building)}
                >
                  <img src={building.image} alt={building.name} className="w-16 h-16 rounded-md object-cover mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{building.name}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 ${
                        building.propertyType === 'Residential' 
                          ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800' 
                          : building.propertyType === 'Commercial'
                            ? darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                            : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      }`}>
                        {building.propertyType}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{building.address}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <Users size={14} className={`mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{building.residents}</span>
                        <span className="mx-1.5 text-gray-400">•</span>
                        <Building size={14} className={`mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{building.units}</span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        building.issues > 5 
                          ? darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800' 
                          : building.issues > 0
                            ? darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      }`}>
                        {building.issues} {building.issues === 1 ? 'issue' : 'issues'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };

  const BuildingDetails = () => {
    if (!selectedBuilding) return null;
    
    return (
      <>
        <Header title="Building Details" showBack={true} />
        <div className="overflow-y-auto h-full pb-20">
          <div className="h-48 bg-gray-200 relative">
            <img 
              src="/api/placeholder/320/192" 
              alt={selectedBuilding.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-xl font-bold text-white">{selectedBuilding.name}</h1>
              <p className="text-sm text-white opacity-90">{selectedBuilding.address}</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Units</p>
                <p className="text-lg font-semibold">{selectedBuilding.units}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Residents</p>
                <p className="text-lg font-semibold">{selectedBuilding.residents}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Issues</p>
                <p className="text-lg font-semibold">{selectedBuilding.issues}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold">Building Administrators</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                {mockAdmins.slice(0, 2).map(admin => (
                  <div key={admin.id} className="p-3 flex items-center">
                    <img src={admin.image} className="w-8 h-8 rounded-full mr-3" alt={admin.name} />
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold">Recent Issues</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                {mockReports.slice(0, 2).map(report => (
                  <div key={report.id} className="p-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{report.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        report.status === 'open' ? 'bg-red-100 text-red-800' : 
                        report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{report.location} - {report.date}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium flex justify-center items-center">
                <Edit size={16} className="mr-1" /> Edit
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-md font-medium flex justify-center items-center">
                <Trash2 size={16} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };

  const AdministratorsList = () => (
    <>
      <Header title="Administrators" showBack={true} />
      <div className="p-4 pb-20 overflow-y-auto h-full">
        <div className="mb-4 flex justify-between items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search administrators..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="ml-2 bg-blue-600 text-white p-2 rounded-md">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="space-y-3">
          {mockAdmins.map(admin => (
            <div key={admin.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center mb-2">
                <img src={admin.image} className="w-10 h-10 rounded-full mr-3" alt={admin.name} />
                <div>
                  <h3 className="font-medium">{admin.name}</h3>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Phone size={14} className="mr-1 text-gray-500" /> 
                  {admin.phone}
                </span>
                <span className="flex items-center text-blue-600">
                  <Building size={14} className="mr-1" /> 
                  {admin.buildings} buildings
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <button className="text-sm text-blue-600 flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
                <button className="text-sm text-red-600 flex items-center">
                  <Trash2 size={14} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
      {menuOpen && <SideMenu />}
    </>
  );

  const ResidentsList = () => (
    <>
      <Header title="Residents" showBack={true} />
      <div className="p-4 pb-20 overflow-y-auto h-full">
        <div className="mb-4 flex justify-between items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search residents..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="ml-2 bg-blue-600 text-white p-2 rounded-md">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="space-y-3">
          {mockResidents.map(resident => (
            <div 
              key={resident.id} 
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
              onClick={() => viewResidentDetails(resident)}
            >
              <div className="flex items-center mb-2">
                <img src={resident.image} className="w-10 h-10 rounded-full mr-3" alt={resident.name} />
                <div>
                  <h3 className="font-medium">{resident.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                      Unit {resident.unit}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                      {resident.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Phone size={14} className="mr-1 text-gray-500" /> 
                  {resident.phone}
                </span>
                <span className="flex items-center">
                  <Mail size={14} className="mr-1 text-gray-500" /> 
                  {resident.email.substring(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between mt-3">
                <button className="text-sm text-blue-600 flex items-center">
                  <MessageSquare size={14} className="mr-1" /> Message
                </button>
                <button className="text-sm text-gray-600 flex items-center">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
      {menuOpen && <SideMenu />}
    </>
  );

  const ResidentDetails = () => {
    if (!selectedResident) return null;
    
    return (
      <>
        <Header title="Resident Details" showBack={true} />
        <div className="overflow-y-auto h-full pb-20">
          <div className="bg-blue-600 p-6 flex flex-col items-center">
            <img src={selectedResident.image} className="w-20 h-20 rounded-full border-2 border-white" alt={selectedResident.name} />
            <h1 className="text-xl font-bold text-white mt-2">{selectedResident.name}</h1>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-white text-blue-800 px-2 py-0.5 rounded-full font-medium">
                Unit {selectedResident.unit}
              </span>
              <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded-full ml-2 font-medium">
                {selectedResident.status}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold">Contact Information</h2>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex items-center p-4">
                  <Phone size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p>{selectedResident.phone}</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <Mail size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p>{selectedResident.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <Home size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Unit</p>
                    <p>Apartment {selectedResident.unit}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-2">Payment Status</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-200">
                  {mockPayments.slice(0, 2).map(payment => (
                    <div key={payment.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-xs text-gray-500">Due: {payment.dueDate}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">€{payment.amount}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button className="text-blue-600 text-sm font-medium">View All Payments</button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-2">Recent Issues</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {mockReports.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {mockReports.slice(0, 1).map(report => (
                      <div key={report.id} className="p-3">
                        <div className="flex justify-between">
                          <p className="font-medium">{report.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === 'open' ? 'bg-red-100 text-red-800' : 
                            report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{report.location} - {report.date}</p>
                      </div>
                    ))}
                    <div className="p-3 bg-gray-50 text-center">
                      <button className="text-blue-600 text-sm font-medium">View All Issues</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>No recent issues reported</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium flex justify-center items-center">
                <MessageSquare size={16} className="mr-1" /> Message
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 rounded-md font-medium flex justify-center items-center">
                <Edit size={16} className="mr-1" /> Edit
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };

  const PaymentsList = () => (
    <>
      <Header title="Payments" showBack={true} />
      <div className="p-4 pb-20 overflow-y-auto h-full">
        <div className="mb-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-3 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Outstanding</p>
                <p className="text-xl font-bold">€4,680.00</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium self-center">
                Process Payment
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <h2 className="text-md font-semibold">Payment Status</h2>
            <div className="flex text-sm">
              <button className="px-2 py-1 bg-white border border-blue-600 text-blue-600 rounded-l-md">All</button>
              <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-r-md">History</button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {mockPayments.map(payment => (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{payment.resident}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{payment.description}</p>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                <p className="text-lg font-semibold">€{payment.amount}</p>
              </div>
              <div className="flex justify-between mt-3">
                {payment.status === 'pending' && (
                  <button className="w-full bg-blue-600 text-white py-1.5 rounded-md text-sm font-medium">
                    Record Payment
                  </button>
                )}
                {payment.status === 'paid' && (
                  <button className="w-full bg-green-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center">
                    <FileText size={16} className="mr-1" /> Receipt
                  </button>
                )}
                {payment.status === 'overdue' && (
                  <button className="w-full bg-red-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center">
                    <Bell size={16} className="mr-1" /> Send Reminder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
      {menuOpen && <SideMenu />}
    </>
  );

  const ReportsList = () => (
    <>
      <Header title="Maintenance Reports" showBack={true} />
      <div className="p-4 pb-20 overflow-y-auto h-full">
        <div className="mb-4 flex">
          <button className="flex-1 px-2 py-1 bg-blue-600 text-white text-sm font-medium rounded-l-md">All</button>
          <button className="flex-1 px-2 py-1 bg-red-100 text-red-800 text-sm font-medium">Open</button>
          <button className="flex-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium">In Progress</button>
          <button className="flex-1 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-r-md">Resolved</button>
        </div>
        
        <div className="space-y-3">
          {mockReports.map(report => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{report.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'open' ? 'bg-red-100 text-red-800' : 
                  report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{report.location}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Reported by: {report.submitter}</span>
                <span>{report.date}</span>
              </div>
              <div className="mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                  report.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {report.priority} priority
                </span>
              </div>
              <div className="flex space-x-2">
                {report.status !== 'resolved' ? (
                  <>
                    <button className="flex-1 bg-blue-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center">
                      <Edit size={14} className="mr-1" /> Update
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center">
                      <CheckCircle size={14} className="mr-1" /> Resolve
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-gray-600 text-white py-1.5 rounded-md text-sm font-medium flex justify-center items-center">
                    <Clock size={14} className="mr-1" /> Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
      {menuOpen && <SideMenu />}
    </>
  );

  // Notifications Screen Component
  const NotificationsScreen = () => {
    const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    };
    
    return (
      <>
        <Header 
          title="Notifications" 
          showBack={true} 
          action={{ 
            icon: <CheckSquare size={20} />, 
            onClick: markAllAsRead 
          }} 
        />
        <div className={`p-4 pb-20 overflow-y-auto h-full ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <div className="mb-4 flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Notifications</h2>
            <button 
              className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map(notification => {
                // Dynamically determine the icon component
                let IconComponent;
                switch (notification.icon) {
                  case 'Wrench': IconComponent = Wrench; break;
                  case 'DollarSign': IconComponent = DollarSign; break;
                  case 'CheckCircle': IconComponent = CheckCircle; break;
                  case 'UserCheck': IconComponent = UserCheck; break;
                  case 'AlertTriangle': IconComponent = AlertTriangle; break;
                  default: IconComponent = Bell;
                }
                
                return (
                  <div 
                    key={notification.id} 
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3 ${notification.read ? 'opacity-75' : ''}`}
                  >
                    <div className="flex">
                      <div className={`mr-3 mt-0.5 p-2 rounded-full ${
                        notification.read 
                          ? darkMode ? 'bg-gray-700' : 'bg-gray-100' 
                          : darkMode ? 'bg-blue-900' : 'bg-blue-100'
                      }`}>
                        <IconComponent size={16} className={notification.read 
                          ? darkMode ? 'text-gray-400' : 'text-gray-500' 
                          : darkMode ? 'text-blue-300' : 'text-blue-600'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} ${notification.read ? darkMode ? 'text-gray-400' : 'text-gray-600' : ''}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ${notification.read ? darkMode ? 'text-gray-500' : 'text-gray-500' : ''}`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p>No notifications to display</p>
            </div>
          )}
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };
  
  // Admin Details Screen
  const AdministratorDetails = () => {
    if (!selectedAdministrator) return null;
    
    return (
      <>
        <Header title="Administrator Details" showBack={true} />
        <div className={`overflow-y-auto h-full pb-20 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <div className={`p-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} flex flex-col items-center`}>
            <img src={selectedAdministrator.image} className="w-20 h-20 rounded-full border-2 border-white" alt={selectedAdministrator.name} />
            <h1 className="text-xl font-bold text-white mt-2">{selectedAdministrator.name}</h1>
            <p className="text-sm text-blue-100">{selectedAdministrator.role}</p>
            <div className="flex mt-3 space-x-3">
              <button className="bg-white bg-opacity-20 text-white rounded-full p-2">
                <Phone size={18} />
              </button>
              <button className="bg-white bg-opacity-20 text-white rounded-full p-2">
                <Mail size={18} />
              </button>
              <button className="bg-white bg-opacity-20 text-white rounded-full p-2">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm mb-6`}>
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className="font-semibold">Contact Information</h2>
              </div>
              <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <div className="flex items-center p-4">
                  <Phone size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`} />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                    <p>{selectedAdministrator.phone}</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <Mail size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`} />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                    <p>{selectedAdministrator.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <Calendar size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`} />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hire Date</p>
                    <p>{selectedAdministrator.hireDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Performance Metrics</h2>
              <div className={`grid grid-cols-2 gap-3`}>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overall Rating</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xl font-bold ${
                      selectedAdministrator.performance > 90 
                        ? 'text-green-500' 
                        : selectedAdministrator.performance > 80 
                        ? 'text-blue-500' 
                        : 'text-yellow-500'
                    }`}>
                      {selectedAdministrator.performance}%
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tenant Satisfaction</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {selectedAdministrator.tenantSatisfaction}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/5</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resolution Time</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                    {selectedAdministrator.issueResolutionTime}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Buildings Managed</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                    {selectedAdministrator.buildings}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Assigned Buildings</h2>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm`}>
                <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {selectedAdministrator.buildingsList.map((building, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        <Building size={16} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                        <p>{building}</p>
                      </div>
                      <ChevronRight size={18} className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className={`flex-1 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white py-2.5 rounded-lg font-medium flex justify-center items-center`}>
                <Edit size={16} className="mr-2" /> Edit
              </button>
              <button className={`flex-1 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} py-2.5 rounded-lg font-medium flex justify-center items-center`}>
                <Trash2 size={16} className="mr-2" /> Remove
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };
  
  // Report Details Screen
  const ReportDetails = () => {
    if (!selectedReport) return null;
    
    return (
      <>
        <Header title="Report Details" showBack={true} />
        <div className={`overflow-y-auto h-full pb-20 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <div className={`p-4 ${
            selectedReport.status === 'open' 
              ? darkMode ? 'bg-red-900' : 'bg-red-100' 
              : selectedReport.status === 'in-progress' 
                ? darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                : darkMode ? 'bg-green-900' : 'bg-green-100'
          }`}>
            <div className="flex justify-between items-start">
              <h1 className={`text-xl font-bold ${
                selectedReport.status === 'open' 
                  ? darkMode ? 'text-red-100' : 'text-red-800' 
                  : selectedReport.status === 'in-progress' 
                    ? darkMode ? 'text-yellow-100' : 'text-yellow-800'
                    : darkMode ? 'text-green-100' : 'text-green-800'
              }`}>
                {selectedReport.title}
              </h1>
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                selectedReport.status === 'open' 
                  ? 'bg-red-800 text-white' 
                  : selectedReport.status === 'in-progress' 
                    ? 'bg-yellow-800 text-white'
                    : 'bg-green-800 text-white'
              }`}>
                {selectedReport.status}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              selectedReport.status === 'open' 
                ? darkMode ? 'text-red-200' : 'text-red-700' 
                : selectedReport.status === 'in-progress' 
                  ? darkMode ? 'text-yellow-200' : 'text-yellow-700'
                  : darkMode ? 'text-green-200' : 'text-green-700'
            }`}>
              {selectedReport.location}
            </p>
            <div className="mt-2 flex justify-between">
              <p className={`text-xs ${
                selectedReport.status === 'open' 
                  ? darkMode ? 'text-red-200' : 'text-red-700' 
                  : selectedReport.status === 'in-progress' 
                    ? darkMode ? 'text-yellow-200' : 'text-yellow-700'
                    : darkMode ? 'text-green-200' : 'text-green-700'
              }`}>
                Reported by: {selectedReport.submitter}
              </p>
              <p className={`text-xs ${
                selectedReport.status === 'open' 
                  ? darkMode ? 'text-red-200' : 'text-red-700' 
                  : selectedReport.status === 'in-progress' 
                    ? darkMode ? 'text-yellow-200' : 'text-yellow-700'
                    : darkMode ? 'text-green-200' : 'text-green-700'
              }`}>
                {selectedReport.date}
              </p>
            </div>
          </div>
          
          <div className="p-4">
            <div className={`mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm`}>
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className="font-semibold">Issue Details</h2>
              </div>
              <div className="p-4">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedReport.description}
                </p>
                
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div className="mt-4">
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Attached Images
                    </p>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {selectedReport.images.map((image, index) => (
                        <img 
                          key={index} 
                          src={image} 
                          alt={`Issue image ${index + 1}`} 
                          className="w-24 h-24 rounded-lg object-cover" 
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
                    <p className={`font-medium ${
                      selectedReport.priority === 'urgent' 
                        ? 'text-red-600' 
                        : selectedReport.priority === 'high' 
                          ? 'text-orange-600'
                          : 'text-blue-600'
                    }`}>
                      {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assigned To</p>
                    <p className="font-medium">{selectedReport.assignedTo}</p>
                  </div>
                  {selectedReport.estimatedCost && (
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Est. Cost</p>
                      <p className="font-medium">{selectedReport.estimatedCost}</p>
                    </div>
                  )}
                  {selectedReport.serviceAppointment && (
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Service Appointment</p>
                      <p className="font-medium">{selectedReport.serviceAppointment}</p>
                    </div>
                  )}
                  {selectedReport.actualCost && (
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actual Cost</p>
                      <p className="font-medium">{selectedReport.actualCost}</p>
                    </div>
                  )}
                  {selectedReport.resolvedDate && (
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resolved Date</p>
                      <p className="font-medium">{selectedReport.resolvedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Communication</h2>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm`}>
                {selectedReport.comments && selectedReport.comments.length > 0 ? (
                  <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {selectedReport.comments.map((comment, index) => (
                      <div key={index} className="p-3">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{comment.author}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{comment.timestamp}</p>
                        </div>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No comments yet</p>
                  </div>
                )}
                
                <div className={`p-3 ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t`}>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      className={`flex-1 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500`} 
                    />
                    <button className={`${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white px-4 rounded-r-lg`}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {selectedReport.status !== 'resolved' ? (
                <>
                  <button className={`flex-1 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white py-2.5 rounded-lg font-medium flex justify-center items-center`}>
                    <Edit size={16} className="mr-2" /> Update Status
                  </button>
                  <button className={`flex-1 ${darkMode ? 'bg-green-700' : 'bg-green-600'} text-white py-2.5 rounded-lg font-medium flex justify-center items-center`}>
                    <CheckCircle size={16} className="mr-2" /> Mark as Resolved
                  </button>
                </>
              ) : (
                <button className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-600'} text-white py-2.5 rounded-lg font-medium flex justify-center items-center`}>
                  <Clock size={16} className="mr-2" /> Reopen Issue
                </button>
              )}
            </div>
          </div>
        </div>
        <BottomNav />
        {menuOpen && <SideMenu />}
      </>
    );
  };
  
  // Main render function to determine which screen to show
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'bmDashboard':
        return <BusinessManagerDashboard />;
      case 'pmDashboard':
        return <PropertyManagerDashboard />;
      case 'buildings':
        return <BuildingsList />;
      case 'buildingDetails':
        return <BuildingDetails />;
      case 'administrators':
        return <AdministratorsList />;
      case 'administratorDetails':
        return <AdministratorDetails />;
      case 'residents':
        return <ResidentsList />;
      case 'residentDetails':
        return <ResidentDetails />;
      case 'payments':
        return <PaymentsList />;
      case 'reports':
        return <ReportsList />;
      case 'reportDetails':
        return <ReportDetails />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'messages':
        return <div className="p-4">Messages Screen Coming Soon</div>;
      case 'info':
        return <div className="p-4">InfoPoints Screen Coming Soon</div>;
      case 'polls':
        return <div className="p-4">Polls Screen Coming Soon</div>;
      case 'organigram':
        return <div className="p-4">Organigram Screen Coming Soon</div>;
      case 'analytics':
        return <div className="p-4">Analytics Screen Coming Soon</div>;
      case 'settings':
        return <div className="p-4">Settings Screen Coming Soon</div>;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <MobileFrame>
      {renderScreen()}
    </MobileFrame>
  );
};

export default KomunitetiApp;
