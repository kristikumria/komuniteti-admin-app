# Komuniteti.al Core Modules

# Role Hierarchy

Komuniteti.al implements a hierarchical role-based access control system:

```
Business Manager
    │
    ├── Business account 1
    │   │
    │   ├── Building 1 ──► Administrator A
    │   │   │
    │   │   ├── Residential Unit
    │   │   │   │
    │   │   │   └── Residents
    │   │   │
    │   │   └── Business Unit
    │   │       │
    │   │       └── Business Manager
    │   │
    │   ├── Building 2 ──► Administrator B
    │   │   │
    │   │   ├── Residential Unit
    │   │   │   │
    │   │   │   └── Residents
    │   │   │
    │   │   └── Business Unit
    │   │       │
    │   │       └── Business Manager
    │   │
    │   └── Building 3 ──► Administrator C
    │       │
    │       ├── Residential Unit
    │       │   │
    │       │   └── Residents
    │       │
    │       └── Business Unit
    │           │
    │           └── Business Manager
    │
    Switch
    ├── Business account 2
    │   │
    │   ├── Building 1 ──► Administrator A
    │   │   │
    │   │   ├── Residential Unit
    │   │   │   │
    │   │   │   └── Residents
    │   │   │
    │   │   └── Business Unit
    │   │       │
    │   │       └── Business Manager
    │   │
    │   ├── Building 2 ──► Administrator B
    │   │   │
    │   │   ├── Residential Unit
    │   │   │   │
    │   │   │   └── Residents
    │   │   │
    │   │   └── Business Unit
    │   │       │
    │   │       └── Business Manager
    │   │
    │   └── Building 3 ──► Administrator C
    │       │
    │       ├── Residential Unit
    │       │   │
    │       │   └── Residents
    │       │
    │       └── Business Unit
    │           │
    │           └── Business Manager
    │
    └── Can switch between business accounts
```

- **Business Manager** is the top-level role with complete access to all platform features and data. Business managers can manage all buildings, assign administrators, and switch between different business accounts.

- **Administrator** is a subordinate role with limited access to only the buildings they've been assigned to by a business manager. Administrators can manage building units, residents, payments, and other building-specific operations, and can switch between different building accounts.

The relationship between these roles is established through assignment, where business managers explicitly delegate building management responsibilities to administrators through the platform.

## Business Manager

Business managers oversee company operations on the Komuniteti.al platform. They have access to all features and can:

- Monitor all managed buildings in real-time
- View performance dashboards and analytics
- Manage properties, administrators, and residents
- Access insights, reports, and billing information
- Communicate with administrators and residents
- Create polls and surveys
- Establish organizational structure
- Switch between business accounts

### Core Modules

#### Dashboard
- Portfolio health overview displaying:
  - Buildings and units under management
  - Assigned administrators
  - Active services
  - Total residents
  - Maintenance metrics
  - Additional key performance indicators

#### Buildings
- Comprehensive building management
- Create, view, update, and delete buildings, residential units, and business units
- Categorize buildings by type and size
- Add and manage residential units and residents
- Add and manage business units 
- Assign administrators to buildings
- Edit building and units details (title, description, address, floor area, resident count, location, typology)
- Delete existing buildings

#### Administrators
- List, create, edit, and remove building administrators

#### Services
- Create, view, edit, and delete company service offerings

#### Reports
- Generate and export company-wide financial, operational, and resident-engagement reports

#### Resident Management
- Add, list, edit, and remove residents

#### Payments
- Display outstanding invoices
- Process resident payments

#### Maintenance Reports
- View maintenance and incident reports submitted by residents

#### Notifications
- Create, list, edit, and delete in-app/push notifications

#### Chat
- Real-time messaging between administrators and residents

#### InfoPoints
- Publish building guidelines, FAQs, and reference content

#### Polls & Surveys
- Create, list, edit, and delete resident polls

#### Organigram
- Visualize organizational structure (company, administrators, service staff, residents)

#### Account Settings
- Manage personal profile information
- Update login credentials and security settings
- Manage business account details
- Access account activity logs
- Configure two-factor authentication

## Administrator

Administrators manage specific buildings assigned by business managers. They can:

- Access features and data only for assigned buildings
- Add and manage residents
- Process resident payments
- Manage building units and businesses
- Handle reports and issues from residents
- Communicate with residents
- Create polls and surveys
- Switch between different building accounts

```
Administrator
    │
    ├── Building 1
    │   │
    │   ├── Residential Unit
    │   │   │
    │   │   └── Residents
    │   │
    │   └── Business Unit
    │       │
    │       └── Business Manager
    │
    ├── Building 2
    │   │
    │   ├── Residential Unit
    │   │   │
    │   │   └── Residents
    │   │
    │   └── Business Unit
    │       │
    │       └── Business Manager
    │
    ├── Building 3
    │   │
    │   ├── Residential Unit
    │   │   │
    │   │   └── Residents
    │   │
    │   └── Business Unit
    │       │
    │       └── Business Manager
    │
    └── Can switch between buildings
```

### Core Modules

#### Building Units Management
- Create, view, update, and delete building units: residential units, and business units
- Categorize buildings by type and size
- Add and manage residential units and residents
- Add and manage business units 

#### Resident Management
- Add, list, edit, and remove residents

#### Payments
- Display outstanding invoices
- Process resident payments

#### Reports
- View maintenance and incident reports submitted by residents

#### Notifications
- Create, list, edit, and delete in-app/push notifications

#### Chat
- Real-time messaging between administrators and residents

#### InfoPoints
- Publish building guidelines, FAQs, and reference content

#### Polls & Surveys
- Create, list, edit, and delete resident polls

#### Organigram
- Visualize organizational structure (company, administrators, service staff, residents)

#### Account Settings
- Manage personal profile information
- Update login credentials and security settings
- Access account activity logs
- Configure two-factor authentication