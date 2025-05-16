import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Surface, 
  Text, 
  TextInput,
  Button,
  Divider,
  RadioButton,
  Checkbox,
  Switch,
  useTheme
} from 'react-native-paper';

import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { FormField } from '../../components/forms/FormField';
import { FormSection } from '../../components/forms/FormSection';
import { ContentCard } from '../../components/cards/ContentCard';
import { ActionCard } from '../../components/cards/ActionCard';
import { ElevationLevel } from '../../theme';
import { Mail, User, Lock, Home, Briefcase, Phone } from 'lucide-react-native';
import type { AppTheme } from '../../theme/theme';

/**
 * A showcase screen that demonstrates the form components and card system
 */
export const FormShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [gender, setGender] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Form is valid, handle submission
      console.log('Form submitted successfully');
    } else {
      console.log('Form has validation errors');
    }
  };

  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="Form Components"
        subtitle="MD3 Form & Card System"
        showBack
        elevation={ElevationLevel.Level2}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).container}>
          <Text variant="headlineMedium" style={styles(theme).heading}>
            Form & Card Components
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            This showcase demonstrates the form components and card system with Material Design 3 styling.
          </Text>

          <Divider style={styles(theme).divider} />
          
          {/* Card Showcase */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Card Components
          </Text>
          
          <ContentCard
            title="Content Card"
            subtitle="Standard card with title and content"
            elevation={ElevationLevel.Level1}
          >
            <Text variant="bodyMedium">
              This is a standard content card with a title, subtitle, and content area.
              Cards are used to organize related information.
            </Text>
          </ContentCard>
          
          <ContentCard
            title="Outlined Variant"
            subtitle="Card with an outline instead of elevation"
            variant="outlined"
          >
            <Text variant="bodyMedium">
              This card uses an outline instead of elevation for a flatter look.
              Good for less important content or when you want a subtler approach.
            </Text>
          </ContentCard>
          
          <ContentCard
            title="Filled Variant"
            subtitle="Card with a background color"
            variant="filled"
          >
            <Text variant="bodyMedium">
              This card uses a filled background for emphasis.
              Good for highlighting important content or for visual variety.
            </Text>
          </ContentCard>
          
          <ActionCard
            title="Action Card with Icon"
            subtitle="Tap to perform an action"
            icon={<User size={24} color={theme.colors.primary} />}
            onPress={() => console.log('Action card pressed')}
            showChevron
          />
          
          <ActionCard
            title="Outlined Action Card"
            subtitle="An alternative style for actions"
            icon={<Mail size={24} color={theme.colors.primary} />}
            variant="outlined"
            onPress={() => console.log('Outlined action card pressed')}
            showChevron
          />
          
          <Divider style={styles(theme).divider} />

          {/* Form Showcase */}
          <Text variant="titleLarge" style={styles(theme).sectionTitle}>
            Form Components
          </Text>
          
          <FormSection
            title="Personal Information"
            description="Please provide your personal details"
            elevation={ElevationLevel.Level1}
          >
            <View style={styles(theme).row}>
              <FormField
                label="First Name"
                error={errors.firstName}
                required
                style={styles(theme).halfField}
              >
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  error={!!errors.firstName}
                  mode="outlined"
                  left={<TextInput.Icon icon={() => <User size={20} color={theme.colors.onSurfaceVariant} />} />}
                />
              </FormField>
              
              <FormField
                label="Last Name"
                error={errors.lastName}
                required
                style={styles(theme).halfField}
              >
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  error={!!errors.lastName}
                  mode="outlined"
                  left={<TextInput.Icon icon={() => <User size={20} color={theme.colors.onSurfaceVariant} />} />}
                />
              </FormField>
            </View>

            <FormField
              label="Email Address"
              error={errors.email}
              helper="We'll never share your email with anyone else"
              required
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                error={!!errors.email}
                mode="outlined"
                keyboardType="email-address"
                left={<TextInput.Icon icon={() => <Mail size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </FormField>
          </FormSection>
          
          <FormSection
            title="Security"
            description="Create a secure password"
            elevation={ElevationLevel.Level1}
          >
            <FormField
              label="Password"
              error={errors.password}
              helper="Must be at least 8 characters"
              required
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={!!errors.password}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Lock size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </FormField>
            
            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              required
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={!!errors.confirmPassword}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Lock size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </FormField>
            
            <FormField helper="Stay logged in on this device">
              <View style={styles(theme).checkboxContainer}>
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text 
                  onPress={() => setRememberMe(!rememberMe)}
                  style={styles(theme).checkboxLabel}
                >
                  Remember me
                </Text>
              </View>
            </FormField>
          </FormSection>
          
          <FormSection
            title="Additional Information"
            description="Optional details for your profile"
            elevation={ElevationLevel.Level1}
          >
            <FormField
              label="Job Title"
            >
              <TextInput
                value={jobTitle}
                onChangeText={setJobTitle}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Briefcase size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </FormField>
            
            <FormField
              label="Company"
            >
              <TextInput
                value={company}
                onChangeText={setCompany}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Briefcase size={20} color={theme.colors.onSurfaceVariant} />} />}
              />
            </FormField>
            
            <View style={styles(theme).row}>
              <FormField
                label="Phone Number"
                style={styles(theme).halfField}
              >
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  mode="outlined"
                  left={<TextInput.Icon icon={() => <Phone size={20} color={theme.colors.onSurfaceVariant} />} />}
                />
              </FormField>
              
              <FormField
                label="Address"
                style={styles(theme).halfField}
              >
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  mode="outlined"
                  left={<TextInput.Icon icon={() => <Home size={20} color={theme.colors.onSurfaceVariant} />} />}
                />
              </FormField>
            </View>
            
            <FormField
              label="Gender"
            >
              <RadioButton.Group
                onValueChange={value => setGender(value)}
                value={gender}
              >
                <View style={styles(theme).radioContainer}>
                  <View style={styles(theme).radioOption}>
                    <RadioButton value="male" />
                    <Text 
                      onPress={() => setGender('male')}
                      style={styles(theme).radioLabel}
                    >
                      Male
                    </Text>
                  </View>
                  <View style={styles(theme).radioOption}>
                    <RadioButton value="female" />
                    <Text 
                      onPress={() => setGender('female')}
                      style={styles(theme).radioLabel}
                    >
                      Female
                    </Text>
                  </View>
                  <View style={styles(theme).radioOption}>
                    <RadioButton value="other" />
                    <Text 
                      onPress={() => setGender('other')}
                      style={styles(theme).radioLabel}
                    >
                      Other
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </FormField>
            
            <FormField
              helper="Receive updates about products and services"
            >
              <View style={styles(theme).switchContainer}>
                <Text style={styles(theme).switchLabel}>
                  Subscribe to newsletter
                </Text>
                <Switch
                  value={newsletter}
                  onValueChange={setNewsletter}
                />
              </View>
            </FormField>
          </FormSection>
          
          <View style={styles(theme).buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles(theme).submitButton}
            >
              Submit Form
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  scrollView: {
    flex: 1,
  },
  heading: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  description: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
  },
  sectionTitle: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onBackground,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: theme.spacing.xs,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.m,
    marginBottom: theme.spacing.xs,
  },
  radioLabel: {
    marginLeft: theme.spacing.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    paddingVertical: theme.spacing.xs,
  },
}); 