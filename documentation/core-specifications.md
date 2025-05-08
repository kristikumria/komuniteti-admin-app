# Komuniteti Mobile Application
# Core Specifications

## 1. Architecture Overview

### 1.1 Frontend Architecture
- **UI Framework:** React Native
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation
- **Styling:** Styled Components
- **Form Handling:** Formik with Yup validation
- **Offline Support:** Redux Persist for data caching

### 1.2 Backend Integration
- **API Communication:** RESTful API with JWT authentication
- **Real-time Features:** WebSocket connection for chat and notifications
- **File Handling:** Multi-part form data for file uploads
- **Data Synchronization:** Background sync for offline changes

### 1.3 Security Implementation
- **Authentication:** JWT tokens with refresh mechanism
- **Biometrics:** Integration with device biometric APIs
- **Data Encryption:** AES-256 for local data storage
- **Input Validation:** Server and client side validation

## 2. Core Data Models

### 2.1 User Model
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "BUSINESS_MANAGER | ADMINISTRATOR",
  "phone": "string",
  "profileImage": "string",
  "lastActive": "datetime"
}
```

### 2.2 Building Model
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "address": "string",
  "floorArea": "number",
  "residentCount": "number",
  "country": "string",
  "city": "string",
  "typology": "RESIDENTIAL | COMMERCIAL | MIXED",
  "coordinates": {
    "latitude": "number",
    "longitude": "number"
  },
  "administrators": ["User"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 2.3 Resident Model
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "buildingId": "string",
  "apartmentId": "string",
  "status": "OWNER | TENANT",
  "joinDate": "datetime",
  "balance": "number",
  "lastActive": "datetime"
}
```

### 2.4 Payment Model
```json
{
  "id": "string",
  "residentId": "string",
  "amount": "number",
  "status": "PENDING | PAID | OVERDUE | CANCELLED",
  "dueDate": "datetime",
  "paidDate": "datetime",
  "method": "CASH | BANK_TRANSFER | CARD | OTHER",
  "description": "string",
  "invoiceNumber": "string",
  "createdAt": "datetime"
}
```

### 2.5 Report Model
```json
{
  "id": "string",
  "buildingId": "string",
  "residentId": "string",
  "title": "string",
  "description": "string",
  "category": "MAINTENANCE | INCIDENT | SUGGESTION",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "status": "OPEN | IN_PROGRESS | RESOLVED | CANCELLED",
  "assignedTo": "string",
  "images": ["string"],
  "location": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "resolvedAt": "datetime",
  "comments": ["ReportComment"]
}
```

## 3. Key API Endpoints

### 3.1 Authentication Endpoints
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- POST /api/auth/forgot-password

### 3.2 Business Manager Endpoints
- GET /api/business/dashboard
- GET /api/business/buildings
- GET/POST/PUT/DELETE /api/business/buildings/{id}
- GET /api/business/administrators
- GET/POST/PUT/DELETE /api/business/administrators/{id}
- GET /api/business/services
- GET/POST/PUT/DELETE /api/business/services/{id}
- GET /api/business/reports
- POST /api/business/reports/generate

### 3.3 Administrator Endpoints
- GET /api/properties
- GET/PUT /api/properties/{id}
- GET /api/properties/{id}/residents
- GET/POST/PUT/DELETE /api/properties/{id}/residents/{residentId}
- GET /api/properties/{id}/payments
- POST /api/properties/{id}/payments/process
- GET /api/properties/{id}/reports
- PUT /api/properties/{id}/reports/{reportId}
- GET/POST/PUT/DELETE /api/properties/{id}/notifications
- GET/POST /api/properties/{id}/chat
- GET/POST/PUT/DELETE /api/properties/{id}/infopoints
- GET/POST/PUT/DELETE /api/properties/{id}/polls

### 3.4 Real-time Endpoints
- WebSocket /ws/chat
- WebSocket /ws/notifications

## 4. Performance Requirements

### 4.1 Loading Times
- Dashboard load time: < 2 seconds
- Property list load time: < 1 second
- Chat message send/receive: < 1 second

### 4.2 Offline Capabilities
- Critical data cached for offline access
- Background synchronization when connectivity restored
- Unsent data backed up locally

### 4.3 Resource Usage
- RAM usage: < 100MB in normal operation
- Optimized image handling for bandwidth conservation
- Prioritized data loading based on view area

## 5. Device Compatibility

### 5.1 Supported Platforms
- iOS 14 and above
- Android 7.0 and above

### 5.2 Form Factors
- Smartphones (4.7" to 6.7" screens)
- Tablets (7" and larger screens)
- Both portrait and landscape orientations

### 5.3 Accessibility
- WCAG 2.1 AA compliance
- Support for system font size settings
- Dark mode support (lower priority)

## 6. Security Requirements

### 6.1 Data Protection
- Encryption of sensitive stored data (AES-256)
- Secure HTTPS communication
- No local password storage
- Clearing of sensitive data on logout

### 6.2 Authentication
- Token-based authentication
- Biometric authentication option
- Session timeout after 30 minutes inactivity
- Proper input sanitization

## 7. Core Features Priority

### 7.1 Phase 1 (Highest Priority)
- Authentication system
- Dashboard views
- Building and administrator management
- Resident management
- Basic reporting

### 7.2 Phase 2
- Payment processing
- Chat functionality
- Notifications
- InfoPoints

### 7.3 Phase 3
- Polls and surveys
- Maintenance reporting
- Advanced reporting
- Organigram visualization

## 8. UI/UX Guidelines

### 8.1 Navigation Structure
- Bottom tab bar for primary navigation
- Nested navigation for detailed sections
- Standard gestures (swipe, pull, pinch)

### 8.2 Responsive Design
- Mobile-optimized layouts
- Tablet-specific two-column layouts
- Dynamic adjustments based on orientation

### 8.3 Visual Elements
- Card-based UI with clear hierarchy
- Skeleton screens for loading states
- Haptic feedback for actions
- Subtle animations for transitions 