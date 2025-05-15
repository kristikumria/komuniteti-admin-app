import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { 
  Text, 
  useTheme, 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Chip, 
  Searchbar, 
  FAB,
  Divider,
  Menu,
  ActivityIndicator,
  Portal,
  Dialog, 
  IconButton
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchInfoPoints, 
  fetchInfoPointsByBuilding,
  fetchInfoPointsByCategory,
  deleteInfoPoint, 
  togglePinStatus, 
  togglePublishStatus,
  selectInfoPoints,
  selectInfoPointsLoading,
  selectInfoPointsError,
  selectCategoryFilter,
  selectBuildingFilter,
  setCategoryFilter,
  setBuildingFilter
} from '../../../store/slices/infoPointSlice';
import { InfoPoint, InfoPointCategory } from '../../../types/infoPointTypes';
import { Building } from '../../../types/buildingTypes';
import { 
  MoreVertical, 
  Plus, 
  Edit, 
  Trash2, 
  PinIcon, 
  Eye, 
  Globe, 
  Filter,
  AlertTriangle,
  Book,
  FileQuestion,
  Phone,
  HardHat,
  Users,
  Pin,
  GripVertical
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { InfoPointForm } from './InfoPointForm';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

// Mock buildings data until we fix imports
const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Residence Plaza',
    address: 'Rruga Hoxha Tahsim 45',
    city: 'Tirana',
    zipCode: '1001',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    units: 24,
    floors: 6,
    buildYear: 2015,
    totalArea: 2400,
    propertyManager: 'Alba Property',
    description: 'Modern residential building with 24 units in the center of Tirana.',
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date('2023-05-15').toISOString(),
  },
  {
    id: '2',
    name: 'Park Apartments',
    address: 'Rruga Myslym Shyri 78',
    city: 'Tirana',
    zipCode: '1004',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    units: 36,
    floors: 8,
    buildYear: 2018,
    totalArea: 3600,
    propertyManager: 'Trend Property Management',
    description: 'Luxury apartment complex near the central park with modern amenities.',
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
  },
  {
    id: '3',
    name: 'City View Residences',
    address: 'Bulevardi Bajram Curri 120',
    city: 'Tirana',
    zipCode: '1019',
    country: 'Albania',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90',
    units: 48,
    floors: 12,
    buildYear: 2020,
    totalArea: 5400,
    propertyManager: 'Komuniteti Management',
    description: 'High-rise residential building with panoramic views of the city.',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-07-10').toISOString(),
  },
];

// Get icon for each category
const getCategoryIcon = (category: InfoPointCategory, color: string) => {
  switch (category) {
    case 'general':
      return <Book size={20} color={color} />;
    case 'guidelines':
      return <AlertTriangle size={20} color={color} />;
    case 'faq':
      return <FileQuestion size={20} color={color} />;
    case 'contacts':
      return <Phone size={20} color={color} />;
    case 'emergency':
      return <AlertTriangle size={20} color={color} />;
    case 'maintenance':
      return <HardHat size={20} color={color} />;
    case 'community':
      return <Users size={20} color={color} />;
    default:
      return <Book size={20} color={color} />;
  }
};

// Get human readable category name
const getCategoryLabel = (category: InfoPointCategory): string => {
  switch (category) {
    case 'general':
      return 'General';
    case 'guidelines':
      return 'Guidelines';
    case 'faq':
      return 'FAQ';
    case 'contacts':
      return 'Contacts';
    case 'emergency':
      return 'Emergency';
    case 'maintenance':
      return 'Maintenance';
    case 'community':
      return 'Community';
    case 'other':
      return 'Other';
    default:
      return category;
  }
};

export interface InfoPointsScreenProps {
  hideHeader?: boolean;
  customSelectHandler?: (infoPointId: string) => void;
}

