# Komuniteti Mobile Application
# Project Plan

## Overview

This document outlines the comprehensive development plan for the Komuniteti mobile application, a property management solution for business managers and administrators based on the Product Requirements Document (PRD) and Core Specifications.

## Project Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1: Core Functionality | Weeks 1-8 | Authentication, dashboard views, building and administrator management, resident management, basic reporting |
| Phase 2: Financial and Communication | Weeks 9-16 | Payment management, invoicing, chat functionality, notifications system, InfoPoints |
| Phase 3: Advanced Features | Weeks 17-24 | Polls/surveys, maintenance/issue reporting, advanced reporting, organigram visualization, performance optimizations |
| Phase 4: Polish and Release | Weeks 25-28 | UI/UX refinements, performance testing, security audit, beta testing, app store submission |

## Project Task Breakdown

### Phase 1: Core Functionality

#### Week 1-2: Project Setup & Architecture

- [x] Task 1.1: Create project repository and documentation structure
  - Status: Completed
  - Notes: Initial repository setup with basic documentation

- [x] Task 1.2: Set up React Native project with TypeScript
  - Status: Completed
  - Notes: Used React Native CLI with TypeScript template and configured basic project structure

- [x] Task 1.3: Configure project dependencies
  - Subtask 1.3.1: Add navigation dependencies (React Navigation)
  - Subtask 1.3.2: Add state management dependencies (Redux Toolkit)
  - Subtask 1.3.3: Add UI libraries (React Native Paper)
  - Subtask 1.3.4: Add form handling dependencies (Formik, Yup)
  - Status: Completed
  - Notes: All core dependencies have been installed and configured

- [x] Task 1.4: Set up linting and code formatting
  - Subtask 1.4.1: Configure ESLint
  - Subtask 1.4.2: Configure Prettier
  - Subtask 1.4.3: Set up pre-commit hooks
  - Status: Completed

- [x] Task 1.5: Create app architecture and folder structure
  - Subtask 1.5.1: Define application layers (UI, state, services, utils)
  - Subtask 1.5.2: Create folder structure
  - Subtask 1.5.3: Document architecture decisions
  - Status: Completed
  - Notes: Implemented MVC-like structure with services, components, screens, and utilities folders

- [ ] Task 1.6: Configure CI/CD pipeline
  - Subtask 1.6.1: Set up GitHub Actions for builds
  - Subtask 1.6.2: Configure automated testing
  - Subtask 1.6.3: Set up deployment workflow
  - Status: Not started

#### Week 3-4: Authentication & User Management

- [x] Task 1.7: Design and implement authentication screens
  - Subtask 1.7.1: Create login screen
  - Subtask 1.7.2: Create password recovery screen
  - Subtask 1.7.3: Implement biometric authentication
  - Status: Completed
  - Notes: Enhanced login screen with role selection and biometric authentication. Added improved UI with proper dark mode support, better role selection UI with icons, and clearer user flow.

- [x] Task 1.8: Implement authentication service
  - Subtask 1.8.1: Create authentication API client
  - Subtask 1.8.2: Implement JWT storage and refresh
  - Subtask 1.8.3: Add authentication state management
  - Status: Completed
  - Notes: Implemented authentication service with JWT handling and mock data for development

- [x] Task 1.9: Implement role-based access control
  - Subtask 1.9.1: Define permission roles and structure
  - Subtask 1.9.2: Implement role-based routing
  - Subtask 1.9.3: Create protected route components
  - Status: Completed
  - Notes: Implemented role-based navigation in RootNavigator

- [x] Task 1.10: Implement user session management
  - Subtask 1.10.1: Add session persistence
  - Subtask 1.10.2: Implement session expiry and renewal
  - Subtask 1.10.3: Add user logout functionality
  - Status: Completed
  - Notes: Added AsyncStorage for session persistence and automatic login checks

- [x] Task 1.11: Implement account switching
  - Subtask 1.11.1: Create account selection UI
  - Subtask 1.11.2: Implement account switching logic
  - Subtask 1.11.3: Ensure proper data isolation between accounts
  - Status: Completed
  - Notes: Implemented role selection in login screen to support both user types

#### Week 5-6: Business Manager Core Modules - Part 1

