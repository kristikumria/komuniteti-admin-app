import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar, Surface, useTheme } from 'react-native-paper';
import { useAppSelector } from '../../store/hooks';
import { OrgNode } from '../../services/organizationService';

interface OrgChartProps {
  node: OrgNode;
  level?: number;
}

const OrgChart: React.FC<OrgChartProps> = ({ node, level = 0 }) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const isRoot = level === 0;
  
  // Get color based on node role
  const getNodeColor = () => {
    switch (node.role) {
      case 'Business Manager':
        return theme.colors.primary;
      case 'Administrator':
        return theme.colors.secondary;
      case 'Building':
      case 'Residential':
        return '#4CAF50'; // Green
      case 'Commercial':
        return '#FF9800'; // Orange
      case 'Building Type':
        return '#607D8B'; // Blue Grey
      case 'Units':
        return '#00BCD4'; // Cyan
      case 'Residents':
        return '#9C27B0'; // Purple
      default:
        return theme.colors.surfaceVariant;
    }
  };
  
  // Get border color based on the node color but lighter
  const getBorderColor = () => {
    const color = getNodeColor();
    // If dark mode, lighten; if light mode, darken slightly
    return isDarkMode 
      ? lightenColor(color, 30) 
      : darkenColor(color, 10);
  };
  
  // Get text color based on background color brightness
  const getTextColor = () => {
    const color = getNodeColor();
    // Check if the color is light or dark and return appropriate text color
    return isLightColor(color) ? '#000000' : '#FFFFFF';
  };
  
  // Utility to check if a color is light
  const isLightColor = (color: string) => {
    // Simple heuristic for light/dark determination
    const hexColor = color.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };
  
  // Utility to lighten a color
  const lightenColor = (color: string, amount: number) => {
    return color; // Simplified for now
  };
  
  // Utility to darken a color
  const darkenColor = (color: string, amount: number) => {
    return color; // Simplified for now
  };
  
  // Get appropriate node width based on level
  const getNodeWidth = () => {
    switch (level) {
      case 0: return 240; // Root node width
      case 1: return 220; // First level nodes
      case 2: return 200; // Second level nodes
      default: return 180; // Deeper levels
    }
  };
  
  // Determine if the node has any children
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <View style={[styles.container, isRoot && styles.rootContainer]}>
      <Surface 
        style={[
          styles.nodeContainer, 
          { 
            backgroundColor: getNodeColor(),
            borderColor: getBorderColor(),
            width: getNodeWidth(),
            shadowColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)',
            shadowOffset: { width: 0, height: isRoot ? 4 : 2 },
            shadowOpacity: isRoot ? 0.3 : 0.2,
            shadowRadius: isRoot ? 5 : 3,
          }
        ]}
      >
        <View style={styles.nodeContent}>
          {node.image ? (
            <Avatar.Image 
              size={40} 
              source={{ uri: node.image }} 
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text 
              size={40} 
              label={node.name.substring(0, 2).toUpperCase()} 
              style={[styles.avatar, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}
              labelStyle={{ color: isDarkMode ? '#fff' : '#333' }}
            />
          )}
          
          <View style={styles.textContainer}>
            <Text 
              style={[styles.nameText, { color: getTextColor() }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {node.name}
            </Text>
            <Text 
              style={[styles.roleText, { color: getTextColor() + 'CC' /* 80% opacity */ }]}
              numberOfLines={1}
            >
              {node.role}
            </Text>
          </View>
        </View>
      </Surface>
      
      {hasChildren && (
        <View style={styles.childrenContainer}>
          <View style={[styles.verticalLine, { backgroundColor: isDarkMode ? '#555' : '#ccc' }]} />
          
          <View style={styles.childrenRow}>
            {node.children!.map((child, index) => (
              <View key={child.id} style={styles.childWrapper}>
                {/* Horizontal connector line */}
                {node.children!.length > 1 && (
                  <View 
                    style={[
                      styles.horizontalConnector, 
                      { backgroundColor: isDarkMode ? '#555' : '#ccc' }
                    ]} 
                  />
                )}
                
                {/* Child node */}
                <OrgChart node={child} level={level + 1} />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 20,
  },
  rootContainer: {
    marginTop: 20,
  },
  nodeContainer: {
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  nodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#888',
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  roleText: {
    fontSize: 12,
    marginTop: 2,
  },
  childrenContainer: {
    marginTop: 24,
  },
  verticalLine: {
    width: 2,
    height: 24,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  childrenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  childWrapper: {
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 8,
  },
  horizontalConnector: {
    position: 'absolute',
    top: -16,
    left: -50,
    right: -50,
    height: 2,
    backgroundColor: '#ccc',
  },
});

export default OrgChart; 