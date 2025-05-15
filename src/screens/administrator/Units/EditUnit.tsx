import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { Header } from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Home, Save } from 'lucide-react-native';

// Import the Unit type (same as UnitsList and UnitDetails)
interface Unit {
  id: string;
  number: string;
  floor: number;
  building: string;
  type: 'residential' | 'commercial' | 'storage' | 'parking';
  status: 'occupied' | 'vacant' | 'maintenance';
  area: number;
  bedrooms: number;
  bathrooms: number;
  resident?: string;
  residentId?: string;
  rent?: number;
  lastMaintenance?: string;
}

// Mock data for units
const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    number: '101',
    floor: 1,
    building: 'Riviera Towers',
    type: 'residential',
    status: 'occupied',
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    resident: 'John Doe',
    residentId: 'resident-1',
    rent: 850,
    lastMaintenance: '2023-08-15',
  },
  {
    id: 'unit-2',
    number: '102',
    floor: 1,
    building: 'Riviera Towers',
    type: 'residential',
    status: 'vacant',
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    rent: 650,
    lastMaintenance: '2023-09-20',
  },
  {
    id: 'unit-3',
    number: '201',
    floor: 2,
    building: 'Park View Residence',
    type: 'residential',
    status: 'occupied',
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    resident: 'Jane Smith',
    residentId: 'resident-2',
    rent: 1100,
    lastMaintenance: '2023-07-10',
  },
  {
    id: 'unit-4',
    number: 'C1',
    floor: 0,
    building: 'Central Plaza',
    type: 'commercial',
    status: 'occupied',
    area: 150,
    bedrooms: 0,
    bathrooms: 1,
    resident: 'Coffee Shop LLC',
    residentId: 'business-1',
    rent: 2000,
    lastMaintenance: '2023-06-30',
  },
  {
    id: 'unit-5',
    number: 'P12',
    floor: -1,
    building: 'Riviera Towers',
    type: 'parking',
    status: 'occupied',
    area: 15,
    bedrooms: 0,
    bathrooms: 0,
    resident: 'John Doe',
    residentId: 'resident-1',
    rent: 100,
    lastMaintenance: '2023-10-05',
  },
  {
    id: 'unit-6',
    number: 'S08',
    floor: -2,
    building: 'Park View Residence',
    type: 'storage',
    status: 'vacant',
    area: 8,
    bedrooms: 0,
    bathrooms: 0,
    rent: 75,
    lastMaintenance: '2023-09-15',
  },
  {
    id: 'unit-7',
    number: '301',
    floor: 3,
    building: 'Riviera Towers',
    type: 'residential',
    status: 'maintenance',
    area: 95,
    bedrooms: 2,
    bathrooms: 2,
    rent: 950,
    lastMaintenance: '2023-11-01',
  },
];

type Props = NativeStackScreenProps<AdministratorStackParamList, 'EditUnit'>;

