import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { SettingsScreen } from './SettingsScreen';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { Header } from '../../../components/Header';
import { Grid, Row, Col } from '../../../components/Grid';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

/**
 * Responsive layout for Settings screen with tablet optimizations
 */
export const SettingsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isTablet, breakpoint } = useBreakpoint();
  const { commonStyles } = useThemedStyles();

  // If not on tablet, render the regular settings screen
  if (!isTablet) {
    return <SettingsScreen />;
  }

  // Tablet-specific layout
  return (
    <ScreenContainer>
      <Header 
        title="Settings" 
        subtitle="Configure your account and application settings"
        showBack={true}
      />

      <Grid style={{ flex: 1, paddingHorizontal: 16 }}>
        <Row style={{ flex: 1 }}>
          {/* Left column with main settings */}
          <Col size={6} style={{ paddingRight: 8 }}>
            <Card style={[commonStyles.card, { marginBottom: 16 }]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>Account Settings</Text>
                <Text variant="bodyMedium" style={styles.sectionDescription}>
                  Configure your profile, notification preferences, and security settings
                </Text>
              </Card.Content>
            </Card>
            
            {/* Main settings component with hideHeader prop */}
            <SettingsScreen hideHeader={true} />
          </Col>
          
          {/* Right column with help and additional info */}
          <Col size={6} style={{ paddingLeft: 8 }}>
            <Card style={[commonStyles.card, { marginBottom: 16 }]}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>Settings Help</Text>
                <Text variant="bodyMedium" style={styles.sectionDescription}>
                  Learn how to configure your settings effectively for the best experience
                </Text>
                
                <View style={styles.helpSection}>
                  <Text variant="titleSmall" style={styles.helpTitle}>Dark Mode</Text>
                  <Text variant="bodySmall" style={styles.helpText}>
                    Switch between light and dark themes. Dark mode uses less battery on OLED screens 
                    and reduces eye strain in low-light environments.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text variant="titleSmall" style={styles.helpTitle}>Notification Settings</Text>
                  <Text variant="bodySmall" style={styles.helpText}>
                    Control which notifications you receive. Configure alerts for payments, 
                    new residents, maintenance requests, and important announcements.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text variant="titleSmall" style={styles.helpTitle}>Account Switching</Text>
                  <Text variant="bodySmall" style={styles.helpText}>
                    Switch between different properties or accounts without logging out.
                    Select the account you want to manage from the dropdown menu.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text variant="titleSmall" style={styles.helpTitle}>Language Settings</Text>
                  <Text variant="bodySmall" style={styles.helpText}>
                    Choose your preferred language for the application interface.
                    Auto-translation features for resident communications coming soon.
                  </Text>
                </View>
              </Card.Content>
            </Card>
            
            <Card style={commonStyles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionHeader}>Latest Updates</Text>
                <Text variant="bodyMedium" style={styles.versionInfo}>
                  Current Version: 1.2.5
                </Text>
                <Text variant="bodySmall" style={styles.updateInfo}>
                  • Improved tablet support with optimized layouts
                  • Added dark mode support
                  • Enhanced notification management
                  • Performance improvements
                </Text>
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
  helpSection: {
    marginTop: 16,
    paddingBottom: 16,
  },
  helpTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helpText: {
    lineHeight: 18,
  },
  versionInfo: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  updateInfo: {
    lineHeight: 20,
  },
}); 