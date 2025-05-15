import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText, Switch, Divider, RadioButton } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Resident } from '../navigation/types';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

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
  const { theme } = useThemedStyles();
  
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
    <ScrollView style={styles(theme).container}>
      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Basic Information
      </Text>
      
      {/* Resident Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.name}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="account" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Email Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.email}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="email" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.phone}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="phone" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
      
      <Divider style={styles(theme).divider} />
      
      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Residence Details
      </Text>
      
      {buildingName && (
        <Text variant="bodyMedium" style={styles(theme).buildingName}>
          Building: {buildingName}
        </Text>
      )}
      
      {/* Unit */}
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Unit Number/ID"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.unit}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="home" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
          <View style={styles(theme).inputContainer}>
            <Text variant="bodyMedium" style={styles(theme).fieldLabel}>
              Resident Status
            </Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles(theme).radioContainer}>
                <View style={styles(theme).radioOption}>
                  <RadioButton value="owner" color={theme.colors.primary} />
                  <Text variant="bodyMedium">Owner</Text>
                </View>
                <View style={styles(theme).radioOption}>
                  <RadioButton value="tenant" color={theme.colors.primary} />
                  <Text variant="bodyMedium">Tenant</Text>
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
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Move-in Date (YYYY-MM-DD)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.moveInDate}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="calendar" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
      
      <Divider style={styles(theme).divider} />
      
      <Text variant="titleMedium" style={styles(theme).sectionTitle}>
        Additional Information
      </Text>
      
      {/* Family Members */}
      <Controller
        control={control}
        name="familyMembers"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Number of Family Members"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
              onBlur={onBlur}
              error={!!errors.familyMembers}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="account-group" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
          <View style={styles(theme).inputContainer}>
            <TextInput
              label="Pets (type and number)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.pets}
              mode="outlined"
              style={styles(theme).input}
              left={<TextInput.Icon icon="paw" />}
              outlineStyle={{ borderRadius: theme.roundness }}
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
          <View style={styles(theme).inputContainer}>
            <Text variant="bodyMedium" style={styles(theme).fieldLabel}>
              Preferred Communication Method
            </Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles(theme).radioContainer}>
                <View style={styles(theme).radioOption}>
                  <RadioButton value="email" color={theme.colors.primary} />
                  <Text variant="bodyMedium">Email</Text>
                </View>
                <View style={styles(theme).radioOption}>
                  <RadioButton value="phone" color={theme.colors.primary} />
                  <Text variant="bodyMedium">Phone</Text>
                </View>
                <View style={styles(theme).radioOption}>
                  <RadioButton value="app" color={theme.colors.primary} />
                  <Text variant="bodyMedium">App</Text>
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
        style={styles(theme).submitButton}
        loading={isLoading}
        disabled={isLoading}
      >
        {initialData ? 'Update Resident' : 'Add Resident'}
      </Button>
    </ScrollView>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onBackground,
  },
  buildingName: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  input: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
    backgroundColor: theme.colors.outlineVariant,
  },
  fieldLabel: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.s,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.l,
  },
  submitButton: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.roundness,
  },
});