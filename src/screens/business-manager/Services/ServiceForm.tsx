import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme, Text, HelperText, Switch } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Service, ServiceFormData } from '../../../types/serviceTypes';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createService, updateService, selectServicesLoading } from '../../../store/slices/serviceSlice';

interface ServiceFormProps {
  service?: Service;
  onSubmit: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

// Define the schema with appropriate types for form values
const validationSchema = yup.object({
  name: yup.string().required('Service name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  category: yup.string().required('Category is required'),
  price: yup
    .mixed<string | number>()
    .transform((value) => (isNaN(Number(value)) ? undefined : value))
    .required('Price is required')
    .test('is-positive', 'Price must be a positive number', (value) => Number(value) > 0),
  priceUnit: yup
    .mixed<'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time'>()
    .required('Price unit is required')
    .oneOf(['hourly', 'daily', 'weekly', 'monthly', 'yearly', 'one-time'], 'Invalid price unit'),
  isActive: yup.boolean().required('Status is required'),
});

export const ServiceForm = ({ service, onSubmit, onCancel, mode }: ServiceFormProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectServicesLoading);

  const priceUnitOptions = [
    { label: 'Hourly', value: 'hourly' as const },
    { label: 'Daily', value: 'daily' as const },
    { label: 'Weekly', value: 'weekly' as const },
    { label: 'Monthly', value: 'monthly' as const },
    { label: 'Yearly', value: 'yearly' as const },
    { label: 'One-time', value: 'one-time' as const },
  ];

  const defaultValues: ServiceFormData = {
    name: '',
    description: '',
    category: '',
    price: '',
    priceUnit: 'monthly',
    isActive: true,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServiceFormData>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any, // Type casting to fix resolver type issue
  });

  useEffect(() => {
    if (mode === 'edit' && service) {
      reset({
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        priceUnit: service.priceUnit,
        isActive: service.isActive,
      });
    }
  }, [mode, service, reset]);

  const onFormSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    try {
      if (mode === 'create') {
        await dispatch(
          createService({
            name: data.name,
            description: data.description,
            category: data.category,
            price: Number(data.price),
            priceUnit: data.priceUnit,
            isActive: data.isActive,
          })
        ).unwrap();
      } else if (mode === 'edit' && service) {
        await dispatch(
          updateService({
            id: service.id,
            updates: {
              name: data.name,
              description: data.description,
              category: data.category,
              price: Number(data.price),
              priceUnit: data.priceUnit,
              isActive: data.isActive,
            },
          })
        ).unwrap();
      }
      onSubmit();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Service Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Service Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.name}
              style={styles.input}
              disabled={loading}
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Service Category */}
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Service Category"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.category}
              style={styles.input}
              disabled={loading}
            />
            {errors.category && (
              <HelperText type="error" visible={!!errors.category}>
                {errors.category.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Service Price */}
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Price"
              value={value.toString()}
              onChangeText={(text) => onChange(text.replace(/[^0-9.]/g, ''))}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.price}
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Affix text="€" />}
              disabled={loading}
            />
            {errors.price && (
              <HelperText type="error" visible={!!errors.price}>
                {errors.price.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Price Unit */}
      <Text variant="labelLarge" style={styles.sectionTitle}>
        Price Unit
      </Text>
      <Controller
        control={control}
        name="priceUnit"
        render={({ field: { value } }) => (
          <View style={styles.chipContainer}>
            {priceUnitOptions.map((option) => (
              <Button
                key={option.value}
                mode={value === option.value ? 'contained' : 'outlined'}
                onPress={() => setValue('priceUnit', option.value)}
                style={styles.chipButton}
                disabled={loading}
              >
                {option.label}
              </Button>
            ))}
          </View>
        )}
      />
      {errors.priceUnit && (
        <HelperText type="error" visible={!!errors.priceUnit}>
          {errors.priceUnit.message}
        </HelperText>
      )}

      {/* Service Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={!!errors.description}
              style={[styles.input, styles.textArea]}
              disabled={loading}
            />
            {errors.description && (
              <HelperText type="error" visible={!!errors.description}>
                {errors.description.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Service Active Status */}
      <View style={styles.switchContainer}>
        <Text>Active</Text>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} disabled={loading} />
          )}
        />
      </View>

      {/* Form Actions */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(onFormSubmit)}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  chipButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
  cancelButton: {
    marginRight: 8,
  },
}); 