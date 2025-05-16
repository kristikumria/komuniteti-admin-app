import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider, Switch, Surface, Appbar } from 'react-native-paper';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAccessibility, AccessibilitySettings } from '../../components/AccessibilityProvider';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppTheme } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

/**
 * Screen for managing accessibility settings following Material Design 3 guidelines.
 * Allows users to customize their accessibility preferences.
 */
export const AccessibilitySettingsScreen: React.FC = () => {
  const { settings, updateSetting } = useAccessibility();
  const { theme, commonStyles } = useThemedStyles();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  // Map of settings to user-friendly names and descriptions
  const settingsConfig = {
    screenReaderEnabled: {
      title: 'Screen Reader Support',
      description: 'Optimize for screen readers like VoiceOver or TalkBack',
      accessibilityHint: 'Toggle to optimize the app for screen readers'
    },
    reduceMotion: {
      title: 'Reduce Motion',
      description: 'Minimize animations throughout the app',
      accessibilityHint: 'Toggle to reduce or disable animations in the app'
    },
    highContrast: {
      title: 'High Contrast',
      description: 'Increase contrast for better readability',
      accessibilityHint: 'Toggle to increase contrast for better readability'
    },
    largeText: {
      title: 'Large Text',
      description: 'Use larger text sizes throughout the app',
      accessibilityHint: 'Toggle to use larger text sizes throughout the app'
    }
  };

  // Handle toggle changes
  const handleToggle = (setting: keyof AccessibilitySettings) => {
    updateSetting(setting, !settings[setting]);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Accessibility" />
      </Appbar.Header>
      
      <ScreenContainer scrollable={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          accessible={false}
          accessibilityLabel="Accessibility Settings"
        >
          <Surface style={styles.headerSection} elevation={0}>
            <Text
              style={styles.sectionTitle}
              variant="titleMedium"
              accessibilityRole="header"
            >
              Accessibility Settings
            </Text>
            <Text style={styles.description} variant="bodyMedium">
              Customize how you interact with the app to improve your experience.
            </Text>
          </Surface>

          <Divider style={styles.divider} />
          
          {/* Settings list */}
          <Surface style={styles.settingsContainer} elevation={0}>
            {(Object.entries(settingsConfig) as [keyof AccessibilitySettings, any][]).map(([key, config]) => (
              <View 
                key={key}
                style={styles.settingRow}
                accessible={true}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings[key] }}
                accessibilityLabel={config.title}
                accessibilityHint={config.accessibilityHint}
              >
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle} variant="titleSmall">
                    {config.title}
                  </Text>
                  <Text style={styles.settingDescription} variant="bodySmall">
                    {config.description}
                  </Text>
                </View>
                <Switch
                  value={settings[key]}
                  onValueChange={() => handleToggle(key)}
                  color={theme.colors.primary}
                />
              </View>
            ))}
          </Surface>
          
          <Surface style={styles.footer} elevation={0}>
            {settings.highContrast && (
              <View style={commonStyles.infoContainer}>
                <Text style={{color: theme.colors.onInfoContainer}} variant="bodySmall">
                  High contrast mode is enabled. This increases the contrast between text and backgrounds.
                </Text>
              </View>
            )}
            <Text style={styles.footerText} variant="bodySmall">
              These settings will be saved and applied across app sessions.
            </Text>
          </Surface>
        </ScrollView>
      </ScreenContainer>
    </>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  settingsContainer: {
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surfaceContainer,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.s,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
    backgroundColor: theme.colors.outlineVariant,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: theme.shapes.border.thin,
    borderBottomColor: theme.colors.outlineVariant,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  settingTitle: {
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  settingDescription: {
    color: theme.colors.onSurfaceVariant,
  },
  footer: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  footerText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
}); 