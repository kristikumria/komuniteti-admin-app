import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useTheme, Text, Card, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Dashboard } from './index';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useOrientation } from '../../../hooks/useOrientation';
import { Grid, Row, Col } from '../../../components/Grid';
import { Header } from '../../../components/Header';
import { useAppSelector } from '../../../store/hooks';

/**
 * Tablet-optimized dashboard layout that rearranges content to take advantage of the larger screen.
 * Shows a multi-column layout with expanded metrics and side-by-side sections.
 */
export const DashboardTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isTablet } = useBreakpoint();
  const orientation = useOrientation();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  // If not on tablet, render the regular dashboard
  if (!isTablet) {
    return <Dashboard />;
  }
  
  // Determine column layout based on orientation
  const isLandscape = orientation === 'landscape';
  const mainContentSize = isLandscape ? 8 : 7; // Wider main content area in landscape
  const sidebarSize = isLandscape ? 4 : 5; // Narrower sidebar in landscape
  
  const backgroundColor = isDarkMode ? '#121212' : '#f7f7f7';
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header 
        title="Dashboard" 
        showBack={false}
        showAccountSwitcher={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Grid fluid padding={16}>
          <Row>
            {/* Main content column */}
            <Col size={mainContentSize} style={{ paddingRight: 8 }}>
              {/* We're passing a component with dashboard parts, but not the entire Dashboard component */}
              <DashboardMainContent />
            </Col>
            
            {/* Sidebar column */}
            <Col size={sidebarSize} style={{ paddingLeft: 8 }}>
              <DashboardSidebar />
            </Col>
          </Row>
        </Grid>
      </ScrollView>
    </View>
  );
};

/**
 * Main content area of the dashboard - contains overview metrics and recent residents
 */
