import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

// This is a shared component, so it could be used with multiple stack types
type Props = {
  navigation: any;
  route: any;
};

export const MessagesScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Messages</Text>
      <Text>Messages will be displayed here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
}); 