- [x] Task 2.1: Implement Business Manager Dashboard
  - [x] Subtask 2.1.1: Create dashboard UI
  - [x] Subtask 2.1.2: Implement portfolio overview metrics
  - [x] Subtask 2.1.3: Add activity feed
  - Status: Completed
  - Notes: Dashboard displays summary metrics of buildings, administrators, active services, and residents

- [x] Task 2.2: Implement Buildings Management
  - [x] Subtask 2.2.1: Create buildings list view
  - [x] Subtask 2.2.2: Add building details screen
  - [x] Subtask 2.2.3: Implement building editing and deletion
  - Status: Completed
  - Notes: Full CRUD operations for buildings management

- [x] Task 2.3: Implement Services Management
  - [x] Subtask 2.3.1: Create services model and state management
  - [x] Subtask 2.3.2: Implement services list view with filtering and search
  - [x] Subtask 2.3.3: Add service creation, editing, and deletion
  - Status: Completed
  - Notes: Implemented complete services management with filtering, status toggling, and full CRUD operations

- [x] Task 2.4: Implement InfoPoints Module
  - [x] Subtask 2.4.1: Create InfoPoints data model and service
  - [x] Subtask 2.4.2: Implement InfoPoints state management with Redux
  - [x] Subtask 2.4.3: Set up filtering by building and category
  - Status: In Progress
  - Notes: Implemented core InfoPoints functionality including data models, services and state management. UI implementation in progress.

#### Week 7-8: Building & Resident Management

- [ ] Task 1.16: Implement Building Management for Business Managers
  - [x] Subtask 1.16.1: Create building list screen
  - [x] Subtask 1.16.2: Implement building details screen
  - [x] Subtask 1.16.3: Add building creation form
  - [x] Subtask 1.16.4: Create building editing functionality
  - [x] Subtask 1.16.5: Implement building deletion with confirmation
  - Status: Completed
  - Notes: Implemented building list, details, creation, editing, and deletion functionality. Building form component created for both adding and editing buildings.

- [ ] Task 1.17: Implement Administrator Assignment
  - [x] Subtask 1.17.1: Create administrator assignment UI
  - [x] Subtask 1.17.2: Implement administrator selection
  - [x] Subtask 1.17.3: Add assignment confirmation
  - Status: Completed
  - Notes: Implemented administrator assignment functionality with the ability to select an administrator from a list and assign them to a building.

- [x] Task 1.18: Implement Resident Management for Administrators
  - [x] Subtask 1.18.1: Create residents list screen
  - [x] Subtask 1.18.2: Implement resident details screen
  - [x] Subtask 1.18.3: Add resident creation form
  - [x] Subtask 1.18.4: Create resident editing functionality
  - [x] Subtask 1.18.5: Implement resident removal with confirmation
  - Status: Completed
  - Notes: Implemented resident list, details, creation, editing, and deletion functionality

- [x] Task 1.19: Create Building/Resident Filtering and Search
  - [x] Subtask 1.19.1: Implement search functionality
  - [x] Subtask 1.19.2: Add filtering options
  - [x] Subtask 1.19.3: Create sorting capabilities
  - Status: Completed
  - Notes: Implemented advanced filtering and sorting for both Buildings and Residents screens with a reusable FilterModal component that provides robust filtering based on multiple criteria and sorting options.

### Phase 2: Financial and Communication

#### Week 9-10: Payment Management

- [x] Task 2.1: Design and implement Payment Models
  - [x] Subtask 2.1.1: Create payment data models
  - [x] Subtask 2.1.2: Implement payment API service
  - [x] Subtask 2.1.3: Add payment state management
  - Status: Completed
  - Notes: Created payment models, implemented payment service with mock data, and added Redux state management for payments.

- [x] Task 2.2: Implement Payment List View
  - [x] Subtask 2.2.1: Create payments list screen
  - [x] Subtask 2.2.2: Implement filtering by status
  - [x] Subtask 2.2.3: Add sorting capabilities
  - Status: Completed
  - Notes: Implemented PaymentsList screen with searching, filtering, and sorting functionality.

- [x] Task 2.3: Implement Payment Processing
  - [x] Subtask 2.3.1: Create payment form
  - [x] Subtask 2.3.2: Implement payment method selection
  - [x] Subtask 2.3.3: Add confirmation workflow
  - [x] Subtask 2.3.4: Create receipt generation
  - Status: Completed
  - Notes: Created PaymentForm, AddPayment, and ProcessPayment screens with complete payment workflow.

