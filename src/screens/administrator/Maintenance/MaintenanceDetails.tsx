import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, useTheme, Card, Divider, Chip, Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList, Report } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { AlertCircle, Building, Calendar, Clipboard, Flag, MapPin, MessageSquare, User, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { useAppSelector } from '../../../store/hooks';
import { MOCK_MAINTENANCE } from './MaintenanceList'; // Import the mock data, in real app would come from API

// Update Props type to include hideHeader
interface Props extends NativeStackScreenProps<AdministratorStackParamList, 'MaintenanceDetails'> {
  hideHeader?: boolean;
}

export const MaintenanceDetails = ({ route, navigation, hideHeader = false }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { maintenanceId } = route.params;
  const [maintenance, setMaintenance] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const foundMaintenance = MOCK_MAINTENANCE.find(m => m.id === maintenanceId);
      setMaintenance(foundMaintenance || null);
      setLoading(false);
    }, 800);
  }, [maintenanceId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return theme.colors.error;
      case 'in-progress':
        return theme.colors.primary;
      case 'resolved':
        return '#4CAF50';
      default:
        return theme.colors.primary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#D32F2F';
      case 'high':
        return '#F57C00';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#8BC34A';
      default:
        return theme.colors.primary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={20} color={getStatusColor(status)} />;
      case 'in-progress':
        return <Clock size={20} color={getStatusColor(status)} />;
      case 'resolved':
        return <CheckCircle size={20} color={getStatusColor(status)} />;
      default:
        return <AlertCircle size={20} color={getStatusColor(status)} />;
    }
  };

  if (loading) {
    return (
      <>
        {!hideHeader && <Header title="Maintenance Details" showBack={true} />}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Loading maintenance details...</Text>
        </View>
      </>
    );
  }

  if (!maintenance) {
    return (
      <>
        {!hideHeader && <Header title="Maintenance Details" showBack={true} />}
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={theme.colors.error} />
          <Text style={styles.errorText}>Maintenance request not found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>Go Back</Button>
        </View>
      </>
    );
  }

  return (
    <>
      {!hideHeader && <Header title="Maintenance Details" showBack={true} />}
      <ScrollView 
        style={[
          styles.container, 
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }]}>
          <Card.Content>
            <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
              {maintenance.title}
            </Text>
            
            <View style={styles.chips}>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(maintenance.status) }]}>
                {getStatusIcon(maintenance.status)}
                <Text style={styles.statusText}>{maintenance.status.toUpperCase()}</Text>
              </View>
              
              <Chip 
                style={[styles.priorityChip, { backgroundColor: getPriorityColor(maintenance.priority) }]}
                textStyle={styles.priorityText}
              >
                {maintenance.priority.toUpperCase()}
              </Chip>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <User size={18} color={isDarkMode ? '#BBB' : '#666'} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#BBB' : '#666' }]}>Submitted by:</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>{maintenance.submitter}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar size={18} color={isDarkMode ? '#BBB' : '#666'} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#BBB' : '#666' }]}>Date:</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>
                {format(new Date(maintenance.date), 'MMM dd, yyyy')}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin size={18} color={isDarkMode ? '#BBB' : '#666'} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#BBB' : '#666' }]}>Location:</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>{maintenance.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Building size={18} color={isDarkMode ? '#BBB' : '#666'} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#BBB' : '#666' }]}>Building:</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>{maintenance.building}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <User size={18} color={isDarkMode ? '#BBB' : '#666'} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: isDarkMode ? '#BBB' : '#666' }]}>Assigned to:</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>{maintenance.assignedTo}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#BBB' : '#666' }]}>Description</Text>
            <Text style={[styles.description, { color: isDarkMode ? 'white' : 'black' }]}>
              {maintenance.description}
            </Text>
            
            {maintenance.images && maintenance.images.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#BBB' : '#666', marginTop: 16 }]}>Images</Text>
                <View style={styles.imageContainer}>
                  {maintenance.images.map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.image} />
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={() => {}} 
            style={[styles.button, { backgroundColor: '#4CAF50' }]}
          >
            Mark as Resolved
          </Button>
          <Button 
            mode="contained" 
            onPress={() => {}} 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Assign
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
  priorityChip: {
    borderRadius: 16,
  },
  priorityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  image: {
    width: '48%',
    aspectRatio: 1.33,
    borderRadius: 8,
    margin: '1%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 