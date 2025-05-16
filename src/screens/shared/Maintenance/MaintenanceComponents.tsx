import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { 
  Text, 
  useTheme, 
  Surface, 
  Button, 
  Divider, 
  Chip, 
  Avatar, 
  Card, 
  IconButton,
  ActivityIndicator,
  SegmentedButtons,
  TextInput,
  Menu,
  Dialog,
  Portal,
  RadioButton,
  List,
  Snackbar
} from 'react-native-paper';
import { 
  Wrench, 
  ArrowLeft, 
  Calendar, 
  User, 
  Building, 
  AlertCircle, 
  Clock, 
  Home,
  FileText,
  PieChart,
  Users,
  MessageCircle,
  Send,
  Edit,
  Check,
  Flag,
  BarChart,
  BarChart2,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useContextData } from '../../../hooks/useContextData';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
import { MaintenanceRequest, MaintenanceWorker, MaintenanceComment, MaintenancePriority, MaintenanceStatus, MaintenanceAnalytics } from '../../../types/maintenanceTypes';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchRequestById, 
  updateRequestPriority, 
  assignMaintenanceToWorker,
  updateMaintenanceStatus,
  addMaintenanceComment,
  fetchWorkers,
  fetchAnalytics,
  selectCurrentRequest,
  selectCurrentRequestLoading,
  selectCurrentRequestError,
  selectWorkers,
  selectWorkersLoading,
  selectPriorityUpdateLoading,
  selectAssignmentLoading,
  selectStatusUpdateLoading,
  selectCommentAddLoading,
  selectAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsError
} from '../../../store/slices/maintenanceSlice';
import { ElevationLevel } from '../../../theme/elevation';