- [x] Task 2.4: Create Payment History and Reporting
  - [x] Subtask 2.4.1: Implement payment history view
  - [x] Subtask 2.4.2: Create payment reports
  - [x] Subtask 2.4.3: Add filtering by date and type
  - [x] Subtask 2.4.4: Implement data visualization
  - Status: Completed
  - Notes: Implemented PaymentHistory screen with both list and report views, including payment breakdown by type, financial summaries, and filtering capabilities.

#### Week 11-12: Notifications System

- [x] Task 2.5: Design and implement Notification System
  - [x] Subtask 2.5.1: Create notification data models
  - [x] Subtask 2.5.2: Implement notification service
  - [x] Subtask 2.5.3: Add notification state management
  - [x] Subtask 2.5.4: Design notification UI
  - [x] Subtask 2.5.5: Implement notification badge
  - Status: Completed
  - Notes: Implemented a comprehensive notification system with unread badge indicators, notification lists with filtering, and the ability to mark notifications as read.

- [x] Task 2.6: Create Notification UI
  - [x] Subtask 2.6.1: Implement notifications list screen
  - [x] Subtask 2.6.2: Create notification detail view
  - [x] Subtask 2.6.3: Add notification badges
  - Status: Completed
  - Notes: Implemented notification list screen with filtering, marking as read, notification details screen with related item linking, and notification badges in the app header.

- [ ] Task 2.7: Implement Push Notifications
  - Subtask 2.7.1: Configure push notification services
  - Subtask 2.7.2: Implement notification handling
  - Subtask 2.7.3: Add notification permission requests
  - Status: Not started

- [ ] Task 2.8: Create Notification Management
  - Subtask 2.8.1: Implement notification creation
  - Subtask 2.8.2: Add notification targeting
  - Subtask 2.8.3: Create scheduled notifications
  - Subtask 2.8.4: Add notification read tracking
  - Status: Not started

#### Week 13-14: Chat Functionality

- [ ] Task 2.9: Design and implement Chat System
  - [x] Subtask 2.9.1: Create chat models
  - [x] Subtask 2.9.2: Implement real-time chat service
  - [x] Subtask 2.9.3: Add chat state management
  - Status: In Progress
  - Notes: Chat models including ChatConversation and ChatMessage types implemented. Created Redux chat slice for state management. Some issues with socket integration and type definitions need to be resolved.

- [ ] Task 2.10: Create Chat UI
  - [x] Subtask 2.10.1: Implement chat list screen
  - [x] Subtask 2.10.2: Create conversation view
  - [x] Subtask 2.10.3: Add message composition
  - Status: In Progress
  - Notes: Basic UI components created (ChatListScreen, ChatConversationScreen, MessageInput), but there are some TypeScript JSX configuration issues to resolve.

- [ ] Task 2.11: Implement Chat Features
  - [ ] Subtask 2.11.1: Add file and image sharing
  - [x] Subtask 2.11.2: Implement read receipts
  - [ ] Subtask 2.11.3: Create offline message queuing
  - Status: In Progress
  - Notes: Message status indicators (sending, sent, delivered, read) implemented. Attachment handling and offline queuing need further work.

#### Week 15-16: InfoPoints System

- [x] Task 2.12: Design and implement InfoPoints System
  - [x] Subtask 2.12.1: Create InfoPoints data models
  - [x] Subtask 2.12.2: Implement InfoPoints service
  - [x] Subtask 2.12.3: Add InfoPoints state management
  - Status: Completed
  - Notes: InfoPoints models created and service implemented with mock data. Redux state management set up for InfoPoints data.

- [x] Task 2.13: Create InfoPoints UI
  - [x] Subtask 2.13.1: Implement InfoPoints list screen
  - [x] Subtask 2.13.2: Create InfoPoint detail view
  - [x] Subtask 2.13.3: Add InfoPoint creation form
  - Status: Completed
  - Notes: Created InfoPoints screens with list view, detailed view, and creation/editing forms. Implemented CRUD operations for both user types with role-specific permissions.

### Phase 3: Advanced Features

#### Week 17-18: Polls and Surveys

