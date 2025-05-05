import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, useTheme, Button, HelperText, Switch, Divider, RadioButton } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Resident } from '../navigation/types';
import { useAppSelector } from '../store/hooks';

export interface ResidentFormData {
  name: string;
  email: string;
  phone: string;
  unit: string;
  status: 'owner' | 'tenant';
  moveInDate: string;
  familyMembers: number;
  pets: string;
  communicationPreference: string;
}

// Validation schema
const residentSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  unit: yup.string().required('Unit is required'),
  status: yup.string().oneOf(['owner', 'tenant'], 'Status must be owner or tenant').required('Status is required'),
  moveInDate: yup.string().required('Move-in date is required'),
  familyMembers: yup.number()
    .typeError('Family members must be a number')
    .required('Number of family members is required')
    .min(1, 'At least 1 family member required')
    .integer('Must be a whole number'),
  pets: yup.string(),
  communicationPreference: yup.string().required('Communication preference is required'),
}) as yup.ObjectSchema<ResidentFormData>;

interface ResidentFormProps {
  initialData?: Partial<ResidentFormData>;
  onSubmit: (data: ResidentFormData) => Promise<void>;
  isLoading: boolean;
  buildingName?: string;
}

export const ResidentForm = ({ 
  initialData, 
  onSubmit,
  isLoading,
  buildingName
}: ResidentFormProps) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const { control, handleSubmit, formState: { errors } } = useForm<ResidentFormData>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      unit: initialData?.unit || '',
      status: initialData?.status || 'tenant',
      moveInDate: initialData?.moveInDate || new Date().toISOString().split('T')[0],
      familyMembers: initialData?.familyMembers || 1,
      pets: initialData?.pets || '',
      communicationPreference: initialData?.communicationPreference || 'email',
    },
    resolver: yupResolver(residentSchema)
  });
  
  const handleFormSubmit: SubmitHandler<ResidentFormData> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
        Basic Information
      </Text>
      
      {/* Resident Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.name}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.name && (
              <HelperText type="error" visible={true}>
                {errors.name.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Email Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.email}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              outlineStyle={{ borderRadius: 8 }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <HelperText type="error" visible={true}>
                {errors.email.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.phone}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              outlineStyle={{ borderRadius: 8 }}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <HelperText type="error" visible={true}>
                {errors.phone.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      <Divider style={styles.divider} />
      
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
        Residence Details
      </Text>
      
      {buildingName && (
        <Text style={[styles.buildingName, { color: isDarkMode ? '#aaa' : '#666' }]}>
          Building: {buildingName}
        </Text>
      )}
      
      {/* Unit */}
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Unit Number/ID"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.unit}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="home" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.unit && (
              <HelperText type="error" visible={true}>
                {errors.unit.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Status */}
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.fieldLabel, { color: isDarkMode ? '#fff' : '#333' }]}>
              Resident Status
            </Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                  <RadioButton value="owner" color={theme.colors.primary} />
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Owner</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="tenant" color={theme.colors.primary} />
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Tenant</Text>
                </View>
              </View>
            </RadioButton.Group>
            {errors.status && (
              <HelperText type="error" visible={true}>
                {errors.status.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Move In Date */}
      <Controller
        control={control}
        name="moveInDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Move-in Date (YYYY-MM-DD)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.moveInDate}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="calendar" />}
              outlineStyle={{ borderRadius: 8 }}
              placeholder="YYYY-MM-DD"
            />
            {errors.moveInDate && (
              <HelperText type="error" visible={true}>
                {errors.moveInDate.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      <Divider style={styles.divider} />
      
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
        Additional Information
      </Text>
      
      {/* Family Members */}
      <Controller
        control={control}
        name="familyMembers"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Number of Family Members"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
              onBlur={onBlur}
              error={!!errors.familyMembers}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account-group" />}
              outlineStyle={{ borderRadius: 8 }}
              keyboardType="numeric"
            />
            {errors.familyMembers && (
              <HelperText type="error" visible={true}>
                {errors.familyMembers.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Pets */}
      <Controller
        control={control}
        name="pets"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Pets (type and number)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.pets}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="paw" />}
              outlineStyle={{ borderRadius: 8 }}
              placeholder="e.g. 1 dog, 2 cats"
            />
            {errors.pets && (
              <HelperText type="error" visible={true}>
                {errors.pets.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Communication Preference */}
      <Controller
        control={control}
        name="communicationPreference"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.fieldLabel, { color: isDarkMode ? '#fff' : '#333' }]}>
              Preferred Communication Method
            </Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                  <RadioButton value="email" color={theme.colors.primary} />
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Email</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="phone" color={theme.colors.primary} />
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Phone</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="app" color={theme.colors.primary} />
                  <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>App</Text>
                </View>
              </View>
            </RadioButton.Group>
            {errors.communicationPreference && (
              <HelperText type="error" visible={true}>
                {errors.communicationPreference.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit(handleFormSubmit)}
        style={styles.submitButton}
        loading={isLoading}
        disabled={isLoading}
      >
        {initialData ? 'Update Resident' : 'Add Resident'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  buildingName: {
    fontSize: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  submitButton: {
    marginVertical: 24,
    paddingVertical: 8,
  }
}); 