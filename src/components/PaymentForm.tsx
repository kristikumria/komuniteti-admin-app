import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText, Chip, Menu, Divider, Surface } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChevronDown, Calendar, Search } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

import { Payment, Resident, Building } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/formatters';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

export type PaymentFormData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'residentName' | 'buildingName' | 'status'>;

// Form validation schema
const paymentSchema = yup.object({
  residentId: yup.string().required('Resident is required'),
  buildingId: yup.string().required('Building is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  type: yup.string().required('Payment type is required'),
  dueDate: yup.string().required('Due date is required'),
  description: yup.string().required('Description is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  paymentDate: yup.string().optional(),
  paymentMethod: yup.string().optional(),
});

interface PaymentFormProps {
  initialData?: Partial<PaymentFormData>;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting: boolean;
  buildings: Building[];
  residents: Resident[];
}

/**
 * A form component for creating and updating payment information.
 * Follows Material Design 3 guidelines with proper field organization, validation,
 * animations, and accessibility features.
 * 
 * @example
 * <PaymentForm
 *   initialData={paymentData}
 *   onSubmit={handleSubmit}
 *   isSubmitting={isSubmitting}
 *   buildings={buildings}
 *   residents={residents}
 * />
 */
export const PaymentForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  buildings,
  residents,
}: PaymentFormProps) => {
  const { theme } = useThemedStyles();
  
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

  /**
   * Renders a form section with a title and children
   */
  const FormSection = ({ 
    title, 
    children, 
    index = 0 
  }: { 
    title: string; 
    children: React.ReactNode; 
    index?: number;
  }) => (
    <Animated.View
      entering={FadeInUp.delay(100 * index).springify()}
      exiting={FadeOut}
    >
      <Surface style={styles(theme).section} elevation={ElevationLevel.Level1}>
        <View style={styles(theme).overflowContainer}>
          <Text variant="titleMedium" style={styles(theme).sectionTitle}>
            {title}
          </Text>
          {children}
        </View>
      </Surface>
    </Animated.View>
  );
  
  /**
   * Renders a form field with a label and optional error message
   */
  const FormField = ({ 
    label, 
    error, 
    children 
  }: { 
    label: string; 
    error?: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles(theme).inputContainer}>
      <Text variant="bodyMedium" style={styles(theme).label}>
        {label}
      </Text>
      {children}
      {error && (
        <Animated.View
          entering={FadeInUp.springify()}
          exiting={FadeOut}
        >
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        </Animated.View>
      )}
    </View>
  );
  
  return (
    <ScrollView 
      style={styles(theme).container}
      contentContainerStyle={styles(theme).contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <FormSection title="General Information" index={0}>
        {/* Building Selection */}
        <FormField 
          label="Building" 
          error={errors.buildingId?.message}
        >
          <TouchableOpacity
            style={styles(theme).dropdown}
            onPress={() => setShowBuildingMenu(true)}
            accessibilityRole="button"
            accessibilityLabel="Select building"
            accessibilityState={{ disabled: isSubmitting }}
          >
            <Text style={styles(theme).dropdownText}>
              {selectedBuilding ? selectedBuilding.name : 'Select a building'}
            </Text>
            <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <Menu
            visible={showBuildingMenu}
            onDismiss={() => setShowBuildingMenu(false)}
            anchor={{ x: 0, y: 0 }}
            style={styles(theme).menu}
            contentStyle={styles(theme).menuContent}
          >
            <View style={styles(theme).searchContainer}>
              <TextInput
                mode="outlined"
                placeholder="Search buildings..."
                value={buildingSearchQuery}
                onChangeText={setBuildingSearchQuery}
                right={<TextInput.Icon icon={() => <Search size={20} color={theme.colors.primary} />} />}
                style={styles(theme).searchInput}
                outlineStyle={{ borderRadius: theme.roundness }}
              />
            </View>
            <Divider />
            <ScrollView style={styles(theme).menuItems} keyboardShouldPersistTaps="handled">
              {filteredBuildings.map((building) => (
                <Menu.Item
                  key={building.id}
                  title={building.name}
                  style={[
                    selectedBuilding?.id === building.id && styles(theme).selectedMenuItem
                  ]}
                  onPress={() => handleBuildingSelect(building)}
                />
              ))}
            </ScrollView>
          </Menu>
        </FormField>
        
        {/* Resident Selection */}
        <FormField 
          label="Resident" 
          error={errors.residentId?.message}
        >
          <TouchableOpacity
            style={styles(theme).dropdown}
            onPress={() => setShowResidentMenu(true)}
            accessibilityRole="button"
            accessibilityLabel="Select resident"
            accessibilityState={{ disabled: isSubmitting }}
          >
            <Text style={styles(theme).dropdownText}>
              {selectedResident ? selectedResident.name : 'Select a resident'}
            </Text>
            <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <Menu
            visible={showResidentMenu}
            onDismiss={() => setShowResidentMenu(false)}
            anchor={{ x: 0, y: 0 }}
            style={styles(theme).menu}
            contentStyle={styles(theme).menuContent}
          >
            <View style={styles(theme).searchContainer}>
              <TextInput
                mode="outlined"
                placeholder="Search residents..."
                value={residentSearchQuery}
                onChangeText={setResidentSearchQuery}
                right={<TextInput.Icon icon={() => <Search size={20} color={theme.colors.primary} />} />}
                style={styles(theme).searchInput}
                outlineStyle={{ borderRadius: theme.roundness }}
              />
            </View>
            <Divider />
            <ScrollView style={styles(theme).menuItems} keyboardShouldPersistTaps="handled">
              {filteredResidents.map((resident) => (
                <Menu.Item
                  key={resident.id}
                  title={`${resident.name} (${resident.unit})`}
                  style={[
                    selectedResident?.id === resident.id && styles(theme).selectedMenuItem
                  ]}
                  onPress={() => handleResidentSelect(resident)}
                />
              ))}
            </ScrollView>
          </Menu>
        </FormField>
        
        {/* Payment Type */}
        <FormField 
          label="Payment Type" 
          error={errors.type?.message}
        >
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <View>
                <TouchableOpacity
                  style={styles(theme).dropdown}
                  onPress={() => setShowTypeMenu(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Select payment type"
                  accessibilityState={{ disabled: isSubmitting }}
                >
                  <Text style={styles(theme).dropdownText}>
                    {watchType ? paymentTypes.find(t => t.id === watchType)?.label : 'Select payment type'}
                  </Text>
                  <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                
                <Menu
                  visible={showTypeMenu}
                  onDismiss={() => setShowTypeMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={{ width: '100%' }}
                  contentStyle={styles(theme).menuContent}
                >
                  {paymentTypes.map((type) => (
                    <Menu.Item
                      key={type.id}
                      title={type.label}
                      onPress={() => handleTypeSelect(type.id)}
                      style={field.value === type.id ? styles(theme).selectedMenuItem : undefined}
                    />
                  ))}
                </Menu>
              </View>
            )}
          />
        </FormField>
        
        {/* Payment Amount */}
        <FormField 
          label="Amount" 
          error={errors.amount?.message}
        >
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                style={styles(theme).input}
                error={!!errors.amount}
                placeholder="Enter amount"
                left={<TextInput.Affix text="$" />}
                outlineStyle={{ borderRadius: theme.roundness }}
                accessibilityLabel="Payment amount"
                accessibilityHint="Enter the payment amount"
                accessibilityState={{ disabled: isSubmitting }}
              />
            )}
          />
        </FormField>
        
        {/* Invoice Number */}
        <FormField 
          label="Invoice Number" 
          error={errors.invoiceNumber?.message}
        >
          <Controller
            control={control}
            name="invoiceNumber"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles(theme).input}
                error={!!errors.invoiceNumber}
                placeholder="Enter invoice number"
                outlineStyle={{ borderRadius: theme.roundness }}
                accessibilityLabel="Invoice number"
                accessibilityHint="Enter the invoice number"
                accessibilityState={{ disabled: isSubmitting }}
              />
            )}
          />
        </FormField>
      </FormSection>
      
      <FormSection title="Dates" index={1}>
        {/* Due Date */}
        <FormField 
          label="Due Date" 
          error={errors.dueDate?.message}
        >
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { value } }) => (
              <TouchableOpacity
                style={styles(theme).dateInput}
                onPress={() => setShowDueDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Select due date"
                accessibilityState={{ disabled: isSubmitting }}
              >
                <Text style={styles(theme).dropdownText}>
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
        </FormField>
        
        {/* Payment Date */}
        <FormField 
          label="Payment Date (optional)"
          error={undefined}
        >
          <Controller
            control={control}
            name="paymentDate"
            render={({ field: { value } }) => (
              <TouchableOpacity
                style={styles(theme).dateInput}
                onPress={() => setShowPaymentDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Select payment date"
                accessibilityState={{ disabled: isSubmitting }}
              >
                <Text style={styles(theme).dropdownText}>
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
        </FormField>
      </FormSection>
      
      <FormSection title="Payment Details" index={2}>
        {/* Payment Method */}
        <FormField 
          label="Payment Method (optional)"
          error={undefined}
        >
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <View>
                <TouchableOpacity
                  style={styles(theme).dropdown}
                  onPress={() => setShowPaymentMethodMenu(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Select payment method"
                  accessibilityState={{ disabled: isSubmitting }}
                >
                  <Text style={styles(theme).dropdownText}>
                    {watchPaymentMethod 
                      ? paymentMethods.find(m => m.id === watchPaymentMethod)?.label 
                      : 'Select payment method'
                    }
                  </Text>
                  <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                
                <Menu
                  visible={showPaymentMethodMenu}
                  onDismiss={() => setShowPaymentMethodMenu(false)}
                  anchor={{ x: 0, y: 0 }}
                  style={{ width: '100%' }}
                  contentStyle={styles(theme).menuContent}
                >
                  {paymentMethods.map((method) => (
                    <Menu.Item
                      key={method.id}
                      title={method.label}
                      onPress={() => handlePaymentMethodSelect(method.id)}
                      style={field.value === method.id ? styles(theme).selectedMenuItem : undefined}
                    />
                  ))}
                </Menu>
              </View>
            )}
          />
        </FormField>
        
        {/* Description */}
        <FormField 
          label="Description" 
          error={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles(theme).textArea}
                multiline
                numberOfLines={4}
                error={!!errors.description}
                placeholder="Enter payment description"
                outlineStyle={{ borderRadius: theme.roundness }}
                accessibilityLabel="Payment description"
                accessibilityHint="Enter a description for this payment"
                accessibilityState={{ disabled: isSubmitting }}
              />
            )}
          />
        </FormField>
      </FormSection>
      
      <Animated.View
        entering={FadeInUp.delay(300).springify()}
        style={styles(theme).buttonContainer}
      >
        <Button
          mode="contained"
          onPress={handleSubmit(submitForm)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles(theme).submitButton}
          contentStyle={{
            paddingVertical: theme.spacing.xs,
          }}
          accessibilityLabel={initialData?.residentId ? 'Update Payment' : 'Create Payment'}
          accessibilityHint="Submit the payment form"
          accessibilityRole="button"
        >
          {initialData?.residentId ? 'Update Payment' : 'Create Payment'}
        </Button>
      </Animated.View>
    </ScrollView>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
    gap: theme.spacing.m,
  },
  section: {
    marginBottom: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  overflowContainer: {
    overflow: 'hidden',
    borderRadius: theme.roundness,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.m,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.xs,
  },
  textArea: {
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.xs,
    minHeight: 100,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
  },
  dropdownText: {
    color: theme.colors.onSurfaceVariant,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
  },
  menu: {
    width: '90%',
    maxHeight: 300,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  menuContent: {
    backgroundColor: theme.colors.surface,
  },
  menuItems: {
    maxHeight: 250,
  },
  searchContainer: {
    padding: theme.spacing.s,
    backgroundColor: theme.colors.surfaceVariant,
  },
  searchInput: {
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  selectedMenuItem: {
    backgroundColor: theme.colors.primaryContainer,
  },
  buttonContainer: {
    marginTop: theme.spacing.s,
  },
  submitButton: {
    marginVertical: theme.spacing.m,
    borderRadius: theme.roundness,
  },
});