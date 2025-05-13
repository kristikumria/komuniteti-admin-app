import React from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface FormLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

/**
 * A component for consistent form layout and styling
 */
export const FormLayout = ({ children, scrollable = true }: FormLayoutProps) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  
  const content = (
    <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}
    >
      {scrollable ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },
}); 