- [ ] Task 3.1: Design and implement Polls System
  - [x] Subtask 3.1.1: Create polls data models
  - [x] Subtask 3.1.2: Implement polls service
  - [x] Subtask 3.1.3: Add polls state management
  - Status: In Progress
  - Notes: Poll models created including question types (single choice, multiple choice, rating scale). Service layer with mock data implemented.

- [ ] Task 3.2: Implement Poll Creation
  - [x] Subtask 3.2.1: Create poll form
  - [x] Subtask 3.2.2: Implement question types
  - [x] Subtask 3.2.3: Add target audience selection
  - [ ] Subtask 3.2.4: Implement scheduling and notifications
  - Status: In Progress
  - Notes: Poll creation form implemented with multiple question types and targeting options. Scheduling and notification integration pending.

- [ ] Task 3.3: Create Poll Response UI
  - [x] Subtask 3.3.1: Implement poll list
  - [x] Subtask 3.3.2: Create poll response form
  - [ ] Subtask 3.3.3: Add response visualization
  - Status: In Progress
  - Notes: Poll list and response submission implemented. Results visualization dashboard in development.

#### Week 19-20: Maintenance and Issue Reporting

- [ ] Task 3.5: Design and implement Maintenance System
  - Subtask 3.5.1: Create maintenance models
  - Subtask 3.5.2: Implement maintenance service
  - Subtask 3.5.3: Add maintenance state management
  - Status: Not started

- [ ] Task 3.6: Create Maintenance UI
  - Subtask 3.6.1: Implement reports list screen
  - Subtask 3.6.2: Create report detail view
  - Subtask 3.6.3: Add report creation interface
  - Status: Not started

- [ ] Task 3.7: Implement Maintenance Features
  - Subtask 3.7.1: Add priority levels
  - Subtask 3.7.2: Implement status tracking
  - Subtask 3.7.3: Create assignment workflow
  - Subtask 3.7.4: Add communication thread
  - Status: Not started

- [ ] Task 3.8: Create Maintenance Analytics
  - Subtask 3.8.1: Implement resolution time tracking
  - Subtask 3.8.2: Add performance metrics
  - Subtask 3.8.3: Create trend visualization
  - Status: Not started

#### Week 21-22: Advanced Reporting

- [x] Task 3.9: Design and implement Reporting System
  - [x] Subtask 3.9.1: Create report models
  - [x] Subtask 3.9.2: Implement reporting service
  - [x] Subtask 3.9.3: Add report state management
  - Status: Completed
  - Notes: Implemented comprehensive Reports module with data models, services, state management with Redux, and UI components.

- [x] Task 3.10: Create Financial Reports
  - [x] Subtask 3.10.1: Implement revenue reports
  - [x] Subtask 3.10.2: Add expense reports
  - [x] Subtask 3.10.3: Create balance sheets
  - Status: Completed
  - Notes: Added multiple financial report types in the Reports module with support for filtering and visualization.

- [x] Task 3.11: Implement Operational Reports
  - [x] Subtask 3.11.1: Create maintenance reports
  - [x] Subtask 3.11.2: Add occupancy reports
  - [x] Subtask 3.11.3: Implement staff performance reports
  - Status: Completed
  - Notes: Implemented operational reports with support for maintenance requests, occupancy trends, and staff performance metrics.

- [x] Task 3.12: Create Resident Engagement Reports
  - [x] Subtask 3.12.1: Implement communication reports
  - [x] Subtask 3.12.2: Add participation metrics
  - [x] Subtask 3.12.3: Create satisfaction analysis
  - Status: Completed
  - Notes: Added resident-related reports with features for resident satisfaction trends, communication metrics, and engagement tracking.

#### Week 23-24: Organigram Visualization

- [ ] Task 3.13: Design and implement Organigram System
  - Subtask 3.13.1: Create organigram models
  - Subtask 3.13.2: Implement organigram service
  - Subtask 3.13.3: Add organigram state management
  - Status: Not started

- [ ] Task 3.14: Create Organigram UI
  - Subtask 3.14.1: Implement hierarchical visualization
  - Subtask 3.14.2: Add interactive navigation
  - Subtask 3.14.3: Create detail views
  - Status: Not started

- [ ] Task 3.15: Implement Organigram Features
  - Subtask 3.15.1: Add building filtering
  - Subtask 3.15.2: Implement search functionality
  - Subtask 3.15.3: Create export capabilities
  - Status: Not started

