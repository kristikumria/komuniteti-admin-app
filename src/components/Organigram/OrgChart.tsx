import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar, Surface, useTheme } from 'react-native-paper';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  image?: string;
  children?: OrgNode[];
}

interface OrgChartProps {
  node: OrgNode;
  level?: number;
}

const OrgChart: React.FC<OrgChartProps> = ({ node, level = 0 }) => {
  const theme = useTheme();
  const isRoot = level === 0;
  
  // Render differently based on role
  const getNodeColor = () => {
    switch (node.role) {
      case 'Business Manager':
        return theme.colors.primary;
      case 'Administrator':
        return theme.colors.secondary;
      case 'Building':
        return '#4CAF50'; // Green
      default:
        return theme.colors.surface;
    }
  };
  
  // Determine if the node has any children
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <View style={[styles.container, isRoot && styles.rootContainer]}>
      <Surface style={[styles.nodeContainer, { backgroundColor: getNodeColor() }]}>
        <View style={styles.nodeContent}>
          {node.image ? (
            <Avatar.Image 
              size={50} 
              source={{ uri: node.image }} 
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text 
              size={50} 
              label={node.name.substring(0, 2).toUpperCase()} 
              style={styles.avatar}
            />
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{node.name}</Text>
            <Text style={styles.roleText}>{node.role}</Text>
          </View>
        </View>
      </Surface>
      
      {hasChildren && (
        <View style={styles.childrenContainer}>
          <View style={styles.verticalLine} />
          
          <View style={styles.childrenRow}>
            {node.children!.map((child, index) => (
              <View key={child.id} style={styles.childWrapper}>
                {/* Horizontal connector line */}
                {index > 0 && <View style={styles.horizontalConnector} />}
                
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
    marginHorizontal: 10,
  },
  rootContainer: {
    marginTop: 20,
  },
  nodeContainer: {
    borderRadius: 8,
    padding: 12,
    elevation: 4,
    minWidth: 200,
  },
  nodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  childrenContainer: {
    marginTop: 20,
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: '#888',
    alignSelf: 'center',
  },
  childrenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  childWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  horizontalConnector: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: 0,
    height: 2,
    backgroundColor: '#888',
  },
});

export default OrgChart; 