export const InfoPointsScreen = ({ 
  hideHeader = false, 
  customSelectHandler 
}: InfoPointsScreenProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { commonStyles } = useThemedStyles();
  
  const infoPoints = useAppSelector(selectInfoPoints);
  const loading = useAppSelector(selectInfoPointsLoading);
  const error = useAppSelector(selectInfoPointsError);
  const currentCategoryFilter = useAppSelector(selectCategoryFilter);
  const currentBuildingFilter = useAppSelector(selectBuildingFilter);
  // Use mock buildings until we fix the import
  const buildings = MOCK_BUILDINGS;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const [filteredInfoPoints, setFilteredInfoPoints] = useState<InfoPoint[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedInfoPoint, setSelectedInfoPoint] = useState<InfoPoint | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // All available categories
  const categories: InfoPointCategory[] = [
    'general',
    'guidelines',
    'faq',
    'contacts',
    'emergency',
    'maintenance',
    'community',
    'other',
  ];
  
  useEffect(() => {
    dispatch(fetchInfoPoints());
  }, [dispatch]);
  
  useEffect(() => {
    // Apply search query filter
    let filtered = [...infoPoints];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ip => 
          ip.title.toLowerCase().includes(lowerQuery) ||
          ip.content.toLowerCase().includes(lowerQuery) ||
          (ip.buildingName && ip.buildingName.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredInfoPoints(filtered);
  }, [infoPoints, searchQuery]);
  
  const handleOpenMenu = (id: string) => {
    setVisibleMenuId(id);
  };
  
  const handleCloseMenu = () => {
    setVisibleMenuId(null);
  };
  
  const handleEdit = (infoPoint: InfoPoint) => {
    setSelectedInfoPoint(infoPoint);
    setShowEditDialog(true);
    handleCloseMenu();
  };
  
  const handleCreate = () => {
    setShowCreateDialog(true);
  };
  
  const handleDelete = (id: string) => {
    handleCloseMenu();
    Alert.alert(
      'Delete Info Point',
      'Are you sure you want to delete this info point? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteInfoPoint(id));
          } 
        }
      ]
    );
  };
  
  const handleTogglePin = (id: string) => {
    handleCloseMenu();
    dispatch(togglePinStatus(id));
  };
  
  const handleTogglePublish = (id: string) => {
    handleCloseMenu();
    dispatch(togglePublishStatus(id));
  };
  
  const handleCategoryFilter = (category: InfoPointCategory | null) => {
    if (category === currentCategoryFilter) {
      dispatch(setCategoryFilter(null));
    } else {
      dispatch(setCategoryFilter(category));
      if (category) {
        dispatch(fetchInfoPointsByCategory(category));
      } else {
        dispatch(fetchInfoPoints());
      }
    }
    setShowFilterMenu(false);
  };
  
  const handleBuildingFilter = (buildingId: string | null) => {
    if (buildingId === currentBuildingFilter) {
      dispatch(setBuildingFilter(null));
    } else {
      dispatch(setBuildingFilter(buildingId));
      if (buildingId) {
        dispatch(fetchInfoPointsByBuilding(buildingId));
      } else {
        dispatch(fetchInfoPoints());
      }
    }
    setShowFilterMenu(false);
  };
  
  const clearFilters = () => {
    dispatch(setCategoryFilter(null));
    dispatch(setBuildingFilter(null));
    dispatch(fetchInfoPoints());
    setShowFilterMenu(false);
  };
  
  const renderInfoPointItem = ({ item }: { item: InfoPoint }) => (
    <Card 
      style={[styles.card, item.pinned && styles.pinnedCard]} 
      key={item.id}
      onPress={() => {
        if (customSelectHandler) {
          customSelectHandler(item.id);
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.categoryIconContainer}>
            {getCategoryIcon(item.category, theme.colors.primary)}
          </View>
          <View style={{ flex: 1 }}>
            <Title style={styles.cardTitle}>{item.title}</Title>
            {item.buildingName && (
              <Text variant="bodySmall" style={styles.buildingInfo}>
                {item.buildingName}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {item.pinned && <Pin size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />}
          <Menu
            visible={visibleMenuId === item.id}
            onDismiss={handleCloseMenu}
            anchor={
              <IconButton
                icon={() => <MoreVertical size={20} color={theme.colors.onSurface} />}
                onPress={() => handleOpenMenu(item.id)}
              />
            }
          >
            <Menu.Item 
              leadingIcon={() => <Edit size={20} color={theme.colors.onSurface} />}
              onPress={() => handleEdit(item)}
              title="Edit" 
            />
            <Menu.Item 
              leadingIcon={() => <Pin size={20} color={theme.colors.onSurface} />}
              onPress={() => handleTogglePin(item.id)}
              title={item.pinned ? "Unpin" : "Pin"} 
            />
            <Menu.Item 
              leadingIcon={() => <Globe size={20} color={theme.colors.onSurface} />}
              onPress={() => handleTogglePublish(item.id)}
              title={item.published ? "Unpublish" : "Publish"} 
            />
            <Divider />
            <Menu.Item 
              leadingIcon={() => <Trash2 size={20} color={theme.colors.error} />}
              onPress={() => handleDelete(item.id)}
              title="Delete"
              titleStyle={{ color: theme.colors.error }}
            />
          </Menu>
        </View>
      </View>
      
      <Card.Content>
        <Paragraph numberOfLines={3} style={styles.cardContent}>
          {item.content}
        </Paragraph>
        
        <View style={styles.cardFooter}>
          <Chip 
            style={styles.categoryChip}
            textStyle={{ color: theme.colors.onPrimary }}
          >
            {getCategoryLabel(item.category)}
          </Chip>
          
          {item.published ? (
            <Chip 
              style={[styles.statusChip, { backgroundColor: theme.colors.tertiary }]}
              textStyle={{ color: theme.colors.onTertiary }}
            >
              Published
            </Chip>
          ) : (
            <Chip 
              style={[styles.statusChip, { backgroundColor: theme.colors.surfaceVariant }]}
              textStyle={{ color: theme.colors.onSurfaceVariant }}
            >
              Draft
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {!hideHeader && (
        <Header title="InfoPoints" subtitle="Manage building information and guidelines" />
      )}
      
      <View style={styles.searchFilterContainer}>
        <Searchbar
          placeholder="Search info points..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <TouchableOpacity 
          onPress={() => setShowFilterMenu(true)}
          style={[
            styles.filterButton,
            { 
              backgroundColor: (currentCategoryFilter || currentBuildingFilter) 
                ? theme.colors.primaryContainer 
                : theme.colors.surfaceVariant
            }
          ]}
        >
          <Filter size={24} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
      
      {/* Active Filters */}
      {(currentCategoryFilter || currentBuildingFilter) && (
        <View style={styles.filterChipsContainer}>
          {currentCategoryFilter && (
            <Chip 
              onClose={() => handleCategoryFilter(null)}
              icon={() => getCategoryIcon(currentCategoryFilter, theme.colors.onSurfaceVariant)}
              style={{ marginRight: 8 }}
            >
              {getCategoryLabel(currentCategoryFilter)}
            </Chip>
          )}
          
          {currentBuildingFilter && (
            <Chip 
              onClose={() => handleBuildingFilter(null)}
              icon="building"
            >
              {buildings.find(b => b.id === currentBuildingFilter)?.name || 'Building'}
            </Chip>
          )}
        </View>
      )}
      
      {/* Filter Dialog */}
      <Portal>
        <Dialog visible={showFilterMenu} onDismiss={() => setShowFilterMenu(false)}>
          <Dialog.Title>Filter Info Points</Dialog.Title>
          <Dialog.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>Category</Text>
            <View style={styles.filterOptions}>
              {categories.map(category => (
                <Chip
                  key={category}
                  selected={currentCategoryFilter === category}
                  onPress={() => handleCategoryFilter(category)}
                  style={styles.filterChip}
                  showSelectedCheck
                  icon={() => getCategoryIcon(category, theme.colors.onSurfaceVariant)}
                >
                  {getCategoryLabel(category)}
                </Chip>
              ))}
            </View>
            
            {buildings.length > 0 && (
              <>
                <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Buildings</Text>
                <View style={styles.filterOptions}>
                  {buildings.map(building => (
                    <Chip
                      key={building.id}
                      selected={currentBuildingFilter === building.id}
                      onPress={() => handleBuildingFilter(building.id)}
                      style={styles.filterChip}
                      showSelectedCheck
                    >
                      {building.name}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => clearFilters()}>Clear All</Button>
            <Button onPress={() => setShowFilterMenu(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => dispatch(fetchInfoPoints())}
            style={{ marginTop: 12 }}
          >
            Retry
          </Button>
        </View>
      )}
      
      {!loading && !error && (
        <>
          {filteredInfoPoints.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="titleMedium">No info points found</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                {searchQuery 
                  ? "Try adjusting your search or filters"
                  : "Add your first information point to help residents"
                }
              </Text>
              {!searchQuery && (
                <Button 
                  mode="contained" 
                  icon={() => <Plus size={18} color="white" />}
                  onPress={handleCreate}
                  style={{ marginTop: 16 }}
                >
                  Add Info Point
                </Button>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredInfoPoints}
              renderItem={renderInfoPointItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
      
      {/* FAB for adding new info point */}
      <FAB
        icon={() => <Plus size={24} color="#fff" />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreate}
      />
      
      {/* Create Info Point Dialog - replace placeholder with InfoPointForm */}
      <Portal>
        <Dialog
          visible={showCreateDialog}
          onDismiss={() => setShowCreateDialog(false)}
          style={{ backgroundColor: theme.colors.background, maxWidth: '90%', alignSelf: 'center' }}
        >
          <Dialog.Title>Add New Info Point</Dialog.Title>
          <Dialog.Content>
            <InfoPointForm
              mode="create"
              onSubmit={() => {
                setShowCreateDialog(false);
                dispatch(fetchInfoPoints());
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
      
      {/* Edit Info Point Dialog - replace placeholder with InfoPointForm */}
      <Portal>
        <Dialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          style={{ backgroundColor: theme.colors.background, maxWidth: '90%', alignSelf: 'center' }}
        >
          <Dialog.Title>Edit Info Point</Dialog.Title>
          <Dialog.Content>
            {selectedInfoPoint && (
              <InfoPointForm
                mode="edit"
                infoPoint={selectedInfoPoint}
                onSubmit={() => {
                  setShowEditDialog(false);
                  dispatch(fetchInfoPoints());
                }}
                onCancel={() => setShowEditDialog(false)}
              />
            )}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Account for FAB
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  categoryIconContainer: {
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 4,
  },
  buildingInfo: {
    marginTop: 4,
  },
  cardContent: {
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  statusChip: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pinnedCard: {
    borderColor: 'red',
    borderWidth: 2,
  },
}); 