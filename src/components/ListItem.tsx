import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme, Badge, Divider } from 'react-native-paper';
import { ChevronRight } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: {
    uri?: string;
    text?: string;
    icon?: React.ReactNode;
    color?: string;
  };
  leftIcon?: () => React.ReactNode;
  onPress?: () => void;
  badge?: {
    text: string;
    color?: string;
    icon?: React.ReactNode;
  };
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  showDivider?: boolean;
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
  showChevron = true,
  showDivider = true,
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const renderAvatar = () => {
    if (leftIcon) {
      return leftIcon();
    }
    
    if (!avatar) return null;
    
    if (avatar.uri) {
      return <Avatar.Image size={50} source={{ uri: avatar.uri }} style={styles.avatar} />;
    } else if (avatar.icon) {
      return (
        <Avatar.Icon 
          size={50} 
          icon={() => avatar.icon} 
          style={[
            styles.avatar,
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
            styles.avatar,
            { backgroundColor: avatar.color || theme.colors.primary },
          ]}
        />
      );
    }
  };
  
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        {renderAvatar()}
        
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[
              styles.title,
              { color: isDarkMode ? '#fff' : '#333' }
            ]}>
              {title}
            </Text>
            
            {subtitle && (
              <Text style={[
                styles.subtitle,
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}>
                {subtitle}
              </Text>
            )}
            
            {description && (
              <Text style={[
                styles.description,
                { color: isDarkMode ? '#888' : '#777' }
              ]} numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>
          
          <View style={styles.rightContainer}>
            {badge && (
              <View style={styles.badgeContainer}>
                {badge.icon && <View style={styles.badgeIcon}>{badge.icon}</View>}
                <Badge
                  size={22}
                  style={[
                    styles.badge,
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
                color={isDarkMode ? '#777' : '#999'}
                style={styles.chevron}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      {showDivider && (
        <Divider
          style={[
            styles.divider,
            { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 16,
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
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badge: {
    marginRight: 0,
  },
  chevron: {
    marginLeft: 8,
  },
  divider: {
    marginLeft: 16,
  },
});