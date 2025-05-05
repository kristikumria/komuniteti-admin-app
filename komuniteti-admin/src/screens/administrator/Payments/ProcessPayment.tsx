import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, TextInput, Divider, RadioButton } from 'react-native-paper';
import { Calendar, CreditCard, CheckCircle } from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { fetchPaymentById, processPayment } from '../../../store/slices/paymentsSlice';
import { AdministratorStackParamList, Payment } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { STATUS_COLORS } from '../../../utils/constants';

type ProcessPaymentNavigationProp = NativeStackNavigationProp<AdministratorStackParamList, 'ProcessPayment'>;
type ProcessPaymentRouteProp = RouteProp<AdministratorStackParamList, 'ProcessPayment'>;

export const ProcessPayment = () => {
  const route = useRoute<ProcessPaymentRouteProp>();
  const navigation = useNavigation<ProcessPaymentNavigationProp>();
  const { paymentId } = route.params;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const { currentPayment: payment, loading } = useAppSelector((state) => state.payments);
  
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'bankTransfer' | 'cash' | 'other'>('creditCard');
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);
  
  const fetchPaymentDetails = async () => {
    try {
      await dispatch(fetchPaymentById(paymentId));
    } catch (error) {
      console.error('Error fetching payment:', error);
      Alert.alert('Error', 'Failed to load payment details. Please try again.');
    }
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };
  
  const handleProcessPayment = async () => {
    if (!payment) return;
    
    setProcessing(true);
    try {
      await dispatch(processPayment({
        paymentId: payment.id,
        paymentDetails: {
          paymentMethod,
          paymentDate: paymentDate.toISOString(),
        }
      }));
      
      Alert.alert(
        'Success',
        'Payment processed successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PaymentDetails', { paymentId })
          }
        ]
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  if (!payment) {
    return (
      <>
        <Header 
          title="Process Payment" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
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
        title="Process Payment" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Summary Card */}
        <View style={{ borderRadius: 8 }}>
          <View style={{ overflow: 'hidden', borderRadius: 8 }}>
            <View style={[styles.summaryCard]}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>
                  Payment Summary
                </Text>
              </View>
              
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Invoice
                  </Text>
                  <Text style={[styles.summaryValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.invoiceNumber}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Resident
                  </Text>
                  <Text style={[styles.summaryValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.residentName}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Building
                  </Text>
                  <Text style={[styles.summaryValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.buildingName}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Type
                  </Text>
                  <Text style={[styles.summaryValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Due Date
                  </Text>
                  <Text style={[styles.summaryValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {formatDate(payment.dueDate)}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.amountRow}>
                  <Text style={[styles.amountLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.amountValue, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Payment Method */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Payment Method
          </Text>
          
          <RadioButton.Group onValueChange={(value) => setPaymentMethod(value as any)} value={paymentMethod}>
            <View style={styles.radioItem}>
              <RadioButton.Android value="creditCard" color={theme.colors.primary} />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Credit Card</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton.Android value="bankTransfer" color={theme.colors.primary} />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Bank Transfer</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton.Android value="cash" color={theme.colors.primary} />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Cash</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton.Android value="other" color={theme.colors.primary} />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Other</Text>
            </View>
          </RadioButton.Group>
        </View>
        
        {/* Payment Date */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Payment Date
          </Text>
          
          <TouchableOpacity
            style={[
              styles.dateInput,
              { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
              {paymentDate.toLocaleDateString()}
            </Text>
            <Calendar size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={paymentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
        
        {/* Additional Notes */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Additional Notes (Optional)
          </Text>
          
          <TextInput
            mode="outlined"
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Enter any additional notes about this payment"
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Process Button */}
        <Button
          mode="contained"
          icon={props => <CreditCard {...props} />}
          style={styles.processButton}
          contentStyle={styles.processButtonContent}
          onPress={handleProcessPayment}
          loading={processing}
          disabled={processing}
        >
          Process Payment
        </Button>
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
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summaryCard: {
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#2196F3',
  },
  summaryHeader: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryContent: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
  },
  notesInput: {
    backgroundColor: 'transparent',
  },
  processButton: {
    marginVertical: 24,
    paddingVertical: 8,
  },
  processButtonContent: {
    paddingVertical: 8,
  },
}); 