export const EditUnit = ({ navigation, route }: Props) => {
  const { unitId } = route.params;
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Unit>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    loadUnitData();
  }, [unitId]);
  
  const loadUnitData = () => {
    setLoading(true);
    
    // In a real app, this would be an API call
    // For now, we'll use our mock data
    const unit = mockUnits.find(u => u.id === unitId);
    
    if (unit) {
      setFormData({ ...unit });
    }
    
    setLoading(false);
  };
  
  const handleInputChange = (field: keyof Unit, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user corrects a field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.number?.trim()) {
      newErrors.number = 'Unit number is required';
    }
    
    if (!formData.building?.trim()) {
      newErrors.building = 'Building is required';
    }
    
    if (formData.area === undefined || formData.area <= 0) {
      newErrors.area = 'Valid area is required';
    }
    
    if (formData.type === 'residential') {
      if (formData.bedrooms === undefined || formData.bedrooms < 0) {
        newErrors.bedrooms = 'Valid number of bedrooms is required';
      }
      
      if (formData.bathrooms === undefined || formData.bathrooms < 0) {
        newErrors.bathrooms = 'Valid number of bathrooms is required';
      }
    }
    
    if (formData.rent !== undefined && formData.rent < 0) {
      newErrors.rent = 'Rent cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    // In a real app, this would be an API call to update the unit
    // For now, just simulate a delay
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 1000);
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Edit Unit" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`Edit Unit ${formData.number}`}
        showBack
      />
      
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Basic Information
        </Text>
        
        <TextInput
          label="Unit Number"
          value={formData.number?.toString() || ''}
          onChangeText={text => handleInputChange('number', text)}
          mode="outlined"
          style={styles.input}
          error={!!errors.number}
        />
        {errors.number && <HelperText type="error">{errors.number}</HelperText>}
        
        <TextInput
          label="Building"
          value={formData.building || ''}
          onChangeText={text => handleInputChange('building', text)}
          mode="outlined"
          style={styles.input}
          error={!!errors.building}
        />
        {errors.building && <HelperText type="error">{errors.building}</HelperText>}
        
        <TextInput
          label="Floor"
          value={formData.floor?.toString() || ''}
          onChangeText={text => handleInputChange('floor', parseInt(text) || 0)}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.floor}
        />
        {errors.floor && <HelperText type="error">{errors.floor}</HelperText>}
        
        <TextInput
          label="Area (m²)"
          value={formData.area?.toString() || ''}
          onChangeText={text => handleInputChange('area', parseFloat(text) || 0)}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.area}
        />
        {errors.area && <HelperText type="error">{errors.area}</HelperText>}
        
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Unit Type</Text>
        <View style={styles.chipContainer}>
          {(['residential', 'commercial', 'storage', 'parking'] as const).map(type => (
            <Chip
              key={type}
              selected={formData.type === type}
              onPress={() => handleInputChange('type', type)}
              style={[
                styles.chip,
                formData.type === type ? { backgroundColor: theme.colors.primary + '30' } : {}
              ]}
              textStyle={formData.type === type ? { color: theme.colors.primary } : {}}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Chip>
          ))}
        </View>
        
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Status</Text>
        <View style={styles.chipContainer}>
          {(['occupied', 'vacant', 'maintenance'] as const).map(status => (
            <Chip
              key={status}
              selected={formData.status === status}
              onPress={() => handleInputChange('status', status)}
              style={[
                styles.chip,
                formData.status === status ? { backgroundColor: theme.colors.primary + '30' } : {}
              ]}
              textStyle={formData.status === status ? { color: theme.colors.primary } : {}}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Chip>
          ))}
        </View>
        
        {formData.type === 'residential' && (
          <>
            <Divider style={styles.divider} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Residential Details
            </Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Bedrooms"
                  value={formData.bedrooms?.toString() || ''}
                  onChangeText={text => handleInputChange('bedrooms', parseInt(text) || 0)}
                  mode="outlined"
                  keyboardType="numeric"
                  error={!!errors.bedrooms}
                />
                {errors.bedrooms && <HelperText type="error">{errors.bedrooms}</HelperText>}
              </View>
              
              <View style={styles.halfInput}>
                <TextInput
                  label="Bathrooms"
                  value={formData.bathrooms?.toString() || ''}
                  onChangeText={text => handleInputChange('bathrooms', parseInt(text) || 0)}
                  mode="outlined"
                  keyboardType="numeric"
                  error={!!errors.bathrooms}
                />
                {errors.bathrooms && <HelperText type="error">{errors.bathrooms}</HelperText>}
              </View>
            </View>
          </>
        )}
        
        <Divider style={styles.divider} />
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Financial Details
        </Text>
        
        <TextInput
          label="Monthly Rent ($)"
          value={formData.rent?.toString() || ''}
          onChangeText={text => handleInputChange('rent', parseFloat(text) || 0)}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.rent}
        />
        {errors.rent && <HelperText type="error">{errors.rent}</HelperText>}
        
        <Divider style={styles.divider} />
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          icon={({ size, color }) => <Save size={size} color={color} />}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  divider: {
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
