import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import { useContextData } from '../hooks/useContextData';
import { Header } from './Header';
import { ContextFilter } from './ContextFilter';

interface ContextScreenWrapperProps {
  children: ReactNode;
  title?: string;
  showFilter?: boolean;
  onFilterChange?: (buildingId: string | null) => void;
  initialFilter?: string | null;
  filterLabel?: string;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  showBackButton?: boolean;
  contentContainerStyle?: any;
  disableScrollView?: boolean;
  forceShowContextSwitcher?: boolean;
}

/**
 * A wrapper for screens that are context-aware
 * Provides a consistent layout with context information and filtering
 */
export const ContextScreenWrapper: React.FC<ContextScreenWrapperProps> = ({
  children,
  title,
  showFilter = false,
  onFilterChange = () => {},
  initialFilter = null,
  filterLabel = 'Filter by:',
  isLoading = false,
  refreshing = false,
  onRefresh,
  showBackButton = false,
  contentContainerStyle,
  disableScrollView = false,
  forceShowContextSwitcher = false,
}) => {
  const theme = useTheme();
  const { 
    userRole, 
    currentBusinessAccount, 
    currentBuilding,
    refreshContextData,
  } = useContextData();
  
  // Determine screen title based on context
  const headerTitle = title || (userRole === 'business_manager' 
    ? currentBusinessAccount?.name 
    : currentBuilding?.name) || '';

  // Context-aware subtitle
  const contextSubtitle = userRole === 'business_manager'
    ? 'Business Manager'
    : currentBuilding?.address || 'Administrator';
  
  // Handle refresh - also refresh context data
  const handleRefresh = () => {
    refreshContextData();
    if (onRefresh) {
      onRefresh();
    }
  };

  // Only show context switcher on Dashboard or when explicitly requested
  const shouldShowContextSwitcher = forceShowContextSwitcher || title === 'Dashboard';

  const renderContent = () => (
    <>
      <View style={styles.contextInfo}>
        <Text variant="headlineSmall" style={styles.screenTitle}>
          {title || (userRole === 'business_manager' ? 'Dashboard' : 'Building Dashboard')}
        </Text>
        <Text variant="bodyMedium" style={styles.contextSubtitle}>
          {contextSubtitle}
        </Text>
      </View>
      
      {showFilter && (
        <ContextFilter 
          onFilterChange={onFilterChange}
          initialFilter={initialFilter}
          label={filterLabel}
        />
      )}
      
      <Divider style={styles.divider} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true} 
            color={theme.colors.primary} 
            size="large" 
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        children
      )}
    </>
  );
  
  return (
    <View style={styles.container}>
      <Header 
        title={headerTitle}
        showBack={showBackButton}
        showContextSwitcher={shouldShowContextSwitcher}
      />
      
      {/* Always render content without ScrollView to avoid nested scrolling issues */}
      <View style={[styles.contentWithoutScroll, contentContainerStyle]}>
        {onRefresh && !disableScrollView ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          >
            <View />
          </RefreshControl>
        ) : null}
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWithoutScroll: {
    flex: 1,
    padding: 16,
  },
  contextInfo: {
    marginBottom: 16,
  },
  screenTitle: {
    fontWeight: '600',
  },
  contextSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
}); 