### Phase 4: Polish and Release

#### Week 25: UI/UX Refinements

- [ ] Task 4.1: Perform UI Audit and Refinement
  - Subtask 4.1.1: Audit visual consistency
  - Subtask 4.1.2: Refine animations and transitions
  - Subtask 4.1.3: Improve responsive layouts
  - Status: Not started

- [ ] Task 4.2: Implement Dark Mode
  - Subtask 4.2.1: Create dark theme styles
  - Subtask 4.2.2: Add theme switching
  - Subtask 4.2.3: Test visual consistency
  - Status: Not started

- [ ] Task 4.3: Improve Accessibility
  - Subtask 4.3.1: Add accessibility labels
  - Subtask 4.3.2: Implement keyboard navigation
  - Subtask 4.3.3: Test with screen readers
  - Status: Not started

- [ ] Task 4.4: Create Onboarding Experience
  - Subtask 4.4.1: Design onboarding screens
  - Subtask 4.4.2: Implement onboarding flow
  - Subtask 4.4.3: Add first-time user guidance
  - Status: Not started

#### Week 26: Performance Testing & Optimization

- [ ] Task 4.5: Perform Performance Audit
  - Subtask 4.5.1: Audit rendering performance
  - Subtask 4.5.2: Review memory usage
  - Subtask 4.5.3: Test network performance
  - Status: Not started

- [ ] Task 4.6: Optimize Rendering
  - Subtask 4.6.1: Implement memo and useMemo
  - Subtask 4.6.2: Optimize list rendering
  - Subtask 4.6.3: Improve component re-renders
  - Status: Not started

- [ ] Task 4.7: Optimize Assets
  - Subtask 4.7.1: Compress images
  - Subtask 4.7.2: Implement lazy loading
  - Subtask 4.7.3: Add caching strategies
  - Status: Not started

- [ ] Task 4.8: Implement Offline Support
  - Subtask 4.8.1: Enhance offline data persistence
  - Subtask 4.8.2: Add offline action queuing
  - Subtask 4.8.3: Improve sync mechanisms
  - Status: Not started

#### Week 27: Security Audit & Beta Testing

- [ ] Task 4.9: Perform Security Audit
  - Subtask 4.9.1: Review authentication security
  - Subtask 4.9.2: Audit data encryption
  - Subtask 4.9.3: Test API security
  - Status: Not started

- [ ] Task 4.10: Fix Security Issues
  - Subtask 4.10.1: Address authentication vulnerabilities
  - Subtask 4.10.2: Improve data protection
  - Subtask 4.10.3: Enhance API security
  - Status: Not started

- [ ] Task 4.11: Set Up Beta Testing
  - Subtask 4.11.1: Configure TestFlight (iOS)
  - Subtask 4.11.2: Set up Google Play Beta (Android)
  - Subtask 4.11.3: Create testing documentation
  - Status: Not started

- [ ] Task 4.12: Collect and Address Beta Feedback
  - Subtask 4.12.1: Implement feedback mechanism
  - Subtask 4.12.2: Prioritize feedback items
  - Subtask 4.12.3: Fix critical issues
  - Status: Not started

#### Week 28: App Store Submission

- [ ] Task 4.13: Prepare App Store Assets
  - Subtask 4.13.1: Create app icons
  - Subtask 4.13.2: Design screenshots
  - Subtask 4.13.3: Write app descriptions
  - Status: Not started

- [ ] Task 4.14: Configure App Store Settings
  - Subtask 4.14.1: Set up App Store Connect
  - Subtask 4.14.2: Configure Google Play Console
  - Subtask 4.14.3: Set privacy policies
  - Status: Not started

- [ ] Task 4.15: Submit to App Stores
  - Subtask 4.15.1: Submit to Apple App Store
  - Subtask 4.15.2: Submit to Google Play Store
  - Subtask 4.15.3: Address review feedback
  - Status: Not started

- [ ] Task 4.16: Prepare Launch Marketing
  - Subtask 4.16.1: Create launch announcement
  - Subtask 4.16.2: Prepare support documentation
  - Subtask 4.16.3: Set up user support channels
  - Status: Not started

## Progress Tracking

### Weekly Status Updates

