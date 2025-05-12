import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Button, Divider, Card, Badge as PaperBadge } from 'react-native-paper';
import { 
  Receipt, 
  Building, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle,
  Edit3,
  Trash,
  CreditCard,
  AlertCircle
} from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import { Header } from '../../../components/Header';
import { fetchPaymentById, deletePayment } from '../../../store/slices/paymentsSlice';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { formatCurrency, formatDate, formatDateTime } from '../../../utils/formatters';
import { STATUS_COLORS } from '../../../utils/constants';

type PaymentDetailsNavigationProp = NativeStackNavigationProp<AdministratorStackParamList, 'PaymentDetails'>;
type PaymentDetailsRouteProp = RouteProp<AdministratorStackParamList, 'PaymentDetails'>;

export const PaymentDetails = () => {
  const route = useRoute<PaymentDetailsRouteProp>();
  const navigation = useNavigation<PaymentDetailsNavigationProp>();
  const { paymentId } = route.params;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const { currentPayment: payment, loading } = useAppSelector((state) => state.payments);
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchPayment();
  }, [paymentId]);
  
  const fetchPayment = async () => {
    try {
      await dispatch(fetchPaymentById(paymentId));
    } catch (error) {
      console.error('Error fetching payment:', error);
      Alert.alert('Error', 'Failed to load payment details. Please try again.');
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayment().finally(() => setRefreshing(false));
  };
  
  const handleEdit = () => {
    navigation.navigate('EditPayment', { paymentId });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Payment',
      'Are you sure you want to delete this payment? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (payment) {
                await dispatch(deletePayment(payment.id));
                Alert.alert('Success', 'Payment deleted successfully');
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error deleting payment:', error);
              Alert.alert('Error', 'Failed to delete payment. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const handleProcessPayment = () => {
    if (payment && payment.status === 'pending' || payment?.status === 'overdue') {
      navigation.navigate('ProcessPayment', { paymentId });
    } else {
      Alert.alert('Info', 'This payment is already processed.');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return STATUS_COLORS.success;
      case 'pending':
        return STATUS_COLORS.warning;
      case 'overdue':
        return STATUS_COLORS.error;
      case 'cancelled':
        return STATUS_COLORS.disabled;
      default:
        return STATUS_COLORS.default;
    }
  };
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={STATUS_COLORS.success} />;
      case 'pending':
        return <Clock size={20} color={STATUS_COLORS.warning} />;
      case 'overdue':
        return <AlertCircle size={20} color={STATUS_COLORS.error} />;
      case 'cancelled':
        return <AlertCircle size={20} color={STATUS_COLORS.disabled} />;
      default:
        return null;
    }
  };
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Payment Details" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading payment details...
          </Text>
        </View>
      </>
    );
  }
  
  if (!payment) {
    return (
      <>
        <Header 
          title="Payment Details" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
            Payment not found
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Payment Details" 
        showBack={true}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Payment Header */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.invoiceLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Invoice #{payment.invoiceNumber}
                </Text>
                <Text style={[styles.amountText, { color: theme.colors.primary }]}>
                  {formatCurrency(payment.amount)}
                </Text>
              </View>
              
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(payment.status) }
              ]}>
                <View style={styles.statusContent}>
                  {getStatusIcon(payment.status)}
                  <Text style={styles.statusText}>
                    {getStatusLabel(payment.status)}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Payment Details */}
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              Payment Details
            </Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <User size={16} color={isDarkMode ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Resident</Text>
              <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                {payment.residentName}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Building size={16} color={isDarkMode ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Building</Text>
              <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                {payment.buildingName}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Calendar size={16} color={isDarkMode ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Due Date</Text>
              <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                {formatDate(payment.dueDate)}
              </Text>
            </View>
            
            {payment.paymentDate && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <CreditCard size={16} color={isDarkMode ? '#aaa' : '#666'} />
                </View>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Payment Date</Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {formatDate(payment.paymentDate)}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <DollarSign size={16} color={isDarkMode ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Amount</Text>
              <Text style={[styles.detailValue, styles.amountValue, { color: theme.colors.primary }]}>
                {formatCurrency(payment.amount)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <FileText size={16} color={isDarkMode ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Type</Text>
              <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
              </Text>
            </View>
            
            <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }]} />
            
            <Text style={[styles.descriptionTitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, { color: isDarkMode ? '#fff' : '#333' }]}>
              {payment.description || 'No description provided'}
            </Text>
          </Card.Content>
        </Card>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]} 
            onPress={handleDelete}
          >
            <Trash size={20} color="#e53935" />
            <Text style={[styles.actionText, { color: '#e53935' }]}>Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(0, 0, 255, 0.1)' }]} 
            onPress={handleEdit}
          >
            <Edit3 size={20} color="#2196f3" />
            <Text style={[styles.actionText, { color: '#2196f3' }]}>Edit</Text>
          </TouchableOpacity>
          
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(0, 128, 0, 0.1)' }]} 
              onPress={handleProcessPayment}
            >
              <CheckCircle size={20} color="#4caf50" />
              <Text style={[styles.actionText, { color: '#4caf50' }]}>Process</Text>
            </TouchableOpacity>
          )}
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
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  amountValue: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionText: {
    fontWeight: '500',
    marginLeft: 8,
  },
});
