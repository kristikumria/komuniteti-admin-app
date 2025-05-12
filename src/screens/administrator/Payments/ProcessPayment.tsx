import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, TextInput, Divider, RadioButton } from 'react-native-paper';
import { Calendar, CreditCard, CheckCircle } from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Header } from '../../../components/Header';
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
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Process Payment" 
        showBack={true}
      />
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
            Payment Details
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Invoice:</Text>
            <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#333' }]}>{payment.invoiceNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Resident:</Text>
            <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#333' }]}>{payment.residentName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Building:</Text>
            <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#333' }]}>{payment.buildingName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Amount:</Text>
            <Text style={[styles.amount, { color: theme.colors.primary }]}>{formatCurrency(payment.amount)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Due Date:</Text>
            <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#333' }]}>{formatDate(payment.dueDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[payment.status] }]}>
              <Text style={styles.statusText}>{payment.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
            Process Payment
          </Text>
          
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ddd' : '#555' }]}>
            Payment Method
          </Text>
          
          <RadioButton.Group onValueChange={(value) => setPaymentMethod(value as any)} value={paymentMethod}>
            <View style={styles.radioRow}>
              <RadioButton value="creditCard" />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Credit Card</Text>
            </View>
            
            <View style={styles.radioRow}>
              <RadioButton value="bankTransfer" />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Bank Transfer</Text>
            </View>
            
            <View style={styles.radioRow}>
              <RadioButton value="cash" />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Cash</Text>
            </View>
            
            <View style={styles.radioRow}>
              <RadioButton value="other" />
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Other</Text>
            </View>
          </RadioButton.Group>
          
          <Divider style={styles.divider} />
          
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ddd' : '#555' }]}>
            Payment Date
          </Text>
          
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={[styles.dateText, { color: isDarkMode ? '#fff' : '#333' }]}>
              {formatDate(paymentDate.toISOString())}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={paymentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          
          <Divider style={styles.divider} />
          
          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
          
          <View style={styles.actionContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={processing}
            >
              Cancel
            </Button>
            
            <Button
              mode="contained"
              onPress={handleProcessPayment}
              style={styles.processButton}
              loading={processing}
              disabled={processing}
            >
              Process Payment
            </Button>
          </View>
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
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    width: '40%',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    marginVertical: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
  },
  notesInput: {
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  processButton: {
    minWidth: 150,
  },
});
