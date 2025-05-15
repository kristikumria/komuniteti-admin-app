import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { AppTheme } from '../theme/theme';

interface MasterDetailViewProps {
  masterContent: ReactNode;
  detailContent: ReactNode;
  ratio?: number; // Ratio of master section (0.0-1.0)
  style?: StyleProp<ViewStyle>;
  masterStyle?: StyleProp<ViewStyle>;
  detailStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
  onlyShowDetailOnTablet?: boolean; // If true, only shows detail on tablet+
}

/**
 * A responsive master-detail layout component.
 * On phones, this will stack vertically or only show the master view with a way to navigate to detail.
 * On tablets, it will show a two-column layout with master and detail side by side.
 */
export const MasterDetailView: React.FC<MasterDetailViewProps> = ({
  masterContent,
  detailContent,
  ratio = 0.4, // Default to 40% master, 60% detail
  style,
  masterStyle,
  detailStyle,
  separatorStyle,
  onlyShowDetailOnTablet = false,
}) => {
  const theme = useTheme() as AppTheme;
  const { isTablet, isDesktop } = useBreakpoint();
  const [showDetail, setShowDetail] = useState(false);
  
  // Tablet/desktop view: side-by-side columns
  if (isTablet || isDesktop) {
    return (
      <View style={[styles.container, style]}>
        <View 
          style={[
            styles.masterContainer, 
            { width: `${ratio * 100}%` },
            masterStyle
          ]}
        >
          {masterContent}
        </View>
        
        <View 
          style={[
            styles.separator,
            { backgroundColor: theme.colors.outlineVariant },
            separatorStyle
          ]}
        />
        
        <View 
          style={[
            styles.detailContainer,
            { width: `${(1 - ratio) * 100}%` },
            detailStyle
          ]}
        >
          {detailContent}
        </View>
      </View>
    );
  }
  
  // Phone view: master with navigation to detail or stacked
  if (onlyShowDetailOnTablet) {
    // Only show master on phone, with a way to navigate to detail
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.fullWidth, masterStyle]}>
          {masterContent}
        </View>
      </View>
    );
  }
  
  // Show master or detail based on navigation state
  return (
    <View style={[styles.container, style]}>
      {!showDetail ? (
        <View style={[styles.fullWidth, masterStyle]}>
          {/* Wrap masterContent and inject showDetail setter when needed */}
          {masterContent}
        </View>
      ) : (
        <View style={[styles.fullWidth, detailStyle]}>
          {/* Wrap detailContent and inject showDetail setter when needed */}
          {detailContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  masterContainer: {
    flex: 0,
  },
  detailContainer: {
    flex: 0,
  },
  fullWidth: {
    width: '100%',
  },
  separator: {
    width: 1,
    height: '100%',
  },
}); 