import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { ProfileScreen } from './ProfileScreen';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Grid, Row, Col } from '../../components/Grid';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Header } from '../../components/Header';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useAppSelector } from '../../store/hooks';

/**
 * Responsive layout for Profile screen with tablet optimizations
 */
export const ProfileTabletLayout = ({ navigation }: any) => {
  const theme = useTheme();
  const { isTablet, breakpoint } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  const { user } = useAppSelector(state => state.auth);

  // If not on tablet, render the regular profile screen
  if (!isTablet) {
    return <ProfileScreen navigation={navigation} />;
  }

  // Tablet-specific layout
  return (
    <ScreenContainer>
      <Header
        title="My Profile"
        subtitle="View and manage your profile information"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <Grid style={{ flex: 1, paddingHorizontal: 16 }}>
        <Row style={{ flex: 1 }}>
          {/* Left column with profile form */}
          <Col size={6} style={{ paddingRight: 8 }}>
            <Card style={[commonStyles.card, { marginBottom: 16 }]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>
                  Account Information
                </Text>
                <Text variant="bodyMedium" style={styles.sectionDescription}>
                  Update your personal information and settings
                </Text>
              </Card.Content>
            </Card>
            
            {/* Main profile component with hideHeader prop */}
            <ProfileScreen navigation={navigation} hideHeader={true} />
          </Col>
          
          {/* Right column with additional info */}
          <Col size={6} style={{ paddingLeft: 8 }}>
            <Card style={[commonStyles.card, { marginBottom: 16 }]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>Activity Overview</Text>
                
                <View style={styles.activitySection}>
                  <Text variant="titleSmall" style={styles.activityTitle}>Recent Logins</Text>
                  
                  <View style={styles.loginItem}>
                    <Text variant="bodyMedium">Today, 9:42 AM</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      Tirana, Albania • Chrome on MacOS
                    </Text>
                  </View>
                  
                  <View style={styles.loginItem}>
                    <Text variant="bodyMedium">Yesterday, 6:18 PM</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      Tirana, Albania • iOS App on iPhone
                    </Text>
                  </View>
                </View>
                
                <View style={styles.activitySection}>
                  <Text variant="titleSmall" style={styles.activityTitle}>Account Activity</Text>
                  
                  <View style={styles.activityItem}>
                    <Text variant="bodyMedium">Last password change</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      30 days ago
                    </Text>
                  </View>
                  
                  <View style={styles.activityItem}>
                    <Text variant="bodyMedium">Account created</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {/* Safely handle users without createdAt property */}
                      {new Date().toLocaleDateString()} {/* Fallback to current date */}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            
            <Card style={commonStyles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>Account Security</Text>
                <Text variant="bodyMedium" style={styles.securityDescription}>
                  Review your account security status and take action to protect your account.
                </Text>
                
                <View style={styles.securityItem}>
                  <Text variant="titleSmall">Password Strength</Text>
                  <View style={styles.passwordStrength}>
                    <View style={[styles.passwordStrengthBar, { backgroundColor: theme.colors.primary, flex: 0.7 }]} />
                    <View style={[styles.passwordStrengthBar, { backgroundColor: theme.colors.surfaceVariant, flex: 0.3 }]} />
                  </View>
                  <Text variant="bodySmall" style={{ color: theme.colors.primary }}>Good</Text>
                </View>
                
                <View style={styles.securityItem}>
                  <Text variant="titleSmall">Two-Factor Authentication</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.error }}>Not enabled</Text>
                  <Text variant="bodySmall" style={{ marginTop: 4 }}>
                    Enable two-factor authentication for additional security.
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Col>
        </Row>
      </Grid>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  activitySection: {
    marginTop: 16,
    paddingBottom: 16,
  },
  activityTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loginItem: {
    marginBottom: 12,
  },
  activityItem: {
    marginBottom: 12,
  },
  securityDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  securityItem: {
    marginTop: 16,
  },
  passwordStrength: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  passwordStrengthBar: {
    height: '100%',
  },
}); 