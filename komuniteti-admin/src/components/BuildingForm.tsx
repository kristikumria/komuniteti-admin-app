import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, useTheme, Button, HelperText, Switch, Divider } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Building } from '../navigation/types';
import { useAppSelector } from '../store/hooks';

export interface BuildingFormData {
  name: string;
  address: string;
  propertyType: string;
  units: number;
  floors: number;
  totalArea: number;
  yearBuilt: number;
  description: string;
  hasParking: boolean;
  hasSecurity: boolean;
}

// Validation schema
const buildingSchema = yup.object({
  name: yup.string().required('Building name is required'),
  address: yup.string().required('Address is required'),
  propertyType: yup.string().required('Property type is required'),
  units: yup.number()
    .typeError('Units must be a number')
    .required('Units is required')
    .positive('Units must be positive')
    .integer('Units must be an integer'),
  floors: yup.number()
    .typeError('Floors must be a number')
    .required('Floors is required')
    .positive('Floors must be positive')
    .integer('Floors must be an integer'),
  totalArea: yup.number()
    .typeError('Area must be a number')
    .required('Total area is required')
    .positive('Area must be positive'),
  yearBuilt: yup.number()
    .typeError('Year must be a number')
    .required('Year built is required')
    .integer('Year must be an integer')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  description: yup.string().required('Description is required'),
  hasParking: yup.boolean().required(),
  hasSecurity: yup.boolean().required(),
}) as yup.ObjectSchema<BuildingFormData>;

interface BuildingFormProps {
  initialData?: Partial<BuildingFormData>;
  onSubmit: (data: BuildingFormData) => Promise<void>;
  isLoading: boolean;
}

export const BuildingForm = ({ 
  initialData, 
  onSubmit,
  isLoading
}: BuildingFormProps) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const { control, handleSubmit, formState: { errors } } = useForm<BuildingFormData>({
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      propertyType: initialData?.propertyType || '',
      units: initialData?.units || 0,
      floors: initialData?.floors || 0,
      totalArea: initialData?.totalArea || 0,
      yearBuilt: initialData?.yearBuilt || new Date().getFullYear(),
      description: initialData?.description || '',
      hasParking: initialData?.hasParking || false,
      hasSecurity: initialData?.hasSecurity || false,
    },
    resolver: yupResolver(buildingSchema)
  });
  
  const handleFormSubmit: SubmitHandler<BuildingFormData> = async (data) => {
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
      
      {/* Building Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Building Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.name}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="domain" />}
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
      
      {/* Address */}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.address}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="map-marker" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.address && (
              <HelperText type="error" visible={true}>
                {errors.address.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Property Type */}
      <Controller
        control={control}
        name="propertyType"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Property Type"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.propertyType}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="home" />}
              outlineStyle={{ borderRadius: 8 }}
              placeholder="e.g. Residential, Commercial, Mixed-use"
            />
            {errors.propertyType && (
              <HelperText type="error" visible={true}>
                {errors.propertyType.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      <Divider style={styles.divider} />
      
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
        Building Details
      </Text>
      
      {/* Units */}
      <Controller
        control={control}
        name="units"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Number of Units"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
              onBlur={onBlur}
              error={!!errors.units}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="office-building" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.units && (
              <HelperText type="error" visible={true}>
                {errors.units.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Floors */}
      <Controller
        control={control}
        name="floors"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Number of Floors"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
              onBlur={onBlur}
              error={!!errors.floors}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="elevator" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.floors && (
              <HelperText type="error" visible={true}>
                {errors.floors.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Total Area */}
      <Controller
        control={control}
        name="totalArea"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Total Area (m²)"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
              onBlur={onBlur}
              error={!!errors.totalArea}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="ruler-square" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.totalArea && (
              <HelperText type="error" visible={true}>
                {errors.totalArea.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Year Built */}
      <Controller
        control={control}
        name="yearBuilt"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Year Built"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
              onBlur={onBlur}
              error={!!errors.yearBuilt}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="calendar" />}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.yearBuilt && (
              <HelperText type="error" visible={true}>
                {errors.yearBuilt.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      <Divider style={styles.divider} />
      
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
        Additional Information
      </Text>
      
      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors.description}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              outlineStyle={{ borderRadius: 8 }}
            />
            {errors.description && (
              <HelperText type="error" visible={true}>
                {errors.description.message}
              </HelperText>
            )}
          </View>
        )}
      />
      
      {/* Amenities */}
      <View style={styles.switchesContainer}>
        <Controller
          control={control}
          name="hasParking"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Has Parking</Text>
              <Switch
                value={value}
                onValueChange={onChange}
                color={theme.colors.primary}
              />
            </View>
          )}
        />
        
        <Controller
          control={control}
          name="hasSecurity"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Has Security</Text>
              <Switch
                value={value}
                onValueChange={onChange}
                color={theme.colors.primary}
              />
            </View>
          )}
        />
      </View>
      
      <Button
        mode="contained"
        onPress={handleSubmit(handleFormSubmit)}
        style={styles.submitButton}
        loading={isLoading}
        disabled={isLoading}
      >
        {initialData ? 'Update Building' : 'Add Building'}
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 8,
  },
  switchesContainer: {
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  submitButton: {
    marginVertical: 24,
    paddingVertical: 8,
  }
}); 