import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Surface, 
  Text, 
  Button,
  Divider,
  List,
  useTheme
} from 'react-native-paper';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle,
  Bell,
  Filter 
} from 'lucide-react-native';

import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { Toast } from '../../components/feedback/Toast';
import { Modal } from '../../components/modal/Modal';
import { BottomSheet } from '../../components/modal/BottomSheet';
import { SegmentedControl } from '../../components/navigation/SegmentedControl';
import { ContentCard } from '../../components/cards/ContentCard';
import { ElevationLevel } from '../../theme';
import { useToast } from '../../components/feedback/ToastProvider';
import type { AppTheme } from '../../theme/theme';

/**
 * A showcase screen that demonstrates the feedback and modal components.
 */
export const FeedbackComponentsShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();
  const { showToast } = useToast();
  
  // Toast states
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [toastMessage, setToastMessage] = useState('This is a toast message');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'basic' | 'actions' | 'custom'>('basic');
  
  // Bottom sheet states
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  
  // Segmented control state
  const [selectedView, setSelectedView] = useState('day');
  const [buttonVariant, setButtonVariant] = useState<'filled' | 'outlined'>('filled');
  
  // Show different toast types
  const showToastExample = (type: 'info' | 'success' | 'error' | 'warning') => {
    setToastType(type);
    
    let message = '';
    switch (type) {
      case 'success':
        message = 'Operation completed successfully!';
        break;
      case 'error':
        message = 'An error occurred. Please try again.';
        break;
      case 'warning':
        message = 'Warning: This action may have consequences.';
        break;
      case 'info':
      default:
        message = 'Here is some helpful information.';
        break;
    }
    
    setToastMessage(message);
    setToastVisible(true);
    
    // Also show the global toast
    showToast({
      message: `Global ${type} toast message`,
      type,
      duration: 3000,
    });
  };
  
  // Show different modal types
  const showModalExample = (type: 'basic' | 'actions' | 'custom') => {
    setModalType(type);
    setModalVisible(true);
  };
  
  // Render modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case 'actions':
        return (
          <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
        );
      case 'custom':
        return (
          <View>
            <Text style={styles(theme).modalText}>
              This modal has custom content with components.
            </Text>
            <View style={styles(theme).modalExample}>
              <SegmentedControl
                items={[
                  { key: 'day', label: 'Day' },
                  { key: 'week', label: 'Week' },
                  { key: 'month', label: 'Month' },
                ]}
                selectedKey={selectedView}
                onChange={setSelectedView}
                variant={buttonVariant}
              />
            </View>
            <Button 
              mode="outlined"
              onPress={() => setButtonVariant(buttonVariant === 'filled' ? 'outlined' : 'filled')}
              style={{ marginTop: theme.spacing.m }}
            >
              Toggle Variant
            </Button>
          </View>
        );
      case 'basic':
      default:
        return (
          <Text>
            This is a basic modal dialog that demonstrates the Modal component. 
            You can dismiss it by tapping outside or using the close button.
          </Text>
        );
    }
  };
  
  // Modal actions based on type
  const getModalActions = () => {
    if (modalType === 'actions') {
      return [
        {
          label: 'Cancel',
          onPress: () => setModalVisible(false),
          mode: 'text' as const,
        },
        {
          label: 'Delete',
          onPress: () => {
            setModalVisible(false);
            showToastExample('success');
          },
          mode: 'contained' as const,
          color: theme.colors.error,
        },
      ];
    }
    
    return undefined;
  };
  
  // Modal title based on type
  const getModalTitle = () => {
    switch (modalType) {
      case 'actions':
        return 'Confirm Deletion';
      case 'custom':
        return 'Custom Modal';
      case 'basic':
      default:
        return 'Basic Modal Example';
    }
  };
  
  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="Feedback Components"
        subtitle="MD3 Toast, Modal & Bottom Sheet"
        showBack
        elevation={ElevationLevel.Level2}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).container}>
          <Text variant="headlineMedium" style={styles(theme).heading}>
            Feedback & Modal Components
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            This showcase demonstrates the feedback and modal components with Material Design 3 styling.
          </Text>

          <Divider style={styles(theme).divider} />
          
          {/* Toast Examples */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Toast Notifications
          </Text>
          
          <ContentCard title="Toast Examples" elevation={ElevationLevel.Level1}>
            <Text variant="bodyMedium" style={styles(theme).cardDescription}>
              Toast notifications provide brief feedback about operations through a message.
            </Text>
            
            <View style={styles(theme).buttonsContainer}>
              <Button
                mode="outlined"
                icon={() => <Info size={18} color={theme.colors.primary} />}
                onPress={() => showToastExample('info')}
                style={styles(theme).button}
              >
                Info
              </Button>
              
              <Button
                mode="outlined"
                icon={() => <CheckCircle size={18} color={theme.colors.primary} />}
                onPress={() => showToastExample('success')}
                style={styles(theme).button}
              >
                Success
              </Button>
              
              <Button
                mode="outlined"
                icon={() => <AlertCircle size={18} color="#FFC107" />}
                onPress={() => showToastExample('warning')}
                style={styles(theme).button}
              >
                Warning
              </Button>
              
              <Button
                mode="outlined"
                icon={() => <XCircle size={18} color={theme.colors.error} />}
                onPress={() => showToastExample('error')}
                style={styles(theme).button}
              >
                Error
              </Button>
            </View>
          </ContentCard>
          
          <Divider style={styles(theme).divider} />
          
          {/* Modal Examples */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Modal Dialogs
          </Text>
          
          <ContentCard title="Modal Examples" elevation={ElevationLevel.Level1}>
            <Text variant="bodyMedium" style={styles(theme).cardDescription}>
              Modals inform users about a specific task and may contain critical information or require actions.
            </Text>
            
            <View style={styles(theme).buttonsContainer}>
              <Button
                mode="outlined"
                onPress={() => showModalExample('basic')}
                style={styles(theme).button}
              >
                Basic Modal
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => showModalExample('actions')}
                style={styles(theme).button}
              >
                With Actions
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => showModalExample('custom')}
                style={styles(theme).button}
              >
                Custom Content
              </Button>
            </View>
          </ContentCard>
          
          <Divider style={styles(theme).divider} />
          
          {/* Bottom Sheet Examples */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Bottom Sheets
          </Text>
          
          <ContentCard title="Bottom Sheet Example" elevation={ElevationLevel.Level1}>
            <Text variant="bodyMedium" style={styles(theme).cardDescription}>
              Bottom sheets slide up from the bottom of the screen to reveal more content.
              Ideal for mobile interfaces.
            </Text>
            
            <Button
              mode="outlined"
              icon={() => <Filter size={18} color={theme.colors.primary} />}
              onPress={() => setBottomSheetVisible(true)}
              style={[styles(theme).button, { alignSelf: 'center' }]}
            >
              Show Bottom Sheet
            </Button>
          </ContentCard>
          
          <Divider style={styles(theme).divider} />
          
          {/* Segmented Control Examples */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Segmented Controls
          </Text>
          
          <ContentCard title="Segmented Control Examples" elevation={ElevationLevel.Level1}>
            <Text variant="bodyMedium" style={styles(theme).cardDescription}>
              Segmented controls provide tab-like navigation options for quickly switching between views.
            </Text>
            
            <View style={styles(theme).segmentExample}>
              <Text variant="titleSmall" style={styles(theme).segmentTitle}>
                Filled Variant
              </Text>
              <SegmentedControl
                items={[
                  { key: 'day', label: 'Day' },
                  { key: 'week', label: 'Week' },
                  { key: 'month', label: 'Month' },
                ]}
                selectedKey={selectedView}
                onChange={setSelectedView}
                variant="filled"
                fullWidth
              />
            </View>
            
            <View style={styles(theme).segmentExample}>
              <Text variant="titleSmall" style={styles(theme).segmentTitle}>
                Outlined Variant
              </Text>
              <SegmentedControl
                items={[
                  { key: 'day', label: 'Day' },
                  { key: 'week', label: 'Week' },
                  { key: 'month', label: 'Month' },
                ]}
                selectedKey={selectedView}
                onChange={setSelectedView}
                variant="outlined"
                fullWidth
              />
            </View>
            
            <View style={styles(theme).segmentExample}>
              <Text variant="titleSmall" style={styles(theme).segmentTitle}>
                Scrollable with More Options
              </Text>
              <SegmentedControl
                items={[
                  { key: 'today', label: 'Today' },
                  { key: 'day', label: 'Day' },
                  { key: 'week', label: 'Week' },
                  { key: 'month', label: 'Month' },
                  { key: 'year', label: 'Year' },
                  { key: 'all', label: 'All Time' },
                ]}
                selectedKey={selectedView}
                onChange={setSelectedView}
                variant="filled"
                scrollable
              />
            </View>
          </ContentCard>
        </View>
      </ScrollView>
      
      {/* Toast Example Component */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        action={{
          label: 'UNDO',
          onPress: () => console.log('Undo pressed'),
        }}
      />
      
      {/* Modal Example */}
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title={getModalTitle()}
        actions={getModalActions()}
      >
        {renderModalContent()}
      </Modal>
      
      {/* Bottom Sheet Example */}
      <BottomSheet
        visible={bottomSheetVisible}
        onDismiss={() => setBottomSheetVisible(false)}
        title="Filter Options"
        showDragIndicator
      >
        <List.Section>
          <List.Subheader>Categories</List.Subheader>
          <List.Item 
            title="All Categories" 
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item 
            title="Work" 
            left={props => <List.Icon {...props} icon="briefcase" />}
          />
          <List.Item 
            title="Personal" 
            left={props => <List.Icon {...props} icon="account" />}
          />
          <List.Item 
            title="Important" 
            left={props => <List.Icon {...props} icon="star" />}
          />
        </List.Section>
        
        <View style={styles(theme).bottomSheetActions}>
          <Button mode="text" onPress={() => setBottomSheetVisible(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={() => {
              setBottomSheetVisible(false);
              showToastExample('success');
            }}
          >
            Apply Filters
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  scrollView: {
    flex: 1,
  },
  heading: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  description: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
  },
  sectionTitle: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onBackground,
  },
  cardDescription: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing.xs,
  },
  modalExample: {
    marginTop: theme.spacing.m,
  },
  modalText: {
    marginBottom: theme.spacing.m,
  },
  bottomSheetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.m,
  },
  segmentExample: {
    marginBottom: theme.spacing.m,
  },
  segmentTitle: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurfaceVariant,
  },
}); 