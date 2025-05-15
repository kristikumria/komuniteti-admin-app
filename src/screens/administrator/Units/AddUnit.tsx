import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  useTheme,
  TextInput,
  Button,
  SegmentedButtons,
  HelperText,
  Divider,
  Card,
  Appbar,
  Switch,
  Menu,
  Surface,
  Chip
} from 'react-native-paper';
import { Home, Briefcase, Archive, Car, PlusCircle, Wifi, DoorOpen, Droplet, Flame, CreditCard, Calendar, User } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AdministratorStackParamList } from '../../../navigation/types';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';

type UnitType = 'residential' | 'business' | 'storage' | 'parking';
type Props = NativeStackScreenProps<AdministratorStackParamList, 'AddUnit'>;

export const AddUnit = ({ navigation }: Props) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  const { currentBuilding } = useContextData();
  
  // Form state
  const [unitType, setUnitType] = useState<UnitType>('residential');
  const [number, setNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [area, setArea] = useState('');
  const [rent, setRent] = useState('');
  const [status, setStatus] = useState('vacant');
  
  // Residential-specific fields
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  
  // Business-specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [leaseStart, setLeaseStart] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Add resident/business associated with this unit
  const [addOccupant, setAddOccupant] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required for all unit types
    if (!number.trim()) newErrors.number = 'Unit number is required';
    if (!floor.trim()) newErrors.floor = 'Floor is required';
    if (!area.trim()) newErrors.area = 'Area is required';
    if (isNaN(Number(area))) newErrors.area = 'Area must be a number';
    if (rent && isNaN(Number(rent))) newErrors.rent = 'Rent must be a number';
    
    // Type-specific validation
    if (unitType === 'residential') {
      if (bedrooms && isNaN(Number(bedrooms))) {
        newErrors.bedrooms = 'Bedrooms must be a number';
      }
      if (bathrooms && isNaN(Number(bathrooms))) {
        newErrors.bathrooms = 'Bathrooms must be a number';
      }
    } else if (unitType === 'business') {
      if (addOccupant) {
        if (!businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!businessType.trim()) newErrors.businessType = 'Business type is required';
        if (contactEmail && !contactEmail.includes('@')) {
          newErrors.contactEmail = 'Please enter a valid email';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Format the unit data based on type
      const unitData = {
        number,
        floor: Number(floor),
        buildingId: currentBuilding?.id || '',
        building: currentBuilding?.name || '',
        type: unitType,
        status,
        area: Number(area),
        rent: rent ? Number(rent) : undefined,
        
        // Add type-specific fields
        ...(unitType === 'residential' && {
          bedrooms: bedrooms ? Number(bedrooms) : 0,
          bathrooms: bathrooms ? Number(bathrooms) : 0,
        }),
        
        ...(unitType === 'business' && addOccupant && {
          businessName,
          businessType,
          contactPerson,
          contactEmail,
          contactPhone,
          leaseStart,
          leaseEnd,
        }),
      };
      
      // In a real app, this would make a POST API call
      console.log('Creating unit:', unitData);
      
      // Go back to units list
      navigation.goBack();
    }
  };
  
  const resetForm = () => {
    setNumber('');
    setFloor('');
    setArea('');
    setRent('');
    setStatus('vacant');
    setBedrooms('');
    setBathrooms('');
    setBusinessName('');
    setBusinessType('');
    setContactPerson('');
    setContactEmail('');
    setContactPhone('');
    setLeaseStart('');
    setLeaseEnd('');
    setAddOccupant(false);
    setErrors({});
  };
  
  const getUnitTypeIcon = () => {
    switch (unitType) {
      case 'residential':
        return <Home size={24} color={theme.colors.primary} />;
      case 'business':
        return <Briefcase size={24} color={theme.colors.primary} />;
      case 'storage':
        return <Archive size={24} color={theme.colors.primary} />;
      case 'parking':
        return <Car size={24} color={theme.colors.primary} />;
      default:
        return null;
    }
  };
  
  const renderTypeButtons = () => (
    <Surface style={styles.formCard} elevation={1}>
      <View style={styles.formCardHeader}>
        <Text style={styles.formCardTitle}>Unit Type</Text>
      </View>
      <View style={styles.formCardContent}>
        <SegmentedButtons
          value={unitType}
          onValueChange={(value) => {
            setUnitType(value as UnitType);
            setErrors({});
          }}
          style={styles.segmentedButtons}
          buttons={[
            {
              value: 'residential',
              label: 'Residential',
              icon: Home,
            },
            {
              value: 'business',
              label: 'Business',
              icon: Briefcase,
            },
            {
              value: 'storage',
              label: 'Storage',
              icon: Archive,
            },
            {
              value: 'parking',
              label: 'Parking',
              icon: Car,
            },
          ]}
        />
        
        <View style={styles.selectedTypeContainer}>
          <View style={styles.selectedTypeIconContainer}>
            {getUnitTypeIcon()}
          </View>
          <Text style={styles.selectedTypeText}>
            Creating a new {unitType} unit
          </Text>
        </View>
      </View>
    </Surface>
  );
  
  const renderBasicInfo = () => (
    <Surface style={styles.formCard} elevation={1}>
      <View style={styles.formCardHeader}>
        <Text style={styles.formCardTitle}>Basic Information</Text>
      </View>
      <View style={styles.formCardContent}>
        <TextInput
          label="Unit Number *"
          value={number}
          onChangeText={setNumber}
          mode="outlined"
          error={!!errors.number}
          style={styles.formInput}
          left={<TextInput.Icon icon={() => <DoorOpen size={20} color={theme.colors.primary} />} />}
        />
        {errors.number && <HelperText type="error">{errors.number}</HelperText>}
        
        <View style={styles.formRow}>
          <View style={[styles.formColumn, { marginRight: 8 }]}>
            <TextInput
              label="Floor *"
              value={floor}
              onChangeText={setFloor}
              mode="outlined"
              keyboardType="number-pad"
              error={!!errors.floor}
              style={styles.formInput}
            />
            {errors.floor && <HelperText type="error">{errors.floor}</HelperText>}
          </View>
          
          <View style={styles.formColumn}>
            <TextInput
              label="Area (m²) *"
              value={area}
              onChangeText={setArea}
              mode="outlined"
              keyboardType="number-pad"
              error={!!errors.area}
              style={styles.formInput}
              right={<TextInput.Affix text="m²" />}
            />
            {errors.area && <HelperText type="error">{errors.area}</HelperText>}
          </View>
        </View>
        
        <TextInput
          label="Monthly Rent"
          value={rent}
          onChangeText={setRent}
          mode="outlined"
          keyboardType="number-pad"
          error={!!errors.rent}
          style={styles.formInput}
          left={<TextInput.Icon icon={() => <CreditCard size={20} color={theme.colors.primary} />} />}
          right={<TextInput.Affix text="€" />}
        />
        {errors.rent && <HelperText type="error">{errors.rent}</HelperText>}
        
        <View style={styles.formRow}>
          <Text style={styles.switchLabel}>Unit Status:</Text>
          <View style={styles.statusChipsContainer}>
            <Chip 
              selected={status === 'vacant'}
              onPress={() => setStatus('vacant')}
              style={[styles.statusChip, status === 'vacant' && styles.selectedStatusChip]}
              textStyle={status === 'vacant' ? styles.selectedChipText : undefined}
            >
              Vacant
            </Chip>
            <Chip 
              selected={status === 'occupied'}
              onPress={() => setStatus('occupied')}
              style={[styles.statusChip, status === 'occupied' && styles.selectedStatusChip]}
              textStyle={status === 'occupied' ? styles.selectedChipText : undefined}
            >
              Occupied
            </Chip>
            <Chip 
              selected={status === 'maintenance'}
              onPress={() => setStatus('maintenance')}
              style={[styles.statusChip, status === 'maintenance' && styles.selectedStatusChip]}
              textStyle={status === 'maintenance' ? styles.selectedChipText : undefined}
            >
              Maintenance
            </Chip>
          </View>
        </View>
      </View>
    </Surface>
  );
  
  const renderResidentialFields = () => (
    unitType === 'residential' && (
      <Surface style={styles.formCard} elevation={1}>
        <View style={styles.formCardHeader}>
          <Text style={styles.formCardTitle}>Residential Details</Text>
        </View>
        <View style={styles.formCardContent}>
          <View style={styles.formRow}>
            <View style={[styles.formColumn, { marginRight: 8 }]}>
              <TextInput
                label="Bedrooms"
                value={bedrooms}
                onChangeText={setBedrooms}
                mode="outlined"
                keyboardType="number-pad"
                error={!!errors.bedrooms}
                style={styles.formInput}
                left={<TextInput.Icon icon={() => <Home size={20} color={theme.colors.primary} />} />}
              />
              {errors.bedrooms && <HelperText type="error">{errors.bedrooms}</HelperText>}
            </View>
            
            <View style={styles.formColumn}>
              <TextInput
                label="Bathrooms"
                value={bathrooms}
                onChangeText={setBathrooms}
                mode="outlined"
                keyboardType="number-pad"
                error={!!errors.bathrooms}
                style={styles.formInput}
                left={<TextInput.Icon icon={() => <Droplet size={20} color={theme.colors.primary} />} />}
              />
              {errors.bathrooms && <HelperText type="error">{errors.bathrooms}</HelperText>}
            </View>
          </View>
          
          <View style={styles.formSwitch}>
            <Text style={styles.switchLabel}>Add resident information:</Text>
            <Switch
              value={addOccupant}
              onValueChange={setAddOccupant}
              color={theme.colors.primary}
            />
          </View>
          
          {addOccupant && (
            <Button
              mode="outlined"
              icon={() => <User size={18} color={theme.colors.primary} />}
              onPress={() => console.log('Navigate to add resident')}
              style={styles.addResidentButton}
            >
              Add Resident Information
            </Button>
          )}
        </View>
      </Surface>
    )
  );
  
  const renderBusinessFields = () => (
    unitType === 'business' && (
      <Surface style={styles.formCard} elevation={1}>
        <View style={styles.formCardHeader}>
          <Text style={styles.formCardTitle}>Business Details</Text>
        </View>
        <View style={styles.formCardContent}>
          <View style={styles.formSwitch}>
            <Text style={styles.switchLabel}>Add business tenant information:</Text>
            <Switch
              value={addOccupant}
              onValueChange={setAddOccupant}
              color={theme.colors.primary}
            />
          </View>
          
          {addOccupant && (
            <>
              <TextInput
                label="Business Name *"
                value={businessName}
                onChangeText={setBusinessName}
                mode="outlined"
                error={!!errors.businessName}
                style={styles.formInput}
                left={<TextInput.Icon icon={() => <Briefcase size={20} color={theme.colors.primary} />} />}
              />
              {errors.businessName && <HelperText type="error">{errors.businessName}</HelperText>}
              
              <TextInput
                label="Business Type *"
                value={businessType}
                onChangeText={setBusinessType}
                mode="outlined"
                error={!!errors.businessType}
                style={styles.formInput}
              />
              {errors.businessType && <HelperText type="error">{errors.businessType}</HelperText>}
              
              <TextInput
                label="Contact Person"
                value={contactPerson}
                onChangeText={setContactPerson}
                mode="outlined"
                style={styles.formInput}
                left={<TextInput.Icon icon={() => <User size={20} color={theme.colors.primary} />} />}
              />
              
              <View style={styles.formRow}>
                <View style={[styles.formColumn, { marginRight: 8 }]}>
                  <TextInput
                    label="Email"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    error={!!errors.contactEmail}
                    style={styles.formInput}
                  />
                  {errors.contactEmail && <HelperText type="error">{errors.contactEmail}</HelperText>}
                </View>
                
                <View style={styles.formColumn}>
                  <TextInput
                    label="Phone"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.formInput}
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formColumn, { marginRight: 8 }]}>
                  <TextInput
                    label="Lease Start"
                    value={leaseStart}
                    onChangeText={setLeaseStart}
                    mode="outlined"
                    placeholder="YYYY-MM-DD"
                    style={styles.formInput}
                    left={<TextInput.Icon icon={() => <Calendar size={20} color={theme.colors.primary} />} />}
                  />
                </View>
                
                <View style={styles.formColumn}>
                  <TextInput
                    label="Lease End"
                    value={leaseEnd}
                    onChangeText={setLeaseEnd}
                    mode="outlined"
                    placeholder="YYYY-MM-DD"
                    style={styles.formInput}
                    left={<TextInput.Icon icon={() => <Calendar size={20} color={theme.colors.primary} />} />}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </Surface>
    )
  );
  
  const renderOtherFields = () => (
    (unitType === 'storage' || unitType === 'parking') && (
      <Surface style={styles.formCard} elevation={1}>
        <View style={styles.formCardHeader}>
          <Text style={styles.formCardTitle}>{unitType === 'storage' ? 'Storage' : 'Parking'} Details</Text>
        </View>
        <View style={styles.formCardContent}>
          <View style={styles.formSwitch}>
            <Text style={styles.switchLabel}>Assign to a resident:</Text>
            <Switch
              value={addOccupant}
              onValueChange={setAddOccupant}
              color={theme.colors.primary}
            />
          </View>
          
          {addOccupant && (
            <Button
              mode="outlined"
              icon={() => <User size={18} color={theme.colors.primary} />}
              onPress={() => console.log('Navigate to assign resident')}
              style={styles.addResidentButton}
            >
              Assign to Resident
            </Button>
          )}
        </View>
      </Surface>
    )
  );
  
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Unit" />
        <Appbar.Action icon="check" onPress={handleSubmit} />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.buildingName}>
            {currentBuilding ? currentBuilding.name : 'No building selected'}
          </Text>
          
          {renderTypeButtons()}
          {renderBasicInfo()}
          {renderResidentialFields()}
          {renderBusinessFields()}
          {renderOtherFields()}
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleSubmit} 
              style={styles.submitButton}
              icon={() => <PlusCircle size={18} color="#fff" />}
            >
              Create Unit
            </Button>
            <Button 
              mode="outlined" 
              onPress={resetForm} 
              style={styles.resetButton}
            >
              Reset Form
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  formCardHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  formCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  formCardContent: {
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  selectedTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 8,
  },
  selectedTypeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedTypeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  formInput: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  formColumn: {
    flex: 1,
  },
  formSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '400',
  },
  addResidentButton: {
    marginTop: 8,
  },
  statusChipsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statusChip: {
    marginRight: 8,
  },
  selectedStatusChip: {
    backgroundColor: '#e0f2ff',
  },
  selectedChipText: {
    color: '#0066c0',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  resetButton: {
    borderColor: '#ccc',
  },
});