// MaintenanceDetail component with proper MD3 styling
export const MaintenanceDetail = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { requestId } = route.params;
  const { user } = useAppSelector(state => state.auth);
  
  // Get request data from Redux
  const request = useAppSelector(selectCurrentRequest);
  const loading = useAppSelector(selectCurrentRequestLoading);
  const error = useAppSelector(selectCurrentRequestError);

  // Get workers data from Redux
  const workers = useAppSelector(selectWorkers);
  const workersLoading = useAppSelector(selectWorkersLoading);
  
  // Get workflow operation states
  const priorityUpdateLoading = useAppSelector(selectPriorityUpdateLoading);
  const assignmentLoading = useAppSelector(selectAssignmentLoading);
  const statusUpdateLoading = useAppSelector(selectStatusUpdateLoading);
  const commentAddLoading = useAppSelector(selectCommentAddLoading);

  // Local state for UI controls
  const [priorityMenuVisible, setPriorityMenuVisible] = React.useState(false);
  const [showAssignDialog, setShowAssignDialog] = React.useState(false);
  const [showStatusDialog, setShowStatusDialog] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<MaintenanceStatus | ''>('');
  const [resolutionDetails, setResolutionDetails] = React.useState('');
  const [actualCost, setActualCost] = React.useState('');
  const [selectedWorkerId, setSelectedWorkerId] = React.useState('');
  const [commentText, setCommentText] = React.useState('');
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  // Fetch request data on mount
  React.useEffect(() => {
    dispatch(fetchRequestById(requestId));
    dispatch(fetchWorkers());
  }, [dispatch, requestId]);

  // Helper function to show snackbar message
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Priority management
  const handlePriorityChange = (priority: MaintenancePriority) => {
    dispatch(updateRequestPriority({ requestId, priority }))
      .unwrap()
      .then(() => {
        setPriorityMenuVisible(false);
        showSnackbar('Priority updated successfully');
      })
      .catch((error) => {
        showSnackbar(`Error updating priority: ${error}`);
      });
  };

  // Worker assignment
  const handleAssignWorker = () => {
    if (!selectedWorkerId) return;
    
    const worker = workers.find(w => w.id === selectedWorkerId);
    if (!worker) return;
    
    dispatch(assignMaintenanceToWorker({
      requestId,
      workerId: selectedWorkerId,
      workerName: worker.name
    }))
      .unwrap()
      .then(() => {
        setShowAssignDialog(false);
        showSnackbar(`Request assigned to ${worker.name}`);
      })
      .catch((error) => {
        showSnackbar(`Error assigning worker: ${error}`);
      });
  };

  // Status update
  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    
    const statusPayload: {
      requestId: string;
      status: MaintenanceStatus;
      resolutionDetails?: string;
      actualCost?: number;
    } = {
      requestId,
      status: selectedStatus as MaintenanceStatus
    };
    
    if (selectedStatus === 'resolved') {
      statusPayload.resolutionDetails = resolutionDetails;
      if (actualCost) {
        statusPayload.actualCost = parseFloat(actualCost);
      }
    }
    
    dispatch(updateMaintenanceStatus(statusPayload))
      .unwrap()
      .then(() => {
        setShowStatusDialog(false);
        setSelectedStatus('');
        setResolutionDetails('');
        setActualCost('');
        showSnackbar('Status updated successfully');
      })
      .catch((error) => {
        showSnackbar(`Error updating status: ${error}`);
      });
  };

  // Comment submission
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    dispatch(addMaintenanceComment({
      requestId,
      comment: {
        author: user?.name || 'Unknown User',
        authorId: user?.id || 'unknown',
        authorRole: user?.role === 'business_manager' ? 'manager' : 'administrator',
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      }
    }))
      .unwrap()
      .then(() => {
        setCommentText('');
        showSnackbar('Comment added successfully');
      })
      .catch((error) => {
        showSnackbar(`Error adding comment: ${error}`);
      });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading maintenance request...
        </Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>
          {error}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  // If request not found
  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>
          Request not found
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  // Priority related helper methods
  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'low': return theme.colors.primary;
      case 'medium': return theme.colors.tertiary;
      case 'high': return theme.colors.secondary;
      case 'urgent': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };
  
  const getPriorityLabel = (priority: MaintenancePriority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Status related helper methods
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'open': return theme.colors.error;
      case 'in-progress': return theme.colors.tertiary;
      case 'resolved': return theme.colors.primary;
      case 'cancelled': return theme.colors.outline;
      default: return theme.colors.primary;
    }
  };
  
  const getStatusLabel = (status: MaintenanceStatus) => {
    return status === 'in-progress' ? 'In Progress' : 
      status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Surface style={styles.header} elevation={ElevationLevel.Level1}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          Maintenance Detail
        </Text>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.card} elevation={ElevationLevel.Level2}>
          <View style={styles.titleContainer}>
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                {request.title}
              </Text>
              <Chip 
                mode="outlined"
                style={{ 
                  marginTop: 8,
                  alignSelf: 'flex-start',
                  borderColor: getStatusColor(request.status)
                }}
                textStyle={{ color: getStatusColor(request.status) }}
              >
                {getStatusLabel(request.status)}
              </Chip>
            </View>
            
            <Menu
              visible={priorityMenuVisible}
              onDismiss={() => setPriorityMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined"
                  loading={priorityUpdateLoading}
                  onPress={() => setPriorityMenuVisible(true)}
                  icon={() => <Flag size={18} color={getPriorityColor(request.priority)} />}
                  style={{ borderColor: getPriorityColor(request.priority) }}
                  labelStyle={{ color: getPriorityColor(request.priority) }}
                >
                  {getPriorityLabel(request.priority)}
                </Button>
              }
            >
              <Menu.Item 
                leadingIcon="flag" 
                onPress={() => handlePriorityChange('low')} 
                title="Low" 
                titleStyle={{ color: getPriorityColor('low') }}
              />
              <Menu.Item 
                leadingIcon="flag" 
                onPress={() => handlePriorityChange('medium')} 
                title="Medium" 
                titleStyle={{ color: getPriorityColor('medium') }}
              />
              <Menu.Item 
                leadingIcon="flag" 
                onPress={() => handlePriorityChange('high')} 
                title="High" 
                titleStyle={{ color: getPriorityColor('high') }}
              />
              <Menu.Item 
                leadingIcon="flag" 
                onPress={() => handlePriorityChange('urgent')} 
                title="Urgent" 
                titleStyle={{ color: getPriorityColor('urgent') }}
              />
            </Menu>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Details
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {request.description}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Location Information
            </Text>
            <View style={styles.infoRow}>
              <Building size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                {request.buildingName}
              </Text>
            </View>
            {request.unitNumber && (
              <View style={styles.infoRow}>
                <Home size={20} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Unit {request.unitNumber}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <AlertCircle size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                {request.location}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Request Information
            </Text>
            <View style={styles.infoRow}>
              <User size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Submitted by: {request.submitterName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Calendar size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Created: {formatDateTime(request.createdAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Last Updated: {formatDateTime(request.updatedAt)}
              </Text>
            </View>
          </View>
          
          {/* Worker Assignment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelLarge" style={styles.sectionTitle}>
                Assignment
              </Text>
              <Button 
                mode="text" 
                onPress={() => setShowAssignDialog(true)}
                loading={assignmentLoading}
                icon={() => <Edit size={16} color={theme.colors.primary} />}
              >
                {request.assignedToName ? 'Reassign' : 'Assign'}
              </Button>
            </View>
            
            {request.assignedToName ? (
              <View style={styles.assignedWorker}>
                <Avatar.Icon size={40} icon="account" color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary }} />
                <View style={{ marginLeft: 12 }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {request.assignedToName}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {request.status === 'in-progress' ? 'Working on this request' : 'Assigned to this request'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text variant="bodyMedium" style={{ color: theme.colors.outline, fontStyle: 'italic' }}>
                No worker assigned yet
              </Text>
            )}
          </View>
          
          {/* Status Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelLarge" style={styles.sectionTitle}>
                Status
              </Text>
              <Button 
                mode="text" 
                onPress={() => setShowStatusDialog(true)}
                loading={statusUpdateLoading}
                icon={() => <Edit size={16} color={theme.colors.primary} />}
              >
                Update Status
              </Button>
            </View>
            
            <View style={styles.statusInfo}>
              <Chip 
                mode="outlined"
                style={{ borderColor: getStatusColor(request.status) }}
                textStyle={{ color: getStatusColor(request.status) }}
              >
                {getStatusLabel(request.status)}
              </Chip>
              
              {request.startedAt && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                  Started: {formatDateTime(request.startedAt)}
                </Text>
              )}
              
              {request.completedAt && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  Completed: {formatDateTime(request.completedAt)}
                </Text>
              )}
              
              {request.actualCost !== undefined && (
                <View style={styles.costInfo}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    Actual Cost: ${request.actualCost.toFixed(2)}
                  </Text>
                </View>
              )}
              
              {request.resolutionDetails && (
                <View style={styles.resolutionDetails}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                    Resolution Details:
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {request.resolutionDetails}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Comments Section */}
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Comments
            </Text>
            
            {(!request.comments || request.comments.length === 0) ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.outline, fontStyle: 'italic' }}>
                No comments yet
              </Text>
            ) : (
              <View style={styles.commentsContainer}>
                {request.comments.map((comment) => (
                  <Surface key={comment.id} style={styles.commentBubble} elevation={ElevationLevel.Level1}>
                    <View style={styles.commentHeader}>
                      <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                        {comment.author}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {formatDate(comment.timestamp)}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {comment.text}
                    </Text>
                  </Surface>
                ))}
              </View>
            )}
            
            <View style={styles.addCommentContainer}>
              <TextInput
                mode="outlined"
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
                multiline
              />
              <IconButton
                icon={() => <Send size={20} color={theme.colors.primary} />}
                onPress={handleAddComment}
                loading={commentAddLoading}
                disabled={!commentText.trim()}
                style={styles.sendButton}
              />
            </View>
          </View>
          
          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('MaintenanceForm', { requestId })}
              style={{ marginRight: 8 }}
            >
              Edit Request
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
            >
              Back to List
            </Button>
          </View>
        </Surface>
      </ScrollView>
      
      {/* Worker Assignment Dialog */}
      <Portal>
        <Dialog visible={showAssignDialog} onDismiss={() => setShowAssignDialog(false)}>
          <Dialog.Title>Assign Worker</Dialog.Title>
          <Dialog.Content>
            {workersLoading ? (
              <ActivityIndicator style={{ margin: 20 }} />
            ) : workers.length === 0 ? (
              <Text>No workers available</Text>
            ) : (
              <RadioButton.Group onValueChange={value => setSelectedWorkerId(value)} value={selectedWorkerId}>
                {workers.map(worker => (
                  <View key={worker.id} style={styles.workerRadioItem}>
                    <RadioButton value={worker.id} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyLarge">{worker.name}</Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {worker.specialties.join(', ')}
                      </Text>
                      <Chip 
                        mode="outlined"
                        style={{ 
                          marginTop: 4,
                          alignSelf: 'flex-start',
                          borderColor: 
                            worker.availability === 'available' ? theme.colors.primary : 
                            worker.availability === 'busy' ? theme.colors.tertiary : 
                            theme.colors.error
                        }}
                        textStyle={{ 
                          color: 
                            worker.availability === 'available' ? theme.colors.primary : 
                            worker.availability === 'busy' ? theme.colors.tertiary : 
                            theme.colors.error
                        }}
                      >
                        {worker.availability.charAt(0).toUpperCase() + worker.availability.slice(1)}
                      </Chip>
                    </View>
                  </View>
                ))}
              </RadioButton.Group>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button 
              onPress={handleAssignWorker} 
              disabled={!selectedWorkerId || assignmentLoading}
              loading={assignmentLoading}
            >
              Assign
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Status Update Dialog */}
      <Portal>
        <Dialog visible={showStatusDialog} onDismiss={() => setShowStatusDialog(false)}>
          <Dialog.Title>Update Status</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
              Current Status: {getStatusLabel(request.status)}
            </Text>
            
            <RadioButton.Group onValueChange={value => setSelectedStatus(value as MaintenanceStatus)} value={selectedStatus}>
              <View style={styles.statusRadioItem}>
                <RadioButton value="open" />
                <Text>Open</Text>
              </View>
              <View style={styles.statusRadioItem}>
                <RadioButton value="in-progress" />
                <Text>In Progress</Text>
              </View>
              <View style={styles.statusRadioItem}>
                <RadioButton value="resolved" />
                <Text>Resolved</Text>
              </View>
              <View style={styles.statusRadioItem}>
                <RadioButton value="cancelled" />
                <Text>Cancelled</Text>
              </View>
            </RadioButton.Group>
            
            {selectedStatus === 'resolved' && (
              <View style={{ marginTop: 12 }}>
                <TextInput
                  mode="outlined"
                  label="Resolution Details"
                  value={resolutionDetails}
                  onChangeText={setResolutionDetails}
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: 12 }}
                />
                
                <TextInput
                  mode="outlined"
                  label="Actual Cost ($)"
                  value={actualCost}
                  onChangeText={setActualCost}
                  keyboardType="numeric"
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowStatusDialog(false)}>Cancel</Button>
            <Button 
              onPress={handleStatusUpdate} 
              disabled={!selectedStatus || statusUpdateLoading}
              loading={statusUpdateLoading}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

// MaintenanceForm component with proper MD3 styling
export const MaintenanceForm = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentBuilding } = useContextData();
  const buildingId = route.params?.buildingId;
  const unitId = route.params?.unitId;
  const requestId = route.params?.requestId;
  
  const isEditing = !!requestId;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={ElevationLevel.Level1}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          {isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}
        </Text>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.formCard} elevation={ElevationLevel.Level1}>
          <Card.Content>
            <View style={styles.formPlaceholder}>
              <Wrench size={48} color={theme.colors.primary} />
              <Text 
                variant="titleLarge" 
                style={{ 
                  marginTop: 16, 
                  marginBottom: 8,
                  color: theme.colors.onSurface,
                  textAlign: 'center'
                }}
              >
                {isEditing ? 'Edit Request Form' : 'New Request Form'}
              </Text>
              
              {buildingId && (
                <Chip icon="building" style={styles.chip}>
                  Building ID: {buildingId}
                </Chip>
              )}
              
              {unitId && (
                <Chip icon="home" style={styles.chip}>
                  Unit ID: {unitId}
                </Chip>
              )}
              
              {requestId && (
                <Chip icon="file-edit" style={styles.chip}>
                  Request ID: {requestId}
                </Chip>
              )}
              
              <Text 
                variant="bodyMedium" 
                style={{ 
                  marginTop: 16, 
                  marginBottom: 24,
                  color: theme.colors.onSurfaceVariant,
                  textAlign: 'center'
                }}
              >
                This screen is under development. It will allow {isEditing ? 'editing existing' : 'creating new'} maintenance requests with proper form validation and image uploads.
              </Text>
              
              <View style={styles.actions}>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.goBack()}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => navigation.goBack()}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

