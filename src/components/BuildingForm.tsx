import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText, Switch, Divider, Surface, useTheme } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Building } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { Home, MapPin, Building2, Stars, Square, Calendar, FileText } from 'lucide-react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

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

/**
 * A form component for creating and updating building information.
 * Follows Material Design 3 guidelines with proper field organization, validation,
 * animations, and accessibility features.
 * 
 * @example
 * <BuildingForm
 *   initialData={buildingData}
 *   onSubmit={handleSubmit}
 *   isLoading={isSubmitting}
 * />
 */
export const BuildingForm: React.FC<BuildingFormProps> = ({ 
  initialData, 
  onSubmit,
  isLoading
}) => {
  const { theme } = useThemedStyles();
  
  const { control, handleSubmit, formState: { errors, dirtyFields } } = useForm<BuildingFormData>({
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

  /**
   * Renders a form section with a title and children using MD3 surface elevation
   * and animated entrance for a more polished UX
   */
  const FormSection = ({ 
    title, 
    children,
    index = 0 
  }: { 
    title: string, 
    children: React.ReactNode,
    index?: number 
  }) => (
    <Animated.View 
      entering={FadeInUp.delay(100 * index).springify()} 
      exiting={FadeOut}
    >
      <Surface style={styles(theme).formSection} elevation={ElevationLevel.Level1}>
        <View style={styles(theme).sectionOverflowContainer}>
          <Text variant="titleMedium" style={styles(theme).sectionTitle}>
            {title}
          </Text>
          {children}
        </View>
      </Surface>
    </Animated.View>
  );

  /**
   * Renders a form field with a label, input, and error message
   * Follows MD3 guidelines for text inputs and error states
   */
  const FormField = ({ 
    name, 
    control, 
    label, 
    icon, 
    multiline = false, 
    keyboardType = 'default',
    placeholder = '',
    transformValue = (v) => v,
    parseValue = (v) => v,
  }: { 
    name: keyof BuildingFormData, 
    control: any,
    label: string, 
    icon: React.ReactNode,
    multiline?: boolean,
    keyboardType?: 'default' | 'numeric' | 'email-address',
    placeholder?: string,
    transformValue?: (value: any) => any,
    parseValue?: (text: string) => any,
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles(theme).inputContainer}>
          <TextInput
            label={label}
            value={transformValue(value)?.toString()}
            onChangeText={(text) => onChange(parseValue(text))}
            onBlur={onBlur}
            error={!!errors[name]}
            mode="outlined"
            style={styles(theme).input}
            left={<TextInput.Icon icon={() => icon} />}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
            placeholder={placeholder}
            outlineStyle={{ 
              borderRadius: theme.roundness 
            }}
            contentStyle={{ 
              paddingHorizontal: theme.spacing.s 
            }}
            accessibilityLabel={label}
            accessibilityHint={errors[name]?.message?.toString()}
            accessibilityState={{ 
              disabled: isLoading
            }}
          />
          {errors[name] && (
            <Animated.View 
              entering={FadeInUp.springify()} 
              exiting={FadeOut}
            >
              <HelperText type="error" visible={true}>
                {errors[name]?.message}
              </HelperText>
            </Animated.View>
          )}
        </View>
      )}
    />
  );
  
  return (
    <ScrollView 
      style={styles(theme).container}
      contentContainerStyle={styles(theme).contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <FormSection title="Basic Information" index={0}>
        <FormField 
          name="name" 
          control={control} 
          label="Building Name" 
          icon={<Building2 size={24} color={theme.colors.primary} />} 
        />
        
        <FormField 
          name="address" 
          control={control} 
          label="Address" 
          icon={<MapPin size={24} color={theme.colors.primary} />} 
        />
        
        <FormField 
          name="propertyType" 
          control={control} 
          label="Property Type" 
          icon={<Home size={24} color={theme.colors.primary} />}
          placeholder="e.g. Residential, Commercial, Mixed-use"
        />
      </FormSection>
      
      <FormSection title="Building Details" index={1}>
        <FormField 
          name="units" 
          control={control} 
          label="Number of Units" 
          icon={<Building2 size={24} color={theme.colors.primary} />}
          keyboardType="numeric"
          parseValue={(text) => text ? parseInt(text, 10) : ''}
        />
        
        <FormField 
          name="floors" 
          control={control} 
          label="Number of Floors" 
          icon={<Stars size={24} color={theme.colors.primary} />}
          keyboardType="numeric"
          parseValue={(text) => text ? parseInt(text, 10) : ''}
        />
        
        <FormField 
          name="totalArea" 
          control={control} 
          label="Total Area (m²)" 
          icon={<Square size={24} color={theme.colors.primary} />}
          keyboardType="numeric"
          parseValue={(text) => text ? parseFloat(text) : ''}
        />
        
        <FormField 
          name="yearBuilt" 
          control={control} 
          label="Year Built" 
          icon={<Calendar size={24} color={theme.colors.primary} />}
          keyboardType="numeric"
          parseValue={(text) => text ? parseInt(text, 10) : ''}
        />
      </FormSection>
      
      <FormSection title="Additional Information" index={2}>
        <FormField 
          name="description" 
          control={control} 
          label="Description" 
          icon={<FileText size={24} color={theme.colors.primary} />}
          multiline={true}
        />
        
        <Surface style={styles(theme).switchesSurface} elevation={ElevationLevel.Level0}>
          <View style={styles(theme).sectionOverflowContainer}>
            <Controller
              control={control}
              name="hasParking"
              render={({ field: { onChange, value } }) => (
                <View style={styles(theme).switchContainer}>
                  <Text variant="bodyMedium" style={styles(theme).switchLabel}>
                    Has Parking
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    color={theme.colors.primary}
                    accessibilityLabel="Has Parking"
                    accessibilityRole="switch"
                    accessibilityState={{ 
                      checked: value,
                      disabled: isLoading
                    }}
                  />
                </View>
              )}
            />
            
            <Divider style={styles(theme).switchDivider} />
            
            <Controller
              control={control}
              name="hasSecurity"
              render={({ field: { onChange, value } }) => (
                <View style={styles(theme).switchContainer}>
                  <Text variant="bodyMedium" style={styles(theme).switchLabel}>
                    Has Security
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    color={theme.colors.primary}
                    accessibilityLabel="Has Security"
                    accessibilityRole="switch"
                    accessibilityState={{ 
                      checked: value,
                      disabled: isLoading
                    }}
                  />
                </View>
              )}
            />
          </View>
        </Surface>
      </FormSection>
      
      <Animated.View 
        entering={FadeInUp.delay(300).springify()} 
        style={styles(theme).buttonContainer}
      >
        <Button
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          style={styles(theme).submitButton}
          contentStyle={{
            paddingVertical: theme.spacing.xs,
          }}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel={initialData ? 'Update Building' : 'Add Building'}
          accessibilityHint="Submit the building form"
          accessibilityRole="button"
        >
          {initialData ? 'Update Building' : 'Add Building'}
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
  formSection: {
    marginBottom: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  sectionOverflowContainer: {
    overflow: 'hidden',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.m,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  input: {
    backgroundColor: 'transparent',
  },
  switchesSurface: {
    borderRadius: theme.roundness,
    marginTop: theme.spacing.s,
    backgroundColor: theme.colors.surfaceVariant,
  },
  switchesContainer: {
    marginTop: theme.spacing.s,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  switchLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  switchDivider: {
    backgroundColor: theme.colors.outlineVariant,
  },
  buttonContainer: {
    marginTop: theme.spacing.s,
  },
  submitButton: {
    marginVertical: theme.spacing.m,
    borderRadius: theme.roundness,
  }
});