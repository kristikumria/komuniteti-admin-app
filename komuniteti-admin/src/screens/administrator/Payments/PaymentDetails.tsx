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
import { SideMenu } from '../../../components/SideMenu';
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
  const [menuVisible, setMenuVisible] = useState(false);
  
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
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading payment details...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  if (!payment) {
    return (
      <>
        <Header 
          title="Payment Details" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.notFoundContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
            Payment not found or has been deleted.
          </Text>
          <Button 
            mode="contained" 
            style={{ marginTop: 16 }}
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Button>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Payment Details" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header Card */}
        <View style={{ borderRadius: 12 }}>
          <View style={{ overflow: 'hidden', borderRadius: 12 }}>
            <Card 
              style={[styles.headerCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
              mode="elevated"
            >
              <View style={styles.headerContent}>
                <View style={styles.idContainer}>
                  <Receipt size={24} color={theme.colors.primary} style={styles.icon} />
                  <View>
                    <Text style={[styles.invoiceNumber, { color: isDarkMode ? '#fff' : '#333' }]}>
                      {payment.invoiceNumber}
                    </Text>
                    <Text style={[styles.idText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                      ID: {payment.id}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.amountContainer}>
                  <Text style={[styles.amountLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Amount
                  </Text>
                  <Text style={[styles.amount, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Text style={[styles.statusLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Status
                  </Text>
                  <View style={styles.statusValue}>
                    {getStatusIcon(payment.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status), marginLeft: 4 }]}>
                      {getStatusLabel(payment.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={[styles.statusLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Type
                  </Text>
                  <Text style={[styles.statusText, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={[styles.statusLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Due Date
                  </Text>
                  <Text style={[styles.statusText, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {formatDate(payment.dueDate)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
        
        {/* Details Section */}
        <Card 
          style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
          mode="elevated"
        >
          <Card.Title 
            title="Payment Details" 
            titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
          />
          <Card.Content>
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <User size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Resident
                </Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {payment.residentName}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Building size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Building
                </Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {payment.buildingName}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <FileText size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Description
                </Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {payment.description}
                </Text>
              </View>
            </View>
            
            {payment.paymentMethod && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <CreditCard size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Payment Method
                  </Text>
                  <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                </View>
              </View>
            )}
            
            {payment.paymentDate && (
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Calendar size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Payment Date
                  </Text>
                  <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {formatDate(payment.paymentDate)}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Created
                </Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {formatDateTime(payment.createdAt)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  Last Updated
                </Text>
                <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {formatDateTime(payment.updatedAt)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {(payment.status === 'pending' || payment.status === 'overdue') && (
            <Button 
              mode="contained" 
              icon={props => <CreditCard {...props} />}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.actionButtonContent}
              onPress={handleProcessPayment}
            >
              Process Payment
            </Button>
          )}
          
          <Button 
            mode="outlined" 
            icon={props => <Edit3 {...props} />}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            onPress={handleEdit}
          >
            Edit
          </Button>
          
          <Button 
            mode="outlined" 
            icon={props => <Trash {...props} />}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            contentStyle={styles.actionButtonContent}
            textColor={theme.colors.error}
            onPress={handleDelete}
          >
            Delete
          </Button>
        </View>
      </ScrollView>
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  idText: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flexWrap: 'wrap',
  },
  statusItem: {
    minWidth: '30%',
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
  },
  actionButtonsContainer: {
    marginBottom: 32,
    flexDirection: 'column',
  },
  actionButton: {
    marginBottom: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
}); 