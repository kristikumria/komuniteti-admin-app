import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, TextInput, Button, HelperText, Chip, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChevronDown, Calendar, Search } from 'lucide-react-native';

import { Payment, Resident, Building } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/formatters';

// Form validation schema
const paymentSchema = yup.object({
  residentId: yup.string().required('Resident is required'),
  buildingId: yup.string().required('Building is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  type: yup.string().required('Payment type is required'),
  dueDate: yup.string().required('Due date is required'),
  description: yup.string().required('Description is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
});

export type PaymentFormData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'residentName' | 'buildingName' | 'status'>;

interface PaymentFormProps {
  initialData?: Partial<PaymentFormData>;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting: boolean;
  buildings: Building[];
  residents: Resident[];
}

export const PaymentForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  buildings,
  residents,
}: PaymentFormProps) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [showResidentMenu, setShowResidentMenu] = useState(false);
  const [showPaymentMethodMenu, setShowPaymentMethodMenu] = useState(false);
  
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [buildingSearchQuery, setBuildingSearchQuery] = useState('');
  const [residentSearchQuery, setResidentSearchQuery] = useState('');
  
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      residentId: initialData?.residentId || '',
      buildingId: initialData?.buildingId || '',
      amount: initialData?.amount || 0,
      type: initialData?.type || 'rent',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString() : new Date().toISOString(),
      paymentDate: initialData?.paymentDate,
      paymentMethod: initialData?.paymentMethod,
      description: initialData?.description || '',
      invoiceNumber: initialData?.invoiceNumber || `INV-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${Math.floor(Math.random() * 1000)}`,
    },
  });
  
  const watchType = watch('type');
  const watchPaymentMethod = watch('paymentMethod');
  
  // Initialize selected building and resident from initial data
  useEffect(() => {
    if (initialData?.buildingId) {
      const building = buildings.find(b => b.id === initialData.buildingId);
      if (building) {
        setSelectedBuilding(building);
      }
    }
    
    if (initialData?.residentId) {
      const resident = residents.find(r => r.id === initialData.residentId);
      if (resident) {
        setSelectedResident(resident);
      }
    }
  }, [initialData, buildings, residents]);
  
  const filteredBuildings = buildingSearchQuery.length > 0
    ? buildings.filter(building => 
        building.name.toLowerCase().includes(buildingSearchQuery.toLowerCase()) ||
        building.address.toLowerCase().includes(buildingSearchQuery.toLowerCase())
      )
    : buildings;
    
  const filteredResidents = residentSearchQuery.length > 0
    ? residents.filter(resident => 
        resident.name.toLowerCase().includes(residentSearchQuery.toLowerCase()) ||
        resident.unit.toLowerCase().includes(residentSearchQuery.toLowerCase())
      )
    : selectedBuilding
      ? residents.filter(resident => resident.building === selectedBuilding.name)
      : residents;
  
  const paymentTypes = [
    { id: 'rent', label: 'Rent' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'other', label: 'Other' },
  ];
  
  const paymentMethods = [
    { id: 'creditCard', label: 'Credit Card' },
    { id: 'bankTransfer', label: 'Bank Transfer' },
    { id: 'cash', label: 'Cash' },
    { id: 'other', label: 'Other' },
  ];
  
  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setValue('dueDate', selectedDate.toISOString());
    }
  };
  
  const handlePaymentDateChange = (event: any, selectedDate?: Date) => {
    setShowPaymentDatePicker(false);
    if (selectedDate) {
      setValue('paymentDate', selectedDate.toISOString());
    }
  };
  
  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setValue('buildingId', building.id);
    setShowBuildingMenu(false);
    setBuildingSearchQuery('');
    
    // Clear resident if building changes
    if (selectedResident && selectedResident.building !== building.name) {
      setSelectedResident(null);
      setValue('residentId', '');
    }
  };
  
  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setValue('residentId', resident.id);
    setShowResidentMenu(false);
    setResidentSearchQuery('');
    
    // Set building if resident is selected
    if (!selectedBuilding) {
      const building = buildings.find(b => b.name === resident.building);
      if (building) {
        setSelectedBuilding(building);
        setValue('buildingId', building.id);
      }
    }
  };
  
  const handleTypeSelect = (type: string) => {
    setValue('type', type as 'rent' | 'maintenance' | 'utilities' | 'other');
    setShowTypeMenu(false);
  };
  
  const handlePaymentMethodSelect = (method: string) => {
    setValue('paymentMethod', method as 'creditCard' | 'bankTransfer' | 'cash' | 'other');
    setShowPaymentMethodMenu(false);
  };
  
  const submitForm = (data: PaymentFormData) => {
    onSubmit(data);
  };
  
  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}
    >
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#333' }
          ]}
        >
          General Information
        </Text>
        
        {/* Building Selection */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Building
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              { backgroundColor: isDarkMode ? '#333' : '#fff' }
            ]}
            onPress={() => setShowBuildingMenu(true)}
          >
            <Text style={{ color: selectedBuilding ? (isDarkMode ? '#fff' : '#333') : '#999' }}>
              {selectedBuilding ? selectedBuilding.name : 'Select a building'}
            </Text>
            <ChevronDown size={20} color={isDarkMode ? '#aaa' : '#666'} />
          </TouchableOpacity>
          {errors.buildingId && (
            <HelperText type="error">{errors.buildingId.message}</HelperText>
          )}
          
          <Menu
            visible={showBuildingMenu}
            onDismiss={() => setShowBuildingMenu(false)}
            anchor={{ x: 0, y: 0 }}
            style={[
              styles.menu,
              { backgroundColor: isDarkMode ? '#333' : '#fff' }
            ]}
          >
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search buildings..."
                value={buildingSearchQuery}
                onChangeText={setBuildingSearchQuery}
                right={<TextInput.Icon icon={() => <Search size={20} color={theme.colors.primary} />} />}
                style={styles.searchInput}
              />
            </View>
            <Divider />
            <ScrollView style={styles.menuContent} keyboardShouldPersistTaps="handled">
              {filteredBuildings.map((building) => (
                <Menu.Item
                  key={building.id}
                  title={building.name}
                  style={[
                    selectedBuilding?.id === building.id && {
                      backgroundColor: theme.colors.primary + '20',
                    }
                  ]}
                  onPress={() => handleBuildingSelect(building)}
                />
              ))}
            </ScrollView>
          </Menu>
        </View>
        
        {/* Resident Selection */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Resident
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              { backgroundColor: isDarkMode ? '#333' : '#fff' }
            ]}
            onPress={() => setShowResidentMenu(true)}
          >
            <Text style={{ color: selectedResident ? (isDarkMode ? '#fff' : '#333') : '#999' }}>
              {selectedResident ? selectedResident.name : 'Select a resident'}
            </Text>
            <ChevronDown size={20} color={isDarkMode ? '#aaa' : '#666'} />
          </TouchableOpacity>
          {errors.residentId && (
            <HelperText type="error">{errors.residentId.message}</HelperText>
          )}
          
          <Menu
            visible={showResidentMenu}
            onDismiss={() => setShowResidentMenu(false)}
            anchor={{ x: 0, y: 0 }}
            style={[
              styles.menu,
              { backgroundColor: isDarkMode ? '#333' : '#fff' }
            ]}
          >
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search residents..."
                value={residentSearchQuery}
                onChangeText={setResidentSearchQuery}
                right={<TextInput.Icon icon={() => <Search size={20} color={theme.colors.primary} />} />}
                style={styles.searchInput}
              />
            </View>
            <Divider />
            <ScrollView style={styles.menuContent} keyboardShouldPersistTaps="handled">
              {filteredResidents.map((resident) => (
                <Menu.Item
                  key={resident.id}
                  title={`${resident.name} (${resident.unit})`}
                  style={[
                    selectedResident?.id === resident.id && {
                      backgroundColor: theme.colors.primary + '20',
                    }
                  ]}
                  onPress={() => handleResidentSelect(resident)}
                />
              ))}
            </ScrollView>
          </Menu>
        </View>
        
        {/* Payment Type */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Payment Type
          </Text>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <View>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    { backgroundColor: isDarkMode ? '#333' : '#fff' }
                  ]}
                  onPress={() => setShowTypeMenu(true)}
                >
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
                    {watchType ? paymentTypes.find(t => t.id === watchType)?.label : 'Select payment type'}
                  </Text>
                  <ChevronDown size={20} color={isDarkMode ? '#aaa' : '#666'} />
                </TouchableOpacity>
                
                <Menu
                  visible={showTypeMenu}
                  onDismiss={() => setShowTypeMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={{ width: '100%' }}
                >
                  {paymentTypes.map((type) => (
                    <Menu.Item
                      key={type.id}
                      title={type.label}
                      onPress={() => handleTypeSelect(type.id)}
                      style={field.value === type.id ? { backgroundColor: theme.colors.primary + '20' } : {}}
                    />
                  ))}
                </Menu>
              </View>
            )}
          />
          {errors.type && (
            <HelperText type="error">{errors.type.message}</HelperText>
          )}
        </View>
        
        {/* Payment Amount */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Amount
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                style={styles.input}
                error={!!errors.amount}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                left={<TextInput.Affix text="$" />}
              />
            )}
          />
          {errors.amount && (
            <HelperText type="error">{errors.amount.message}</HelperText>
          )}
        </View>
        
        {/* Invoice Number */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Invoice Number
          </Text>
          <Controller
            control={control}
            name="invoiceNumber"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.invoiceNumber}
                placeholder="Enter invoice number"
                placeholderTextColor="#999"
              />
            )}
          />
          {errors.invoiceNumber && (
            <HelperText type="error">{errors.invoiceNumber.message}</HelperText>
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#333' }
          ]}
        >
          Dates
        </Text>
        
        {/* Due Date */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Due Date
          </Text>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { value } }) => (
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  { backgroundColor: isDarkMode ? '#333' : '#fff' }
                ]}
                onPress={() => setShowDueDatePicker(true)}
              >
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
                  {new Date(value).toLocaleDateString()}
                </Text>
                <Calendar size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          />
          {showDueDatePicker && (
            <DateTimePicker
              value={new Date(watch('dueDate'))}
              mode="date"
              display="default"
              onChange={handleDueDateChange}
            />
          )}
          {errors.dueDate && (
            <HelperText type="error">{errors.dueDate.message}</HelperText>
          )}
        </View>
        
        {/* Payment Date */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Payment Date (optional)
          </Text>
          <Controller
            control={control}
            name="paymentDate"
            render={({ field: { value } }) => (
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  { backgroundColor: isDarkMode ? '#333' : '#fff' }
                ]}
                onPress={() => setShowPaymentDatePicker(true)}
              >
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
                  {value ? new Date(value).toLocaleDateString() : 'Select payment date'}
                </Text>
                <Calendar size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          />
          {showPaymentDatePicker && (
            <DateTimePicker
              value={watch('paymentDate') ? new Date(watch('paymentDate') as string) : new Date()}
              mode="date"
              display="default"
              onChange={handlePaymentDateChange}
            />
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text 
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? '#fff' : '#333' }
          ]}
        >
          Payment Details
        </Text>
        
        {/* Payment Method */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Payment Method (optional)
          </Text>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <View>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    { backgroundColor: isDarkMode ? '#333' : '#fff' }
                  ]}
                  onPress={() => setShowPaymentMethodMenu(true)}
                >
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
                    {watchPaymentMethod 
                      ? paymentMethods.find(m => m.id === watchPaymentMethod)?.label 
                      : 'Select payment method'
                    }
                  </Text>
                  <ChevronDown size={20} color={isDarkMode ? '#aaa' : '#666'} />
                </TouchableOpacity>
                
                <Menu
                  visible={showPaymentMethodMenu}
                  onDismiss={() => setShowPaymentMethodMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={{ width: '100%' }}
                >
                  {paymentMethods.map((method) => (
                    <Menu.Item
                      key={method.id}
                      title={method.label}
                      onPress={() => handlePaymentMethodSelect(method.id)}
                      style={field.value === method.id ? { backgroundColor: theme.colors.primary + '20' } : {}}
                    />
                  ))}
                </Menu>
              </View>
            )}
          />
        </View>
        
        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.textArea}
                multiline
                numberOfLines={4}
                error={!!errors.description}
                placeholder="Enter payment description"
                placeholderTextColor="#999"
              />
            )}
          />
          {errors.description && (
            <HelperText type="error">{errors.description.message}</HelperText>
          )}
        </View>
      </View>
      
      <Button
        mode="contained"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        {initialData?.residentId ? 'Update Payment' : 'Create Payment'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  textArea: {
    marginBottom: 4,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 4,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 4,
  },
  menu: {
    width: '90%',
    maxHeight: 300,
  },
  menuContent: {
    maxHeight: 250,
  },
  searchContainer: {
    padding: 8,
  },
  searchInput: {
    marginBottom: 0,
  },
  submitButton: {
    marginVertical: 24,
  },
}); 