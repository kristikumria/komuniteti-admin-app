import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Text, useTheme, ActivityIndicator, FAB, Card, Chip, Divider, IconButton } from 'react-native-paper';
import { File, FileText, Download, FilePlus, Folder, Clock, Eye, Calendar, User } from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

// Define route props type
type BusinessAccountDocumentsRouteProps = RouteProp<
  BusinessManagerStackParamList,
  'BusinessAccountDocuments'
>;

// Define navigation props type
type BusinessAccountsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList
>;

// Mock document types for categorization
const DOCUMENT_TYPES = {
  CONTRACT: 'contract',
  INVOICE: 'invoice',
  REPORT: 'report',
  LEGAL: 'legal',
  OTHER: 'other'
};

// Document type for the interface
interface Document {
  id: string;
  name: string;
  type: string;
  extension: string;
  size: string;
  dateAdded: string;
  lastModified: string;
  uploadedBy: string;
  category: string;
  tags: string[];
}

// Mock data for documents
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Property Management Agreement',
    type: DOCUMENT_TYPES.CONTRACT,
    extension: 'pdf',
    size: '1.2 MB',
    dateAdded: '2023-03-15',
    lastModified: '2023-03-15',
    uploadedBy: 'Admin User',
    category: 'Contracts',
    tags: ['agreement', 'signed', 'property']
  },
  {
    id: 'doc-2',
    name: 'Q1 Financial Report',
    type: DOCUMENT_TYPES.REPORT,
    extension: 'xlsx',
    size: '856 KB',
    dateAdded: '2023-04-10',
    lastModified: '2023-04-12',
    uploadedBy: 'Finance Manager',
    category: 'Financial',
    tags: ['quarterly', 'financial', 'report']
  },
  {
    id: 'doc-3',
    name: 'Building Insurance Policy',
    type: DOCUMENT_TYPES.LEGAL,
    extension: 'pdf',
    size: '2.4 MB',
    dateAdded: '2023-01-20',
    lastModified: '2023-01-20',
    uploadedBy: 'Legal Department',
    category: 'Insurance',
    tags: ['insurance', 'policy', 'legal']
  },
  {
    id: 'doc-4',
    name: 'Maintenance Invoice - March',
    type: DOCUMENT_TYPES.INVOICE,
    extension: 'pdf',
    size: '542 KB',
    dateAdded: '2023-03-28',
    lastModified: '2023-03-28',
    uploadedBy: 'Finance Manager',
    category: 'Invoices',
    tags: ['invoice', 'maintenance', 'payment']
  },
  {
    id: 'doc-5',
    name: 'Property Tax Assessment',
    type: DOCUMENT_TYPES.LEGAL,
    extension: 'pdf',
    size: '1.1 MB',
    dateAdded: '2023-02-05',
    lastModified: '2023-02-05',
    uploadedBy: 'Legal Department',
    category: 'Taxes',
    tags: ['tax', 'assessment', 'government']
  },
];

export const BusinessAccountDocumentsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<BusinessAccountsNavigationProp>();
  const route = useRoute<BusinessAccountDocumentsRouteProps>();
  const { businessAccountId, businessAccountName } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(documents.map(doc => doc.category))];
  
  const filteredDocuments = selectedCategory
    ? documents.filter(doc => doc.category === selectedCategory)
    : documents;
  
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleDocumentPress = (document: Document) => {
    // In a real app, this would open the document viewer
    console.log('Open document:', document.id);
  };
  
  const handleDownload = (document: Document) => {
    // In a real app, this would trigger a document download
    console.log('Download document:', document.id);
  };
  
  const handleAddDocument = () => {
    // In a real app, this would open a document upload screen
    console.log('Add new document');
  };
  
  const getIconForDocType = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <File size={24} color={theme.colors.primary} />;
      case 'xlsx':
      case 'xls':
        return <FileText size={24} color="#217346" />;
      case 'docx':
      case 'doc':
        return <FileText size={24} color="#2B579A" />;
      default:
        return <FileText size={24} color={theme.colors.primary} />;
    }
  };
  
  const renderDocumentItem = ({ item }: { item: Document }) => (
    <Card style={styles.documentCard} onPress={() => handleDocumentPress(item)}>
      <Card.Content>
        <View style={styles.documentHeader}>
          <View style={styles.documentIcon}>
            {getIconForDocType(item.extension)}
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{item.name}</Text>
            <Text style={styles.documentMeta}>
              {item.extension.toUpperCase()} • {item.size}
            </Text>
          </View>
          <IconButton
            icon={props => <Download {...props} />}
            onPress={() => handleDownload(item)}
            size={20}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.documentDetails}>
          <View style={styles.detailItem}>
            <Calendar size={14} color={theme.colors.onSurfaceVariant} style={styles.detailIcon} />
            <Text style={styles.detailText}>Added: {item.dateAdded}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={14} color={theme.colors.onSurfaceVariant} style={styles.detailIcon} />
            <Text style={styles.detailText}>Modified: {item.lastModified}</Text>
          </View>
          <View style={styles.detailItem}>
            <User size={14} color={theme.colors.onSurfaceVariant} style={styles.detailIcon} />
            <Text style={styles.detailText}>By: {item.uploadedBy}</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Chip 
              key={`${item.id}-tag-${index}`} 
              compact 
              style={styles.tagChip}
              textStyle={styles.tagText}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
  
  const renderCategoryFilter = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === null && { backgroundColor: `${theme.colors.primary}20` }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Folder size={16} color={selectedCategory === null ? theme.colors.primary : theme.colors.onSurfaceVariant} />
          <Text 
            style={[
              styles.categoryText, 
              selectedCategory === null && { color: theme.colors.primary }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && { backgroundColor: `${theme.colors.primary}20` }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Folder size={16} color={selectedCategory === category ? theme.colors.primary : theme.colors.onSurfaceVariant} />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === category && { color: theme.colors.primary }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`${businessAccountName} Documents`}
        showBack={true}
        action={{
          icon: <FilePlus size={24} color={theme.colors.primary} />,
          onPress: handleAddDocument
        }}
      />
      
      <View style={styles.container}>
        {renderCategoryFilter()}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={50} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>No documents found</Text>
              </View>
            }
          />
        )}
      </View>
      
      <FAB
        icon={props => <FilePlus {...props} />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddDocument}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80,
  },
  documentCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 6,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  divider: {
    marginVertical: 12,
  },
  documentDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 12,
    opacity: 0.7,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tagText: {
    fontSize: 12,
  },
}); 