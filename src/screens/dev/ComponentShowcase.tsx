import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Surface, 
  Text, 
  Button, 
  Divider, 
  Switch,
  TextInput,
  Checkbox,
  RadioButton,
  Chip,
  Avatar,
  IconButton,
  List,
  Card,
  SegmentedButtons
} from 'react-native-paper';
import { 
  AlertCircle,
  Info,
  Check,
  X,
  ChevronRight
} from 'lucide-react-native';

import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppHeader } from '../../components/AppHeader';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

/**
 * A comprehensive showcase of all UI components with MD3 styling
 * Serves as documentation and a design system reference
 */
export const ComponentShowcase = () => {
  const { theme, commonStyles } = useThemedStyles();
  const [switchValue, setSwitchValue] = React.useState(false);
  const [text, setText] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('first');
  const [segmentValue, setSegmentValue] = React.useState('');

  // Component section wrapper
  const ComponentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles(theme).section}>
      <Text variant="titleLarge" style={styles(theme).sectionTitle}>{title}</Text>
      <Surface elevation={ElevationLevel.Level1} style={styles(theme).componentContainer}>
        {children}
      </Surface>
    </View>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <AppHeader
        title="Component Showcase"
        subtitle="MD3 Design System"
        showBack
        elevation={ElevationLevel.Level3}
      />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).container}>
          <Text variant="headlineMedium" style={styles(theme).heading}>
            Material Design 3 Components
          </Text>
          <Text variant="bodyMedium" style={styles(theme).description}>
            This showcase demonstrates all core UI components styled according to our Material Design 3 implementation.
          </Text>

          <Divider style={styles(theme).divider} />

          {/* Typography */}
          <ComponentSection title="Typography">
            <Text variant="displayLarge">Display Large</Text>
            <Text variant="displayMedium">Display Medium</Text>
            <Text variant="displaySmall">Display Small</Text>
            
            <Text variant="headlineLarge">Headline Large</Text>
            <Text variant="headlineMedium">Headline Medium</Text>
            <Text variant="headlineSmall">Headline Small</Text>
            
            <Text variant="titleLarge">Title Large</Text>
            <Text variant="titleMedium">Title Medium</Text>
            <Text variant="titleSmall">Title Small</Text>
            
            <Text variant="bodyLarge">Body Large - The quick brown fox jumps over the lazy dog.</Text>
            <Text variant="bodyMedium">Body Medium - The quick brown fox jumps over the lazy dog.</Text>
            <Text variant="bodySmall">Body Small - The quick brown fox jumps over the lazy dog.</Text>
            
            <Text variant="labelLarge">Label Large</Text>
            <Text variant="labelMedium">Label Medium</Text>
            <Text variant="labelSmall">Label Small</Text>
          </ComponentSection>
          
          {/* Buttons */}
          <ComponentSection title="Buttons">
            <View style={styles(theme).row}>
              <Button mode="contained" onPress={() => {}}>Contained</Button>
              <Button mode="contained-tonal" onPress={() => {}}>Tonal</Button>
            </View>
            <View style={styles(theme).row}>
              <Button mode="outlined" onPress={() => {}}>Outlined</Button>
              <Button mode="elevated" onPress={() => {}}>Elevated</Button>
            </View>
            <View style={styles(theme).row}>
              <Button mode="text" onPress={() => {}}>Text</Button>
              <Button 
                mode="contained" 
                icon="plus" 
                onPress={() => {}}
              >
                With Icon
              </Button>
            </View>
            <View style={styles(theme).row}>
              <Button mode="contained" loading>Loading</Button>
              <Button mode="contained" disabled>Disabled</Button>
            </View>
          </ComponentSection>
          
          {/* Inputs */}
          <ComponentSection title="Inputs">
            <TextInput
              label="Standard Input"
              value={text}
              onChangeText={text => setText(text)}
              style={styles(theme).input}
            />
            
            <TextInput
              label="With Placeholder"
              placeholder="Enter text here"
              style={styles(theme).input}
            />
            
            <TextInput
              label="Disabled Input"
              value="Cannot be edited"
              disabled
              style={styles(theme).input}
            />
            
            <TextInput
              label="Error Input"
              error={true}
              value="Invalid input"
              style={styles(theme).input}
            />
            
            <TextInput
              label="With Helper Text"
              value={text}
              onChangeText={text => setText(text)}
              style={styles(theme).input}
            />
            <Text variant="bodySmall" style={{ marginTop: -theme.spacing.s, marginBottom: theme.spacing.m, color: theme.colors.onSurfaceVariant }}>
              Supporting text
            </Text>
            
            <TextInput
              label="With Icon"
              value={text}
              onChangeText={text => setText(text)}
              style={styles(theme).input}
              left={<TextInput.Icon icon="account" />}
            />
          </ComponentSection>
          
          {/* Selection Controls */}
          <ComponentSection title="Selection Controls">
            <View style={styles(theme).controlRow}>
              <Text variant="bodyMedium">Switch</Text>
              <Switch
                value={switchValue}
                onValueChange={() => setSwitchValue(!switchValue)}
              />
            </View>
            
            <View style={styles(theme).controlRow}>
              <Text variant="bodyMedium">Checkbox</Text>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked(!checked)}
              />
            </View>
            
            <RadioButton.Group onValueChange={value => setRadioValue(value)} value={radioValue}>
              <View style={styles(theme).controlRow}>
                <Text variant="bodyMedium">Radio Option 1</Text>
                <RadioButton value="first" />
              </View>
              <View style={styles(theme).controlRow}>
                <Text variant="bodyMedium">Radio Option 2</Text>
                <RadioButton value="second" />
              </View>
            </RadioButton.Group>
            
            <View style={styles(theme).segmentedContainer}>
              <SegmentedButtons
                value={segmentValue}
                onValueChange={setSegmentValue}
                buttons={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
              />
            </View>
          </ComponentSection>
          
          {/* Lists */}
          <ComponentSection title="Lists">
            <List.Section>
              <List.Subheader>Recent Activity</List.Subheader>
              
              <List.Item
                title="Item 1"
                description="Description text for item 1"
                left={props => <List.Icon {...props} icon="folder" />}
                right={props => <ChevronRight {...props} size={20} />}
              />
              
              <Divider />
              
              <List.Item
                title="Item 2"
                description="Description text for item 2"
                left={props => <List.Icon {...props} icon="star" />}
                right={props => <ChevronRight {...props} size={20} />}
              />
              
              <Divider />
              
              <List.Item
                title="Item 3"
                description="Description text for item 3"
                left={props => <Avatar.Text size={40} label="JD" />}
                right={props => <ChevronRight {...props} size={20} />}
              />
            </List.Section>
          </ComponentSection>
          
          {/* Chips */}
          <ComponentSection title="Chips">
            <View style={styles(theme).chipContainer}>
              <Chip onPress={() => {}}>Default</Chip>
              <Chip icon="information" onPress={() => {}}>With Icon</Chip>
              <Chip selected onPress={() => {}}>Selected</Chip>
              <Chip disabled>Disabled</Chip>
              <Chip onPress={() => {}} onClose={() => {}}>Closable</Chip>
              <Chip elevated onPress={() => {}}>Elevated</Chip>
              <Chip mode="outlined" onPress={() => {}}>Outlined</Chip>
              <Chip mode="flat" onPress={() => {}}>Flat</Chip>
            </View>
          </ComponentSection>
          
          {/* Cards */}
          <ComponentSection title="Cards">
            <Card style={styles(theme).card}>
              <Card.Title 
                title="Card Title" 
                subtitle="Card Subtitle"
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  This is the content of the card. It can contain any elements.
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button>Cancel</Button>
                <Button mode="contained">OK</Button>
              </Card.Actions>
            </Card>
            
            <Card style={styles(theme).card} mode="outlined">
              <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
              <Card.Title title="Outlined Card with Cover" />
              <Card.Content>
                <Text variant="bodyMedium">
                  Cards can also have covers and be outlined.
                </Text>
              </Card.Content>
            </Card>
            
            <Surface elevation={ElevationLevel.Level2} style={styles(theme).card}>
              <Card.Title title="Surface with Card Content" />
              <Card.Content>
                <Text variant="bodyMedium">
                  You can combine Surface with Card content for custom elevation.
                </Text>
              </Card.Content>
            </Surface>
          </ComponentSection>
          
          {/* Icon Buttons */}
          <ComponentSection title="Icon Buttons">
            <View style={styles(theme).iconButtonRow}>
              <IconButton icon="home" size={24} onPress={() => {}} />
              <IconButton icon="magnify" size={24} onPress={() => {}} />
              <IconButton icon="heart" size={24} onPress={() => {}} />
              <IconButton icon="bell" size={24} onPress={() => {}} />
            </View>
            
            <View style={styles(theme).iconButtonRow}>
              <IconButton icon="home" size={24} onPress={() => {}} mode="contained" />
              <IconButton icon="magnify" size={24} onPress={() => {}} mode="contained-tonal" />
              <IconButton icon="heart" size={24} onPress={() => {}} mode="outlined" />
              <IconButton icon="bell" size={24} onPress={() => {}} disabled />
            </View>
          </ComponentSection>
          
          {/* Avatars */}
          <ComponentSection title="Avatars">
            <View style={styles(theme).avatarRow}>
              <Avatar.Icon size={40} icon="account" />
              <Avatar.Text size={40} label="AB" />
              <Avatar.Image size={40} source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe' }} />
              <Avatar.Icon 
                size={40} 
                icon="folder" 
                color={theme.colors.onPrimary} 
                style={{ backgroundColor: theme.colors.primary }} 
              />
            </View>
          </ComponentSection>
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
    marginBottom: theme.spacing.l,
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginVertical: theme.spacing.m,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
  },
  componentContainer: {
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
    flexWrap: 'wrap',
    gap: theme.spacing.s,
  },
  input: {
    marginBottom: theme.spacing.m,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  segmentedContainer: {
    marginBottom: theme.spacing.m,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  card: {
    marginBottom: theme.spacing.m,
  },
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.m,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.m,
  },
}); 