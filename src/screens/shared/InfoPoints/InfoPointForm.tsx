import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme, Text, HelperText, Switch, Chip } from 'react-native-paper';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InfoPoint, InfoPointCategory } from '../../../types/infoPointTypes';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createInfoPoint, updateInfoPoint, selectInfoPointsLoading } from '../../../store/slices/infoPointSlice';
import { Building } from '../../../types/buildingTypes';

// Mock buildings data until we fix imports
const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Residence Plaza',
    address: 'Rruga Hoxha Tahsim 45',
    city: 'Tirana',
    zipCode: '1001',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    units: 24,
    floors: 6,
    buildYear: 2015,
    totalArea: 2400,
    propertyManager: 'Alba Property',
    description: 'Modern residential building with 24 units in the center of Tirana.',
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
  },
  {
    id: '2',
    name: 'Park Apartments',
    address: 'Rruga Myslym Shyri 78',
    city: 'Tirana',
    zipCode: '1004',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    units: 36,
    floors: 8,
    buildYear: 2018,
    totalArea: 3600,
    propertyManager: 'Trend Property Management',
    description: 'Luxury apartment complex near the central park with modern amenities.',
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
  },
  {
    id: '3',
    name: 'City View Residences',
    address: 'Bulevardi Bajram Curri 120',
    city: 'Tirana',
    zipCode: '1019',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90',
    units: 48,
    floors: 12,
    buildYear: 2020,
    totalArea: 5400,
    propertyManager: 'Komuniteti Management',
    description: 'High-rise residential building with panoramic views of the city.',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-07-10').toISOString(),
  },
];

interface InfoPointFormProps {
  infoPoint?: InfoPoint;
  onSubmit: () => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

// Form data type for the InfoPoint form
interface InfoPointFormData {
  title: string;
  content: string;
  category: InfoPointCategory;
  buildingId?: string;
  pinned: boolean;
  published: boolean;
}

// Define the schema with appropriate types for form values
const validationSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters'),
  category: yup
    .mixed<InfoPointCategory>()
    .required('Category is required')
    .oneOf(['general', 'guidelines', 'faq', 'contacts', 'emergency', 'maintenance', 'community', 'other'], 'Invalid category'),
  buildingId: yup.string().nullable(),
  pinned: yup.boolean().required('Pinned status is required'),
  published: yup.boolean().required('Published status is required'),
});

export const InfoPointForm = ({ infoPoint, onSubmit, onCancel, mode }: InfoPointFormProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectInfoPointsLoading);

  // Use mock buildings
  const buildings = MOCK_BUILDINGS;

  const categoryOptions: { label: string; value: InfoPointCategory }[] = [
    { label: 'General', value: 'general' },
    { label: 'Guidelines', value: 'guidelines' },
    { label: 'FAQ', value: 'faq' },
    { label: 'Contacts', value: 'contacts' },
    { label: 'Emergency', value: 'emergency' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Community', value: 'community' },
    { label: 'Other', value: 'other' },
  ];

  const defaultValues: InfoPointFormData = {
    title: '',
    content: '',
    category: 'general',
    buildingId: '',
    pinned: false,
    published: false,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InfoPointFormData>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any, // Type casting to fix resolver type issue
  });

  useEffect(() => {
    if (mode === 'edit' && infoPoint) {
      reset({
        title: infoPoint.title,
        content: infoPoint.content,
        category: infoPoint.category,
        buildingId: infoPoint.buildingId || '',
        pinned: infoPoint.pinned,
        published: infoPoint.published,
      });
    }
  }, [mode, infoPoint, reset]);

  const onFormSubmit: SubmitHandler<InfoPointFormData> = async (data) => {
    try {
      if (mode === 'create') {
        await dispatch(
          createInfoPoint({
            title: data.title,
            content: data.content,
            category: data.category,
            buildingId: data.buildingId || undefined,
            buildingName: data.buildingId ? MOCK_BUILDINGS.find(b => b.id === data.buildingId)?.name : undefined,
            pinned: data.pinned,
            published: data.published,
            attachments: [],
          })
        ).unwrap();
      } else if (mode === 'edit' && infoPoint) {
        await dispatch(
          updateInfoPoint({
            id: infoPoint.id,
            updates: {
              title: data.title,
              content: data.content,
              category: data.category,
              buildingId: data.buildingId || undefined,
              buildingName: data.buildingId ? MOCK_BUILDINGS.find(b => b.id === data.buildingId)?.name : undefined,
              pinned: data.pinned,
              published: data.published,
            },
          })
        ).unwrap();
      }
      onSubmit();
    } catch (error) {
      console.error('Failed to save info point:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Title"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.title}
              style={styles.input}
              disabled={loading}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Category */}
      <Text variant="labelLarge" style={styles.sectionTitle}>
        Category
      </Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { value } }) => (
          <View style={styles.chipContainer}>
            {categoryOptions.map((option) => (
              <Button
                key={option.value}
                mode={value === option.value ? 'contained' : 'outlined'}
                onPress={() => setValue('category', option.value)}
                style={styles.chipButton}
                disabled={loading}
              >
                {option.label}
              </Button>
            ))}
          </View>
        )}
      />
      {errors.category && (
        <HelperText type="error" visible={!!errors.category}>
          {errors.category.message}
        </HelperText>
      )}

      {/* Building Selection */}
      {buildings && buildings.length > 0 && (
        <>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Building (Optional)
          </Text>
          <Controller
            control={control}
            name="buildingId"
            render={({ field: { value } }) => (
              <View style={styles.chipContainer}>
                <Button
                  mode={!value ? 'contained' : 'outlined'}
                  onPress={() => setValue('buildingId', '')}
                  style={styles.chipButton}
                  disabled={loading}
                >
                  All Buildings
                </Button>
                {buildings.map((building) => (
                  <Button
                    key={building.id}
                    mode={value === building.id ? 'contained' : 'outlined'}
                    onPress={() => setValue('buildingId', building.id)}
                    style={styles.chipButton}
                    disabled={loading}
                  >
                    {building.name}
                  </Button>
                ))}
              </View>
            )}
          />
        </>
      )}

      {/* Content */}
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Content"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              multiline
              numberOfLines={6}
              error={!!errors.content}
              style={[styles.input, styles.textArea]}
              disabled={loading}
            />
            {errors.content && (
              <HelperText type="error" visible={!!errors.content}>
                {errors.content.message}
              </HelperText>
            )}
          </>
        )}
      />

      {/* Status Controls */}
      <View style={styles.switchContainer}>
        <Text>Pin to top</Text>
        <Controller
          control={control}
          name="pinned"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} disabled={loading} />
          )}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>Publish</Text>
        <Controller
          control={control}
          name="published"
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
    minHeight: 120,
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