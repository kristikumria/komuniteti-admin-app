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
  MD3Colors
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchServices, 
  deleteService, 
  toggleServiceStatus, 
  selectServices,
  selectServicesLoading,
  selectServicesError
} from '../../../store/slices/serviceSlice';
import { Service } from '../../../types/serviceTypes';
import { MoreVertical, Plus, Edit, Trash2, Bookmark, Eye, Power, Filter } from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { ServiceForm } from './ServiceForm';
import { commonStyles } from '../../../styles/commonStyles';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Services'>;

export const ServicesScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectServices);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Get unique categories for filtering
  const categories = [...new Set(services.map(service => service.category))];
  
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  
  useEffect(() => {
    // Apply filters and search
    let filtered = [...services];
    
    // Apply active filter
    if (filterActive !== null) {
      filtered = filtered.filter(service => service.isActive === filterActive);
    }
    
    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(service => service.category === filterCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service => 
          service.name.toLowerCase().includes(lowerQuery) ||
          service.description.toLowerCase().includes(lowerQuery) ||
          service.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredServices(filtered);
  }, [services, searchQuery, filterActive, filterCategory]);
  
  const handleOpenMenu = (id: string) => {
    setVisibleMenuId(id);
  };
  
  const handleCloseMenu = () => {
    setVisibleMenuId(null);
  };
  
  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setShowEditDialog(true);
    handleCloseMenu();
  };
  
  const handleCreate = () => {
    setShowCreateDialog(true);
  };
  
  const handleDelete = (id: string) => {
    handleCloseMenu();
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteService(id));
          } 
        }
      ]
    );
  };
  
  const handleToggleStatus = (id: string) => {
    handleCloseMenu();
    dispatch(toggleServiceStatus(id));
  };
  
  const clearFilters = () => {
    setFilterActive(null);
    setFilterCategory(null);
    setShowFilterMenu(false);
  };
  
  const renderServiceItem = ({ item }: { item: Service }) => (
    <Card 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftColor: item.isActive ? theme.colors.primary : theme.colors.error,
          borderLeftWidth: 4,
        }
      ]}
      mode="outlined"
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Title>{item.name}</Title>
            <Chip 
              mode="outlined" 
              style={[
                styles.categoryChip, 
                { borderColor: theme.colors.outline }
              ]}
            >
              {item.category}
            </Chip>
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
              leadingIcon={() => <Power size={20} color={theme.colors.onSurface} />}
              onPress={() => handleToggleStatus(item.id)} 
              title={item.isActive ? "Deactivate" : "Activate"} 
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
        
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        
        <View style={styles.detailsRow}>
          <Text style={styles.price}>
            €{item.price.toFixed(2)} / {item.priceUnit}
          </Text>
          <Chip 
            mode="flat" 
            style={{ 
              backgroundColor: item.isActive ? theme.colors.primaryContainer : theme.colors.errorContainer 
            }}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Services" subtitle="Manage company service offerings" />
      
      <View style={styles.searchFilterContainer}>
        <Searchbar
          placeholder="Search services..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <TouchableOpacity 
          onPress={() => setShowFilterMenu(true)}
          style={[
            styles.filterButton,
            { 
              backgroundColor: (filterActive !== null || filterCategory !== null) 
                ? theme.colors.primaryContainer 
                : theme.colors.surfaceVariant 
            }
          ]}
        >
          <Filter size={20} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
      
      {/* Filter chips */}
      {(filterActive !== null || filterCategory !== null) && (
        <View style={styles.filterChipsContainer}>
          {filterActive !== null && (
            <Chip 
              mode="flat" 
              onClose={() => setFilterActive(null)}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {filterActive ? 'Active' : 'Inactive'}
            </Chip>
          )}
          
          {filterCategory && (
            <Chip 
              mode="flat" 
              onClose={() => setFilterCategory(null)}
              style={{ marginRight: 8, backgroundColor: theme.colors.primaryContainer }}
            >
              {filterCategory}
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
      
      {/* Filter menu */}
      <Portal>
        <Dialog
          visible={showFilterMenu}
          onDismiss={() => setShowFilterMenu(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Filter Services</Dialog.Title>
          <Dialog.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>Status</Text>
            <View style={styles.filterOptions}>
              <Chip
                selected={filterActive === true}
                onPress={() => setFilterActive(true)}
                style={styles.filterChip}
                showSelectedCheck
              >
                Active
              </Chip>
              <Chip
                selected={filterActive === false}
                onPress={() => setFilterActive(false)}
                style={styles.filterChip}
                showSelectedCheck
              >
                Inactive
              </Chip>
            </View>
            
            <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Categories</Text>
            <View style={styles.filterOptions}>
              {categories.map(category => (
                <Chip
                  key={category}
                  selected={filterCategory === category}
                  onPress={() => setFilterCategory(category)}
                  style={styles.filterChip}
                  showSelectedCheck
                >
                  {category}
                </Chip>
              ))}
            </View>
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
            onPress={() => dispatch(fetchServices())}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </View>
      )}
      
      {/* Services list */}
      {!loading && !error && (
        <>
          {filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="titleMedium">No services found</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                {searchQuery || filterActive !== null || filterCategory 
                  ? 'Try adjusting your filters or search query'
                  : 'Add a new service to get started'}
              </Text>
              <Button 
                mode="contained" 
                onPress={handleCreate}
                style={{ marginTop: 16 }}
                icon={() => <Plus size={20} color={theme.colors.onPrimary} />}
              >
                Add New Service
              </Button>
            </View>
          ) : (
            <FlatList
              data={filteredServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
      
      {/* FAB for adding new service */}
      <FAB
        icon={() => <Plus size={24} color="#fff" />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreate}
      />
      
      {/* Create Service Dialog */}
      <Portal>
        <Dialog
          visible={showCreateDialog}
          onDismiss={() => setShowCreateDialog(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Add New Service</Dialog.Title>
          <Dialog.Content>
            <ServiceForm 
              onSubmit={() => setShowCreateDialog(false)} 
              onCancel={() => setShowCreateDialog(false)}
              mode="create"
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
      
      {/* Edit Service Dialog */}
      <Portal>
        <Dialog
          visible={showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Edit Service</Dialog.Title>
          <Dialog.Content>
            <ServiceForm 
              service={selectedService!}
              onSubmit={() => setShowEditDialog(false)} 
              onCancel={() => setShowEditDialog(false)}
              mode="edit"
            />
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
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  description: {
    marginVertical: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
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