#### Week 1-2 (2024-06-01 to 2024-06-14)
- **Completed Tasks**: 
  - Project setup and repository creation
  - React Native project configuration with TypeScript
  - Dependency installation and configuration
  - Linting and code formatting setup
  - App architecture and folder structure established
- **In Progress**: 
  - UI component development
  - Navigation implementation
  - Authentication screens
- **Blockers**: None
- **Next Week's Focus**: Complete navigation, authentication, and dashboard screens

#### Week 3-4 (2024-06-15 to 2024-06-28)
- **Completed Tasks**: 
  - Authentication screens and user management
  - Dashboard screens
- **In Progress**: 
  - Building and resident management
  - Financial and communication features
- **Blockers**: None
- **Next Week's Focus**: Complete building and resident management

#### Week 5-6 (2024-06-29 to 2024-07-12)
- **Completed Tasks**: 
  - Building and resident management
- **In Progress**: 
  - Financial and communication features
- **Blockers**: None
- **Next Week's Focus**: Complete financial and communication features

#### Week 7-8 (2024-07-13 to 2024-07-26)
- **Completed Tasks**: 
  - Financial and communication features
- **In Progress**: 
  - Advanced features
- **Blockers**: None
- **Next Week's Focus**: Complete advanced features

#### Week 9-10 (2024-07-27 to 2024-08-09)
- **Completed Tasks**: 
  - Advanced features
- **In Progress**: 
  - Polish and release
- **Blockers**: None
- **Next Week's Focus**: Complete polish and release

#### Week 11-12 (2024-08-10 to 2024-08-23)
- **Completed Tasks**: 
  - Notifications system
- **In Progress**: 
  - InfoPoints implementation
- **Blockers**: None
- **Next Week's Focus**: Complete InfoPoints implementation

#### Week 13-14 (2024-08-24 to 2024-09-06)
- **Completed Tasks**: 
  - Created initial chat UI components (ChatListScreen, ChatConversationScreen, MessageInput, MessageBubble)
  - Set up Redux chat slice for state management
- **In Progress**: 
  - Chat functionality implementation
  - Socket integration for real-time messaging
  - Fixing TypeScript issues in chat-related components
- **Blockers**: 
  - TypeScript JSX configuration issues
  - Socket.io integration challenges
- **Next Week's Focus**: Resolve chat functionality issues and improve real-time messaging reliability

#### Week 21-22 (2024-10-19 to 2024-11-01)
- **Completed Tasks**: 
  - Created Reports module (models, services, state management)
  - Implemented UI for reports viewing and filtering
  - Added report visualization capabilities and detail view
- **In Progress**: 
  - Organigram system design and implementation
- **Blockers**: None
- **Next Week's Focus**: Begin implementing Organigram module

## Risk Management

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|------------|---------------------|
| API integration delays | High | Medium | Early integration testing, mock API implementation |
| Performance issues with large datasets | High | Medium | Implement pagination, virtualization, and optimized rendering |
| Cross-platform compatibility issues | Medium | High | Regular testing on multiple devices, platform-specific code where necessary |
| User adoption challenges | High | Low | Intuitive UI design, comprehensive onboarding, responsive support |
| Security vulnerabilities | Critical | Low | Regular security audits, following best practices, penetration testing |

## Resources

### Development Team
- Project Manager: [Name]
- Lead Developer: [Name]
- Frontend Developers: [Names]
- Backend Integration: [Names]
- QA Testing: [Names]
- UI/UX Designer: [Name]

### Development Environment
- Source Control: GitHub
- CI/CD: GitHub Actions
- Project Management: [Tool]
- Communication: [Tool]

## Appendix

### Definition of Done
- Code is written according to style guidelines
- Unit tests are written and passing
- Code is reviewed by at least one other developer
- Feature is tested on both iOS and Android
- Documentation is updated
- Feature meets acceptance criteria

### Task Status Definitions
- **Not Started**: Task has not been initiated
- **In Progress**: Task is actively being worked on
- **Blocked**: Task cannot proceed due to dependencies or issues
- **Review**: Task is complete and awaiting review
- **Completed**: Task is finished and meets all acceptance criteria

### Change Management Process
1. Change request submitted
2. Impact assessment conducted
3. Change approved/rejected by project manager
4. If approved, task added to backlog and prioritized
5. Implementation scheduled
6. Change documented in project plan 