const DashboardMainContent = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { residents, loading, refreshing, handleRefresh } = useDashboardData();
  
  const backgroundColor = isDarkMode ? '#121212' : '#f7f7f7';
  const cardBackground = isDarkMode ? '#1E1E1E' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  
  // Calculate stats from resident data
  const totalResidents = residents.length;
  const overdue = residents.filter(resident => resident.paymentStatus === 'overdue').length;
  const overduePercentage = totalResidents ? Math.round((overdue / totalResidents) * 100) : 0;
  const owners = residents.filter(resident => resident.status === 'owner').length;
  const ownersPercentage = totalResidents ? Math.round((owners / totalResidents) * 100) : 0;
  
  return (
    <View style={styles.mainContentContainer}>
      {/* Welcome section rendered in header */}
      
      {/* Overview section with metrics in a 2x2 grid */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Overview</Text>
        
        <Row>
          {/* Use Col components for a proper grid layout */}
          <Col size={6} style={styles.metricColContainer}>
            <Surface style={[styles.metricCard, { backgroundColor: cardBackground }]} elevation={2}>
              <Text style={[styles.metricLabel, { color: secondaryTextColor }]}>Total Residents</Text>
              <Text style={[styles.metricValue, { color: textColor }]}>{totalResidents}</Text>
              <View style={styles.metricIndicator}>
                <Text style={[styles.metricTrend, { color: theme.colors.primary }]}>Active</Text>
              </View>
            </Surface>
          </Col>
          
          <Col size={6} style={styles.metricColContainer}>
            <Surface style={[styles.metricCard, { backgroundColor: cardBackground }]} elevation={2}>
              <Text style={[styles.metricLabel, { color: secondaryTextColor }]}>Owners</Text>
              <Text style={[styles.metricValue, { color: textColor }]}>{owners}</Text>
              <View style={styles.metricIndicator}>
                <Text style={[styles.metricTrend, { color: '#00897b' }]}>{ownersPercentage}%</Text>
              </View>
            </Surface>
          </Col>
          
          <Col size={6} style={styles.metricColContainer}>
            <Surface style={[styles.metricCard, { backgroundColor: cardBackground }]} elevation={2}>
              <Text style={[styles.metricLabel, { color: secondaryTextColor }]}>Revenue</Text>
              <Text style={[styles.metricValue, { color: textColor }]}>€8,500</Text>
              <View style={styles.metricIndicator}>
                <Text style={[styles.metricTrend, { color: '#43a047' }]}>+12%</Text>
              </View>
            </Surface>
          </Col>
          
          <Col size={6} style={styles.metricColContainer}>
            <Surface style={[styles.metricCard, { backgroundColor: cardBackground }]} elevation={2}>
              <Text style={[styles.metricLabel, { color: secondaryTextColor }]}>Overdue</Text>
              <Text style={[styles.metricValue, { color: textColor }]}>{overdue}</Text>
              <View style={styles.metricIndicator}>
                <Text style={[styles.metricTrend, { color: '#e53935' }]}>{overduePercentage}%</Text>
              </View>
            </Surface>
          </Col>
        </Row>
      </View>
      
      {/* New section: expanded quick stats */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Properties</Text>
        
        <Surface style={[styles.expandedStatsCard, { backgroundColor: cardBackground }]} elevation={2}>
          <Row>
            <Col size={4} style={styles.expandedStatsCol}>
              <Text style={[styles.expandedStatsLabel, { color: secondaryTextColor }]}>Total Buildings</Text>
              <Text style={[styles.expandedStatsValue, { color: textColor }]}>5</Text>
            </Col>
            
            <Col size={4} style={styles.expandedStatsCol}>
              <Text style={[styles.expandedStatsLabel, { color: secondaryTextColor }]}>Total Units</Text>
              <Text style={[styles.expandedStatsValue, { color: textColor }]}>127</Text>
            </Col>
            
            <Col size={4} style={styles.expandedStatsCol}>
              <Text style={[styles.expandedStatsLabel, { color: secondaryTextColor }]}>Occupancy Rate</Text>
              <Text style={[styles.expandedStatsValue, { color: textColor }]}>93%</Text>
            </Col>
          </Row>
        </Surface>
      </View>
      
      {/* Recent residents section - will be rendered wider on tablets */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Residents</Text>
        
        <Surface style={[styles.recentListCard, { backgroundColor: cardBackground }]} elevation={2}>
          {/* Resident list will be rendered here */}
          {/* For brevity, not including the full list rendering logic */}
          <View style={styles.placeholderBox}>
            <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
              Recent residents list with expanded details would be shown here
            </Text>
          </View>
        </Surface>
      </View>
    </View>
  );
};

/**
 * Sidebar area of the dashboard - contains quick actions, payments, and reports
 */
const DashboardSidebar = () => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const backgroundColor = isDarkMode ? '#121212' : '#f7f7f7';
  const cardBackground = isDarkMode ? '#1E1E1E' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  
  return (
    <View style={styles.sidebarContainer}>
      {/* Welcome section */}
      <View style={styles.sectionContainer}>
        <WelcomeSection />
      </View>
      
      {/* Quick actions */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
        
        <Surface style={[styles.quickActionsCard, { backgroundColor: cardBackground }]} elevation={2}>
          <View style={styles.placeholderBox}>
            <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
              Quick actions would be shown here
            </Text>
          </View>
        </Surface>
      </View>
      
      {/* Recent payments */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Payments</Text>
        
        <Surface style={[styles.recentListCard, { backgroundColor: cardBackground }]} elevation={2}>
          <View style={styles.placeholderBox}>
            <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
              Recent payments list would be shown here
            </Text>
          </View>
        </Surface>
      </View>
      
      {/* Maintenance reports - additional tablet-only section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Reports</Text>
        
        <Surface style={[styles.recentListCard, { backgroundColor: cardBackground }]} elevation={2}>
          <View style={styles.placeholderBox}>
            <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
              Recent maintenance reports would be shown here
            </Text>
          </View>
        </Surface>
      </View>
    </View>
  );
};

/**
 * Welcome section shown in the sidebar
 */
const WelcomeSection = () => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  
  return (
    <View style={styles.welcomeContainer}>
      <Text style={[styles.welcomeText, { color: textColor }]}>
        Welcome back,
      </Text>
      <Text style={[styles.nameText, { color: textColor }]}>
        {user?.name || 'Administrator'}
      </Text>
    </View>
  );
};

/**
 * Custom hook to provide shared dashboard data
 */
const useDashboardData = () => {
  // This is a simplified version - in a real implementation, we would
  // move the data fetching logic from the Dashboard component here
  
  return {
    residents: [],
    loading: false,
    refreshing: false,
    handleRefresh: () => {},
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  mainContentContainer: {
    flex: 1,
  },
  sidebarContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  welcomeContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricColContainer: {
    marginBottom: 16,
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    height: 120,
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  metricIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: '600',
  },
  expandedStatsCard: {
    borderRadius: 12,
    padding: 16,
  },
  expandedStatsCol: {
    padding: 8,
  },
  expandedStatsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  expandedStatsValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActionsCard: {
    borderRadius: 12,
    padding: 16,
    height: 150,
  },
  recentListCard: {
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  placeholderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 100,
  },
  placeholderText: {
    textAlign: 'center',
  },
}); 