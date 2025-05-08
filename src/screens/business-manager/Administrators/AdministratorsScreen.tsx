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
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchAdministrators,
  deleteAdministrator,
  toggleAdministratorStatus,
  selectAdministrators,
  selectAdministratorsLoading,
  selectAdministratorsError,
  selectFilterStatus,
  selectFilterBuildingId,
  setFilterStatus,
  setFilterBuilding,
  clearFilters,
  selectFilteredAdministrators,
} from '../../../store/slices/administratorSlice';
import { Administrator } from '../../../types/administratorTypes';
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  Filter,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  UserCog
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { Building as BuildingType } from '../../../types/buildingTypes';

// Using mock buildings - in a real app we would import selectBuildings
const MOCK_BUILDINGS: BuildingType[] = [
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

export const AdministratorsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const administrators = useAppSelector(selectFilteredAdministrators);
  const loading = useAppSelector(selectAdministratorsLoading);
  const error = useAppSelector(selectAdministratorsError);
  const currentFilterStatus = useAppSelector(selectFilterStatus);
  const currentFilterBuildingId = useAppSelector(selectFilterBuildingId);

  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const [filteredAdministrators, setFilteredAdministrators] = useState<Administrator[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAdministrator, setSelectedAdministrator] = useState<Administrator | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock buildings for development - in production this would come from the store
  const buildings = MOCK_BUILDINGS;

  useEffect(() => {
    dispatch(fetchAdministrators());
  }, [dispatch]);

  useEffect(() => {
    // Apply search query filter
    let filtered = [...administrators];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        admin =>
          admin.name.toLowerCase().includes(lowerQuery) ||
          admin.email.toLowerCase().includes(lowerQuery) ||
          admin.phone.includes(lowerQuery)
      );
    }

    setFilteredAdministrators(filtered);
  }, [administrators, searchQuery]);

  const handleOpenMenu = (id: string) => {
    setVisibleMenuId(id);
  };

  const handleCloseMenu = () => {
    setVisibleMenuId(null);
  };

  const handleEdit = (administrator: Administrator) => {
    setSelectedAdministrator(administrator);
    setShowEditDialog(true);
    handleCloseMenu();
  };

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleDelete = (id: string) => {
    handleCloseMenu();
    Alert.alert(
      'Delete Administrator',
      'Are you sure you want to delete this administrator? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAdministrator(id));
          }
        }
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    handleCloseMenu();
    dispatch(toggleAdministratorStatus(id));
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    if (status === currentFilterStatus) {
      dispatch(setFilterStatus('all'));
    } else {
      dispatch(setFilterStatus(status));
    }
    setShowFilterMenu(false);
  };

  const handleBuildingFilter = (buildingId: string | null) => {
    if (buildingId === currentFilterBuildingId) {
      dispatch(setFilterBuilding(null));
    } else {
      dispatch(setFilterBuilding(buildingId));
    }
    setShowFilterMenu(false);
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setShowFilterMenu(false);
  };

  const renderAdministratorItem = ({ item }: { item: Administrator }) => (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftColor: item.status === 'active' ? theme.colors.primary : theme.colors.error,
          borderLeftWidth: 4,
        }
      ]}
      mode="outlined"
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.nameRow}>
              <UserCog size={20} color={theme.colors.onSurfaceVariant} />
              <Title style={styles.name}>{item.name}</Title>
            </View>
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Mail size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium" style={styles.contactText}>{item.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Phone size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium" style={styles.contactText}>{item.phone}</Text>
              </View>
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
              leadingIcon={() => item.status === 'active' 
                ? <XCircle size={20} color={theme.colors.onSurface} />
                : <CheckCircle size={20} color={theme.colors.onSurface} />
              }
              onPress={() => handleToggleStatus(item.id)}
              title={item.status === 'active' ? "Deactivate" : "Activate"}
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

        <View style={styles.buildingsContainer}>
          <Text variant="labelMedium" style={styles.sectionLabel}>
            Assigned Buildings:
          </Text>
          <View style={styles.buildingChips}>
            {item.assignedBuildings.length > 0 ? (
              item.assignedBuildingNames?.map((name, index) => (
                <Chip
                  key={index}
                  icon={() => <Building size={16} color={theme.colors.primary} />}
                  style={styles.buildingChip}
                  mode="outlined"
                >
                  {name}
                </Chip>
              ))
            ) : (
              <Text variant="bodySmall" style={{ fontStyle: 'italic' }}>
                No buildings assigned
              </Text>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Chip
            mode="outlined"
            style={{
              backgroundColor: item.status === 'active' ? theme.colors.primaryContainer : theme.colors.errorContainer,
              borderColor: item.status === 'active' ? theme.colors.primary : theme.colors.error,
            }}
            textStyle={{
              color: item.status === 'active' ? theme.colors.primary : theme.colors.error,
            }}
          >
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Administrators" subtitle="Manage building administrators" />

      <View style={styles.searchFilterContainer}>
        <Searchbar
          placeholder="Search administrators..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <TouchableOpacity
          onPress={() => setShowFilterMenu(true)}
          style={[
            styles.filterButton,
            {
              backgroundColor: (currentFilterStatus !== 'all' || currentFilterBuildingId)
                ? theme.colors.primaryContainer
                : theme.colors.surfaceVariant
            }
          ]}
        >
          <Filter size={20} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(currentFilterStatus !== 'all' || currentFilterBuildingId) && (
        <View style={styles.filterChipsContainer}>
          {currentFilterStatus !== 'all' && (
            <Chip
              mode="flat"
              onClose={() => handleStatusFilter('all')}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {currentFilterStatus === 'active' ? 'Active' : 'Inactive'}
            </Chip>
          )}

          {currentFilterBuildingId && (
            <Chip
              mode="flat"
              onClose={() => handleBuildingFilter(null)}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {buildings.find(b => b.id === currentFilterBuildingId)?.name || 'Building'}
            </Chip>
          )}

          <Button
            mode="text"
            onPress={clearAllFilters}
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
          <Dialog.Title>Filter Administrators</Dialog.Title>
          <Dialog.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>Status</Text>
            <View style={styles.filterOptions}>
              <Chip
                selected={currentFilterStatus === 'all'}
                onPress={() => handleStatusFilter('all')}
                style={styles.filterChip}
                showSelectedCheck
              >
                All
              </Chip>
              <Chip
                selected={currentFilterStatus === 'active'}
                onPress={() => handleStatusFilter('active')}
                style={styles.filterChip}
                showSelectedCheck
              >
                Active
              </Chip>
              <Chip
                selected={currentFilterStatus === 'inactive'}
                onPress={() => handleStatusFilter('inactive')}
                style={styles.filterChip}
                showSelectedCheck
              >
                Inactive
              </Chip>
            </View>

            {buildings.length > 0 && (
              <>
                <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Buildings</Text>
                <View style={styles.filterOptions}>
                  {buildings.map(building => (
                    <Chip
                      key={building.id}
                      selected={currentFilterBuildingId === building.id}
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
            <Button onPress={clearAllFilters}>Clear All</Button>
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
            onPress={() => dispatch(fetchAdministrators())}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </View>
      )}

      {/* Administrators list */}
      {!loading && !error && (
        <>
          {filteredAdministrators.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="titleMedium">No administrators found</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                {searchQuery || currentFilterStatus !== 'all' || currentFilterBuildingId
                  ? 'Try adjusting your filters or search query'
                  : 'Add a new administrator to get started'}
              </Text>
              <Button
                mode="contained"
                onPress={handleCreate}
                style={{ marginTop: 16 }}
                icon={() => <Plus size={20} color="#fff" />}
              >
                Add New Administrator
              </Button>
            </View>
          ) : (
            <FlatList
              data={filteredAdministrators}
              renderItem={renderAdministratorItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* FAB for adding new administrator */}
      <FAB
        icon={() => <Plus size={24} color="#fff" />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreate}
      />

      {/* Create Administrator Dialog - placeholder for now */}
      <Portal>
        <Dialog
          visible={showCreateDialog}
          onDismiss={() => setShowCreateDialog(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Add New Administrator</Dialog.Title>
          <Dialog.Content>
            <Text>Administrator creation form will go here</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onPress={() => setShowCreateDialog(false)}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Edit Administrator Dialog - placeholder for now */}
      <Portal>
        <Dialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Edit Administrator</Dialog.Title>
          <Dialog.Content>
            <Text>Administrator editing form will go here</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onPress={() => setShowEditDialog(false)}>Update</Button>
          </Dialog.Actions>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    marginLeft: 8,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactText: {
    marginLeft: 8,
  },
  buildingsContainer: {
    marginTop: 12,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  buildingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buildingChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
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