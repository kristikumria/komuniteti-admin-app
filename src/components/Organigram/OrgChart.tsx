import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar, Surface } from 'react-native-paper';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { OrgNode } from '../../services/organizationService';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface OrgChartProps {
  node: OrgNode;
  level?: number;
  animationDelay?: number;
}

/**
 * Organization chart component that displays organizational hierarchy
 * following Material Design 3 guidelines with proper elevation and animations.
 * 
 * @example
 * <OrgChart node={organizationData} />
 */
const OrgChart: React.FC<OrgChartProps> = ({ 
  node, 
  level = 0,
  animationDelay = 0
}) => {
  const { theme } = useThemedStyles();
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
        return theme.colors.tertiary; // Using tertiary instead of hardcoded green
      case 'Commercial':
        return theme.colors.tertiaryContainer; // Using tertiaryContainer instead of hardcoded orange
      case 'Building Type':
        return theme.colors.surfaceVariant;
      case 'Units':
        return theme.colors.secondaryContainer;
      case 'Residents':
        return theme.colors.primaryContainer;
      default:
        return theme.colors.surfaceVariant;
    }
  };
  
  // Get border color based on the node color
  const getBorderColor = () => {
    return theme.colors.outline;
  };
  
  // Get text color based on background color brightness
  const getTextColor = () => {
    const color = getNodeColor();
    // Use Material Design's on-color tokens
    if (color === theme.colors.primary) return theme.colors.onPrimary;
    if (color === theme.colors.secondary) return theme.colors.onSecondary;
    if (color === theme.colors.tertiary) return theme.colors.onTertiary;
    if (color === theme.colors.primaryContainer) return theme.colors.onPrimaryContainer;
    if (color === theme.colors.secondaryContainer) return theme.colors.onSecondaryContainer;
    if (color === theme.colors.tertiaryContainer) return theme.colors.onTertiaryContainer;
    if (color === theme.colors.surfaceVariant) return theme.colors.onSurfaceVariant;
    
    return theme.colors.onSurface;
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
  
  // Calculate animation delay based on level and position
  const delay = animationDelay + (level * 150);
  
  return (
    <Animated.View 
      style={[styles(theme).container, isRoot && styles(theme).rootContainer]}
      entering={FadeIn.delay(delay).duration(300)}
    >
      <Surface 
        style={[
          styles(theme).nodeContainer, 
          { 
            backgroundColor: getNodeColor(),
            borderColor: getBorderColor(),
            width: getNodeWidth(),
          }
        ]}
        elevation={isRoot ? ElevationLevel.Level3 : ElevationLevel.Level1}
      >
        <View 
          style={styles(theme).nodeContent}
          accessibilityLabel={`${node.name}, ${node.role}`}
          accessibilityRole="text"
        >
          {node.image ? (
            <Avatar.Image 
              size={40} 
              source={{ uri: node.image }} 
              style={styles(theme).avatar}
            />
          ) : (
            <Avatar.Text 
              size={40} 
              label={node.name.substring(0, 2).toUpperCase()} 
              style={[styles(theme).avatar, { backgroundColor: theme.colors.surfaceVariant }]}
              labelStyle={{ color: theme.colors.onSurfaceVariant }}
            />
          )}
          
          <View style={styles(theme).textContainer}>
            <Text 
              variant="labelLarge"
              style={{ color: getTextColor() }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {node.name}
            </Text>
            <Text 
              variant="bodySmall"
              style={{ color: getTextColor(), opacity: 0.8 }}
              numberOfLines={1}
            >
              {node.role}
            </Text>
          </View>
        </View>
      </Surface>
      
      {hasChildren && (
        <View style={styles(theme).childrenContainer}>
          <View style={[styles(theme).verticalLine, { backgroundColor: theme.colors.outlineVariant }]} />
          
          <View style={styles(theme).childrenRow}>
            {node.children!.map((child, index) => (
              <View key={child.id} style={styles(theme).childWrapper}>
                {/* Horizontal connector line */}
                {node.children!.length > 1 && (
                  <View 
                    style={[
                      styles(theme).horizontalConnector, 
                      { backgroundColor: theme.colors.outlineVariant }
                    ]} 
                  />
                )}
                
                {/* Child node */}
                <OrgChart 
                  node={child} 
                  level={level + 1} 
                  animationDelay={delay + (index * 100)}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  rootContainer: {
    marginTop: theme.spacing.m,
  },
  nodeContainer: {
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  nodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing.s,
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  childrenContainer: {
    marginTop: theme.spacing.m + theme.spacing.s,
  },
  verticalLine: {
    width: 2,
    height: theme.spacing.m + theme.spacing.xs,
    backgroundColor: theme.colors.outlineVariant,
    alignSelf: 'center',
  },
  childrenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
  },
  childWrapper: {
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: theme.spacing.s,
  },
  horizontalConnector: {
    position: 'absolute',
    top: -16,
    left: -50,
    right: -50,
    height: 2,
    backgroundColor: theme.colors.outlineVariant,
  },
});

export default OrgChart; 