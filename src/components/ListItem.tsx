import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar, Badge, Divider, Surface } from 'react-native-paper';
import { ChevronRight } from 'lucide-react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: {
    uri?: string;
    text?: string;
    icon?: React.ReactNode;
    color?: string;
  };
  leftIcon?: React.ReactNode | React.ComponentType<any> | (() => React.ReactNode);
  onPress?: () => void;
  badge?: {
    text: string;
    color?: string;
    icon?: React.ReactNode;
  };
  rightContent?: React.ReactNode;
  rightTitle?: React.ReactNode | string;
  rightSubtitle?: React.ReactNode | string;
  showChevron?: boolean;
  showDivider?: boolean;
  selected?: boolean;
  elevationLevel?: ElevationLevel;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  avatar,
  leftIcon,
  onPress,
  badge,
  rightContent,
  rightTitle,
  rightSubtitle,
  showChevron = true,
  showDivider = true,
  selected = false,
  elevationLevel = ElevationLevel.Level0,
}) => {
  const { theme } = useThemedStyles();
  
  const renderAvatar = () => {
    if (leftIcon) {
      if (typeof leftIcon === 'function' && !('$$typeof' in (leftIcon as any))) {
        return (leftIcon as () => React.ReactNode)();
      } else if (React.isValidElement(leftIcon)) {
        return leftIcon;
      } else {
        const IconComponent = leftIcon as React.ComponentType<any>;
        return <IconComponent size={24} color={theme.colors.primary} />;
      }
    }
    
    if (!avatar) return null;
    
    if (avatar.uri) {
      return <Avatar.Image size={50} source={{ uri: avatar.uri }} style={styles(theme).avatar} />;
    } else if (avatar.icon) {
      return (
        <Avatar.Icon 
          size={50} 
          icon={() => avatar.icon} 
          style={[
            styles(theme).avatar,
            { backgroundColor: avatar.color || theme.colors.primary },
          ]} 
        />
      );
    } else {
      return (
        <Avatar.Text
          size={50}
          label={avatar.text || title.charAt(0).toUpperCase()}
          style={[
            styles(theme).avatar,
            { backgroundColor: avatar.color || theme.colors.primary },
          ]}
        />
      );
    }
  };
  
  return (
    <View>
      <Surface 
        style={[
          styles(theme).surface,
          selected && { backgroundColor: theme.colors.primaryContainer }
        ]}
        elevation={selected ? ElevationLevel.Level1 : elevationLevel}
      >
        <TouchableOpacity
          style={styles(theme).container}
          onPress={onPress}
          disabled={!onPress}
        >
          {renderAvatar()}
          
          <View style={styles(theme).content}>
            <View style={styles(theme).textContainer}>
              <Text 
                variant="bodyLarge" 
                style={[
                  styles(theme).title,
                  selected && { color: theme.colors.onPrimaryContainer }
                ]}
              >
                {title}
              </Text>
              
              {subtitle && (
                <Text 
                  variant="bodyMedium" 
                  style={[
                    styles(theme).subtitle,
                    selected && { color: theme.colors.onPrimaryContainer }
                  ]}
                >
                  {subtitle}
                </Text>
              )}
              
              {description && (
                <Text 
                  variant="bodySmall" 
                  style={[
                    styles(theme).description,
                    selected && { color: theme.colors.onPrimaryContainer }
                  ]} 
                  numberOfLines={2}
                >
                  {description}
                </Text>
              )}
            </View>
            
            <View style={styles(theme).rightContainer}>
              {(rightTitle || rightSubtitle) && (
                <View style={styles(theme).rightTextContainer}>
                  {rightTitle && (
                    typeof rightTitle === 'string' ? (
                      <Text 
                        variant="bodyMedium" 
                        style={[
                          styles(theme).rightTitle,
                          selected && { color: theme.colors.onPrimaryContainer }
                        ]}
                      >
                        {rightTitle}
                      </Text>
                    ) : rightTitle
                  )}
                  
                  {rightSubtitle && (
                    typeof rightSubtitle === 'string' ? (
                      <Text 
                        variant="bodySmall" 
                        style={[
                          styles(theme).rightSubtitle,
                          selected && { color: theme.colors.onPrimaryContainer }
                        ]}
                      >
                        {rightSubtitle}
                      </Text>
                    ) : rightSubtitle
                  )}
                </View>
              )}
              
              {badge && (
                <View style={styles(theme).badgeContainer}>
                  {badge.icon && <View style={styles(theme).badgeIcon}>{badge.icon}</View>}
                  <Badge
                    size={22}
                    style={[
                      styles(theme).badge,
                      { backgroundColor: badge.color || theme.colors.primary }
                    ]}
                  >
                    {badge.text}
                  </Badge>
                </View>
              )}
              
              {rightContent}
              
              {showChevron && (
                <ChevronRight
                  size={18}
                  color={selected ? theme.colors.onPrimaryContainer : theme.colors.outline}
                  style={styles(theme).chevron}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Surface>
      
      {showDivider && (
        <Divider style={styles(theme).divider} />
      )}
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  surface: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  avatar: {
    marginRight: theme.spacing.m,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  subtitle: {
    marginBottom: 2,
    color: theme.colors.onSurfaceVariant,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing.m,
  },
  rightTextContainer: {
    marginRight: theme.spacing.s,
    alignItems: 'flex-end',
  },
  rightTitle: {
    marginBottom: 2,
    color: theme.colors.onSurface,
  },
  rightSubtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badge: {
    marginVertical: 1,
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant,
  },
});