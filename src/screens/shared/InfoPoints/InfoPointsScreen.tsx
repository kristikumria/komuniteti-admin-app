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
  Users
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { InfoPointForm } from './InfoPointForm';
import { commonStyles } from '../../../styles/commonStyles';

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

export const InfoPointsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
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
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftColor: item.pinned ? theme.colors.primary : theme.colors.outline,
          borderLeftWidth: item.pinned ? 4 : 1,
        }
      ]}
      mode="outlined"
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title>{item.title}</Title>
            <View style={styles.tagsContainer}>
              <Chip 
                mode="outlined" 
                style={[styles.categoryChip, { borderColor: theme.colors.outline }]}
                icon={() => getCategoryIcon(item.category, theme.colors.onSurfaceVariant)}
              >
                {getCategoryLabel(item.category)}
              </Chip>
              
              {item.buildingName && (
                <Chip 
                  mode="outlined" 
                  style={[styles.buildingChip, { borderColor: theme.colors.outline }]}
                >
                  {item.buildingName}
                </Chip>
              )}
            </View>
          </View>
          
          <Menu
            visible={visibleMenuId === item.id}
            onDismiss={handleCloseMenu}
            anchor={
              <IconButton
                icon={() => <MoreVertical size={20} color={theme.colors.onSurfaceVariant} />}
                onPress={() => handleOpenMenu(item.id)}
              />
            }
          >
            <Menu.Item 
              leadingIcon={() => <Eye size={20} color={theme.colors.onSurface} />}
              onPress={() => {
                handleCloseMenu();
                // View details (future implementation)
              }} 
              title="View Details" 
            />
            <Menu.Item 
              leadingIcon={() => <Edit size={20} color={theme.colors.onSurface} />}
              onPress={() => handleEdit(item)} 
              title="Edit" 
            />
            <Menu.Item 
              leadingIcon={() => <PinIcon size={20} color={theme.colors.onSurface} />}
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
        
        <Paragraph 
          style={styles.description}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item.content}
        </Paragraph>
        
        <View style={styles.statusChips}>
          {item.pinned && (
            <Chip 
              mode="flat" 
              style={{ backgroundColor: theme.colors.primaryContainer }}
              icon={() => <PinIcon size={16} color={theme.colors.primary} />}
            >
              Pinned
            </Chip>
          )}
          
          <Chip 
            mode="flat" 
            style={{ 
              backgroundColor: item.published 
                ? theme.colors.primaryContainer 
                : theme.colors.surfaceVariant,
              borderWidth: item.published ? 0 : 1,
              borderColor: item.published ? 'transparent' : theme.colors.outline
            }}
            icon={() => <Globe size={16} color={theme.colors.onSurfaceVariant} />}
          >
            {item.published ? 'Published' : 'Draft'}
          </Chip>
          
          {item.attachments && item.attachments.length > 0 && (
            <Chip 
              mode="flat"
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            >
              {item.attachments.length} Attachment{item.attachments.length !== 1 ? 's' : ''}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="InfoPoints" subtitle="Manage building information and guidelines" />
      
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
          <Filter size={20} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
      
      {/* Active Filters */}
      {(currentCategoryFilter || currentBuildingFilter) && (
        <View style={styles.filterChipsContainer}>
          {currentCategoryFilter && (
            <Chip 
              mode="flat" 
              onClose={() => handleCategoryFilter(null)}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {getCategoryLabel(currentCategoryFilter)}
            </Chip>
          )}
          
          {currentBuildingFilter && (
            <Chip 
              mode="flat" 
              onClose={() => handleBuildingFilter(null)}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {buildings.find(b => b.id === currentBuildingFilter)?.name || 'Building'}
            </Chip>
          )}
          
          <Button
            mode="text"
            onPress={clearFilters}
            compact
          >
            Clear All
          </Button>
        </View>
      )}
      
      {/* Filter Dialog */}
      <Portal>
        <Dialog
          visible={showFilterMenu}
          onDismiss={() => setShowFilterMenu(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
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
            <Button onPress={clearFilters}>Clear All</Button>
            <Button onPress={() => setShowFilterMenu(false)}>Apply</Button>
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
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </View>
      )}
      
      {/* Info Points list */}
      {!loading && !error && (
        <>
          {filteredInfoPoints.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="titleMedium">No info points found</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                {searchQuery || currentCategoryFilter || currentBuildingFilter 
                  ? 'Try adjusting your filters or search query'
                  : 'Add a new info point to get started'}
              </Text>
              <Button 
                mode="contained" 
                onPress={handleCreate}
                style={{ marginTop: 16 }}
                icon={() => <Plus size={20} color={theme.colors.onPrimary} />}
              >
                Add New Info Point
              </Button>
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  buildingChip: {
    alignSelf: 'flex-start',
  },
  description: {
    marginVertical: 12,
  },
  statusChips: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
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
}); 