// MaintenanceWorkers component with proper MD3 styling
export const MaintenanceWorkers = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // Simulate loading state
  const [loading, setLoading] = React.useState(true);
  const [workers, setWorkers] = React.useState<MaintenanceWorker[]>([]);

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Mock data - in a real implementation, this would come from Redux or a service
      setWorkers([
        {
          id: '401',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          specialties: ['electrical', 'appliance'],
          isExternal: true,
          company: 'City Electric Services',
          availability: 'available',
          assignedRequests: 2,
          completedRequests: 17,
          averageResolutionTime: 2.5,
          image: 'https://randomuser.me/api/portraits/men/44.jpg',
        },
        {
          id: '402',
          name: 'Maintenance Team',
          email: 'maintenance@example.com',
          phone: '(555) 234-5678',
          specialties: ['hvac', 'plumbing', 'common_area', 'landscaping'],
          isExternal: false,
          availability: 'busy',
          assignedRequests: 3,
          completedRequests: 42,
          averageResolutionTime: 6.2,
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
        }
      ] as MaintenanceWorker[]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading maintenance workers...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={ElevationLevel.Level1}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          Maintenance Workers
        </Text>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        {workers.map(worker => (
          <Surface 
            key={worker.id}
            style={styles.workerCard} 
            elevation={ElevationLevel.Level1}
            onTouchEnd={() => navigation.navigate('MaintenanceWorkerDetail', { workerId: worker.id })}
          >
            <View style={styles.workerHeader}>
              <Avatar.Image
                size={60}
                source={{ uri: worker.image }}
              />
              <View style={styles.workerInfo}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {worker.name}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {worker.isExternal ? `${worker.company} (External)` : 'Internal Staff'}
                </Text>
                <Chip 
                  mode="outlined"
                  style={{ 
                    marginTop: 4,
                    borderColor: 
                      worker.availability === 'available' ? theme.colors.primary : 
                      worker.availability === 'busy' ? theme.colors.tertiary : 
                      theme.colors.error
                  }}
                  textStyle={{ 
                    color: 
                      worker.availability === 'available' ? theme.colors.primary : 
                      worker.availability === 'busy' ? theme.colors.tertiary : 
                      theme.colors.error
                  }}
                >
                  {worker.availability.charAt(0).toUpperCase() + worker.availability.slice(1)}
                </Chip>
              </View>
              <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => navigation.navigate('MaintenanceWorkerDetail', { workerId: worker.id })}
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.workerStats}>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Assigned</Text>
                <Text variant="titleSmall" style={styles.statValue}>{worker.assignedRequests}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Completed</Text>
                <Text variant="titleSmall" style={styles.statValue}>{worker.completedRequests}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Avg. Time</Text>
                <Text variant="titleSmall" style={styles.statValue}>{worker.averageResolutionTime}h</Text>
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
};

// MaintenanceWorkerDetail component with proper MD3 styling
export const MaintenanceWorkerDetail = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { workerId } = route.params;
  
  // Simulate loading state
  const [loading, setLoading] = React.useState(true);
  const [worker, setWorker] = React.useState<MaintenanceWorker | null>(null);

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Mock data - in a real implementation, this would come from Redux or a service
      setWorker({
        id: workerId,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        specialties: ['electrical', 'appliance'],
        isExternal: true,
        company: 'City Electric Services',
        availability: 'available',
        assignedRequests: 2,
        completedRequests: 17,
        averageResolutionTime: 2.5,
        image: 'https://randomuser.me/api/portraits/men/44.jpg',
      } as MaintenanceWorker);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [workerId]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading worker details...
        </Text>
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>
          Worker not found
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={ElevationLevel.Level1}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          Worker Details
        </Text>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.workerProfileCard} elevation={ElevationLevel.Level2}>
          <View style={styles.workerProfileHeader}>
            <Avatar.Image
              size={100}
              source={{ uri: worker.image }}
              style={{ marginBottom: 16 }}
            />
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
              {worker.name}
            </Text>
            <Chip 
              mode="outlined"
              style={{ 
                marginTop: 8,
                borderColor: 
                  worker.availability === 'available' ? theme.colors.primary : 
                  worker.availability === 'busy' ? theme.colors.tertiary : 
                  theme.colors.error
              }}
              textStyle={{ 
                color: 
                  worker.availability === 'available' ? theme.colors.primary : 
                  worker.availability === 'busy' ? theme.colors.tertiary : 
                  theme.colors.error
              }}
            >
              {worker.availability.charAt(0).toUpperCase() + worker.availability.slice(1)}
            </Chip>
            
            <Text 
              variant="bodyLarge" 
              style={{ 
                marginTop: 8, 
                color: theme.colors.onSurfaceVariant,
                fontStyle: 'italic'
              }}
            >
              {worker.isExternal ? `${worker.company} (External)` : 'Internal Staff'}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Contact Information
            </Text>
            <View style={styles.infoRow}>
              <User size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Email: {worker.email}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <AlertCircle size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Phone: {worker.phone}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Specialties
            </Text>
            <View style={styles.specialtiesContainer}>
              {worker.specialties.map(specialty => (
                <Chip 
                  key={specialty}
                  style={styles.specialtyChip} 
                  mode="flat"
                >
                  {specialty.replace('_', ' ').charAt(0).toUpperCase() + specialty.replace('_', ' ').slice(1)}
                </Chip>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Performance Metrics
            </Text>
            <View style={styles.workerStats}>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Assigned</Text>
                <Text variant="titleMedium" style={styles.statValue}>{worker.assignedRequests}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Completed</Text>
                <Text variant="titleMedium" style={styles.statValue}>{worker.completedRequests}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={styles.statLabel}>Avg. Time</Text>
                <Text variant="titleMedium" style={styles.statValue}>{worker.averageResolutionTime}h</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()}
              icon="clipboard-list"
            >
              View Assigned Tasks
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

// MaintenanceAnalytics component with proper MD3 styling
export const MaintenanceAnalyticsComponent = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const buildingId = route.params?.buildingId;
  
  // Get analytics data from Redux
  const analytics = useAppSelector(selectAnalytics);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);
  
  // Fetch analytics data on mount
  React.useEffect(() => {
    dispatch(fetchAnalytics({ buildingId }));
  }, [dispatch, buildingId]);
  
  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading maintenance analytics...
        </Text>
      </View>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>
          {error}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  // Handle case where analytics is not available
  if (!analytics) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>
          Analytics data not available
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={ElevationLevel.Level1}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurface} />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          Maintenance Analytics
        </Text>
      </Surface>
      
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={styles.analyticsGrid}>
          <Surface style={styles.statsCard} elevation={ElevationLevel.Level1}>
            <FileText size={24} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.statsTitle}>
              {analytics.totalRequests}
            </Text>
            <Text variant="bodySmall" style={styles.statsSubtitle}>
              Total Requests
            </Text>
          </Surface>
          
          <Surface style={styles.statsCard} elevation={ElevationLevel.Level1}>
            <Clock size={24} color={theme.colors.tertiary} />
            <Text variant="titleMedium" style={styles.statsTitle}>
              {analytics.averageResolutionTime}h
            </Text>
            <Text variant="bodySmall" style={styles.statsSubtitle}>
              Avg. Resolution
            </Text>
          </Surface>
          
          <Surface style={styles.statsCard} elevation={ElevationLevel.Level1}>
            <Users size={24} color={theme.colors.secondary} />
            <Text variant="titleMedium" style={styles.statsTitle}>
              {analytics.activeWorkers}
            </Text>
            <Text variant="bodySmall" style={styles.statsSubtitle}>
              Active Workers
            </Text>
          </Surface>
        </View>
        
        {/* Status Breakdown */}
        <Surface style={styles.analyticsCard} elevation={ElevationLevel.Level2}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Status Breakdown
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.statusBreakdown}>
            <View style={styles.statusItem}>
              <Chip 
                mode="outlined" 
                style={{ borderColor: theme.colors.error }}
                textStyle={{ color: theme.colors.error }}
              >
                Open
              </Chip>
              <View style={[styles.statusBar, { width: `${(analytics.statusCounts.open / analytics.totalRequests) * 100}%`, backgroundColor: theme.colors.error }]} />
              <Text style={styles.statusCount}>{analytics.statusCounts.open}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Chip 
                mode="outlined" 
                style={{ borderColor: theme.colors.tertiary }}
                textStyle={{ color: theme.colors.tertiary }}
              >
                In Progress
              </Chip>
              <View style={[styles.statusBar, { width: `${(analytics.statusCounts.inProgress / analytics.totalRequests) * 100}%`, backgroundColor: theme.colors.tertiary }]} />
              <Text style={styles.statusCount}>{analytics.statusCounts.inProgress}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Chip 
                mode="outlined" 
                style={{ borderColor: theme.colors.primary }}
                textStyle={{ color: theme.colors.primary }}
              >
                Resolved
              </Chip>
              <View style={[styles.statusBar, { width: `${(analytics.statusCounts.resolved / analytics.totalRequests) * 100}%`, backgroundColor: theme.colors.primary }]} />
              <Text style={styles.statusCount}>{analytics.statusCounts.resolved}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Chip 
                mode="outlined" 
                style={{ borderColor: theme.colors.outline }}
                textStyle={{ color: theme.colors.outline }}
              >
                Cancelled
              </Chip>
              <View style={[styles.statusBar, { width: `${(analytics.statusCounts.cancelled / analytics.totalRequests) * 100}%`, backgroundColor: theme.colors.outline }]} />
              <Text style={styles.statusCount}>{analytics.statusCounts.cancelled}</Text>
            </View>
          </View>
        </Surface>
        
        {/* Type Breakdown */}
        <Surface style={styles.analyticsCard} elevation={ElevationLevel.Level2}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Request Types
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.typeBreakdown}>
            {Object.entries(analytics.typeCounts).map(([type, count]) => (
              <Surface key={type} style={styles.typeItem} elevation={ElevationLevel.Level1}>
                <Text variant="labelMedium" style={styles.typeLabel}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </Text>
                <Text variant="titleMedium" style={styles.typeCount}>
                  {count}
                </Text>
                <Text variant="bodySmall" style={styles.typePercentage}>
                  {Math.round((count / analytics.totalRequests) * 100)}%
                </Text>
              </Surface>
            ))}
          </View>
        </Surface>
        
        {/* Top Workers */}
        <Surface style={styles.analyticsCard} elevation={ElevationLevel.Level2}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Top Performing Workers
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.workersBreakdown}>
            {analytics.topWorkers.map((worker, index) => (
              <View key={worker.id} style={styles.workerRow}>
                <View style={styles.workerRank}>
                  <Text style={{ fontWeight: 'bold' }}>{index + 1}</Text>
                </View>
                <Avatar.Image 
                  size={40} 
                  source={{ uri: worker.image }} 
                  style={styles.workerAvatar} 
                />
                <View style={styles.workerInfo}>
                  <Text variant="bodyLarge">{worker.name}</Text>
                  <Text variant="bodySmall">{worker.completedRequests} requests completed</Text>
                </View>
                <Chip 
                  mode="outlined"
                  style={{ 
                    borderColor: theme.colors.primary,
                    minWidth: 80,
                    alignItems: 'center'
                  }}
                >
                  {worker.averageResolutionTime}h
                </Chip>
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  formCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  analyticsCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  assignedWorker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusInfo: {
    marginBottom: 12,
  },
  costInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  },
  resolutionDetails: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  },
  commentsContainer: {
    marginBottom: 16,
  },
  commentBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    maxHeight: 80,
  },
  sendButton: {
    marginLeft: 8,
  },
  workerRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statusRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  workerHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  workerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  workerStats: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  workerProfileCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  workerProfileHeader: {
    alignItems: 'center',
    padding: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyChip: {
    margin: 4,
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statsCard: {
    width: '30%',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsTitle: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  statsSubtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  cardHeader: {
    padding: 16,
  },
  statusBreakdown: {
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBar: {
    height: 8,
    marginHorizontal: 8,
    borderRadius: 4,
    minWidth: 20,
  },
  statusCount: {
    minWidth: 30,
    textAlign: 'right',
  },
  typeBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  typeLabel: {
    marginBottom: 8,
  },
  typeCount: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  typePercentage: {
    marginTop: 4,
  },
  workersBreakdown: {
    padding: 16,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  workerRank: {
    width: 24,
    alignItems: 'center',
  },
  workerAvatar: {
    marginHorizontal: 8,
  },
  workerInfo: {
    flex: 1,
    marginLeft: 8,
  },
}); 