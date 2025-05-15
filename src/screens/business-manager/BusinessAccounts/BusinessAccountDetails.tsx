import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Divider, Button, useTheme, Avatar, Chip } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Building2, Briefcase, Users, FileText, ArrowLeft, AlertCircle, TrendingUp, MapPin, Mail, Phone } from 'lucide-react-native';

import { BusinessManagerStackParamList, BusinessAccount } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'BusinessAccountDetails'>;

// Mock data for a single business account
const mockBusinessAccount: BusinessAccount = {
  id: 'ba-1',
  name: 'Riviera Management Corp',
  description: 'Full-service property management company specializing in residential and commercial property management.',
  type: 'Property Management',
  buildings: 12,
  administrators: 5,
  residents: 450,
  address: 'Rruga Myslym Shyri, Nr. 50, Tirana, Albania',
  email: 'info@rivieramanagement.al',
  phone: '+355 69 123 4567',
  logoUrl: 'https://example.com/logo.png',
  createdAt: '2020-05-12T14:22:00Z',
  performanceMetrics: {
    occupancyRate: 92,
    revenueGrowth: 7.5,
    maintenanceCosts: -2.1,
    tenantSatisfaction: 4.2,
  },
  pendingIssues: 8,
};

export const BusinessAccountDetails = ({ route, navigation }: Props) => {
  const { businessAccountId } = route.params;
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch the business account from an API
    setLoading(true);
    setTimeout(() => {
      // Mock API response with our sample data
      setBusinessAccount(mockBusinessAccount);
      setLoading(false);
    }, 1000);
  }, [businessAccountId]);
  
  const handleViewBuildings = () => {
    if (businessAccount) {
      navigation.navigate('BuildingsByBusinessAccount', {
        businessAccountId: businessAccount.id,
        businessAccountName: businessAccount.name
      });
    }
  };
  
  const handleViewDocuments = () => {
    if (businessAccount) {
      navigation.navigate('BusinessAccountDocuments', {
        businessAccountId: businessAccount.id,
        businessAccountName: businessAccount.name
      });
    }
  };
  
  const renderPerformanceIndicator = (value: number, isPositive: boolean = true) => {
    const color = isPositive 
      ? (value >= 0 ? STATUS_COLORS.success : STATUS_COLORS.error) 
      : (value <= 0 ? STATUS_COLORS.success : STATUS_COLORS.error);
    
    const icon = isPositive
      ? (value >= 0 ? <TrendingUp size={12} color={color} /> : <TrendingUp size={12} color={color} style={{ transform: [{ rotate: '180deg' }] }} />)
      : (value <= 0 ? <TrendingUp size={12} color={color} /> : <TrendingUp size={12} color={color} style={{ transform: [{ rotate: '180deg' }] }} />);
    
    return (
      <View style={[styles.indicatorWrapper, { borderColor: color }]}>
        {icon}
        <Text style={[styles.indicatorText, { color }]}>
          {value > 0 ? '+' : ''}{value}%
        </Text>
      </View>
    );
  };
  
  if (loading || !businessAccount) {
    return (
      <View style={styles.container}>
        <Header
          title="Business Account Details"
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <Text>Loading business account details...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header
        title="Business Account Details"
        showBack={true}
        action={{
          icon: <Button mode="contained" onPress={() => console.log('Edit business account')}>Edit</Button>,
          onPress: () => console.log('Edit business account')
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.accountHeader}>
              <Avatar.Icon 
                size={60} 
                icon={(props) => <Briefcase {...props} />} 
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.primary}
              />
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{businessAccount.name}</Text>
                <Text style={styles.accountType}>{businessAccount.type}</Text>
                <View style={styles.dateRow}>
                  <Text style={styles.createdAt}>
                    Since {new Date(businessAccount.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              {businessAccount.pendingIssues && businessAccount.pendingIssues > 0 && (
                <Chip 
                  icon={() => <AlertCircle size={14} color={STATUS_COLORS.error} />}
                  style={[styles.issueChip, { backgroundColor: `${STATUS_COLORS.error}20` }]}
                  textStyle={{ color: STATUS_COLORS.error, fontSize: 12 }}
                >
                  {businessAccount.pendingIssues} Issues
                </Chip>
              )}
            </View>
            
            {businessAccount.description && (
              <Text style={styles.description}>{businessAccount.description}</Text>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <MapPin size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{businessAccount.address}</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{businessAccount.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{businessAccount.phone}</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Buildings</Text>
                <Text style={styles.metricValue}>{businessAccount.buildings}</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Administrators</Text>
                <Text style={styles.metricValue}>{businessAccount.administrators}</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Residents</Text>
                <Text style={styles.metricValue}>{businessAccount.residents}</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Occupancy</Text>
                <Text style={styles.metricValue}>{businessAccount.performanceMetrics?.occupancyRate}%</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Revenue Growth</Text>
                <View style={styles.metricValueRow}>
                  {businessAccount.performanceMetrics && renderPerformanceIndicator(businessAccount.performanceMetrics.revenueGrowth)}
                </View>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Maintenance Costs</Text>
                <View style={styles.metricValueRow}>
                  {businessAccount.performanceMetrics && renderPerformanceIndicator(businessAccount.performanceMetrics.maintenanceCosts, false)}
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewBuildings}
          >
            <Building2 size={24} color={theme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Buildings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleViewDocuments}
          >
            <FileText size={24} color={theme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('View administrators')}
          >
            <Users size={24} color={theme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Administrators</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('View financial reports')}
          >
            <TrendingUp size={24} color={theme.colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Financial Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountType: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  dateRow: {
    marginTop: 4,
  },
  createdAt: {
    fontSize: 12,
    opacity: 0.5,
  },
  issueChip: {
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  infoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
  },
  statsCard: {
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionButton: {
    width: '50%',
    padding: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 