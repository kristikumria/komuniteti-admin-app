import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text, useTheme, Card, Button, Chip, Divider, Avatar, TextInput, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList, Report, ReportComment } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { format } from 'date-fns';
import { Building, AlertCircle, Check, User, MessageSquare, Clipboard, Calendar, FileImage, Send } from 'lucide-react-native';
import { useAppSelector } from '../../../store/hooks';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'ReportDetails'>;

// Mock data for report details (this would normally come from the API)
const MOCK_REPORT: Report = {
  id: '1',
  title: 'Water Leak in Apartment 3B',
  submitter: 'John Smith',
  submitterId: 'user1',
  location: 'Building A, Floor 3, Apartment 3B',
  building: 'Building A',
  status: 'open',
  priority: 'high',
  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  description: 'Water leaking from ceiling in bathroom. The leak appears to be coming from the apartment above. The ceiling has a visible water stain that is growing larger. This needs immediate attention to prevent further damage to the ceiling and potential mold growth.',
  assignedTo: 'Maintenance Team',
  images: [
    'https://picsum.photos/seed/leak1/800/600',
    'https://picsum.photos/seed/leak2/800/600'
  ],
  estimatedCost: '€250-350',
  serviceAppointment: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
  comments: [
    {
      author: 'Sarah Johnson',
      text: 'I\'ll inspect this today and assess the damage.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      author: 'Maintenance Team',
      text: 'We need to check the apartment above as well. The issue might be coming from their plumbing.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    }
  ]
};

export const ReportDetails = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { reportId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setReport(MOCK_REPORT);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [reportId]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return theme.colors.error;
      case 'in-progress':
        return theme.colors.primary;
      case 'resolved':
        return '#4CAF50'; // Using direct color since theme.colors.success might not exist
      default:
        return theme.colors.primary;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#D32F2F';
      case 'high':
        return '#F57C00';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#8BC34A';
      default:
        return theme.colors.primary;
    }
  };
  
  const handleStatusChange = (newStatus: 'open' | 'in-progress' | 'resolved') => {
    if (report) {
      setReport({
        ...report,
        status: newStatus,
        resolvedDate: newStatus === 'resolved' ? new Date().toISOString() : report.resolvedDate
      });
    }
  };
  
  const handleSubmitComment = () => {
    if (!comment.trim() || !report) return;
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newComment: ReportComment = {
        author: 'Business Manager',
        text: comment.trim(),
        timestamp: new Date().toISOString()
      };
      
      setReport({
        ...report,
        comments: [...(report.comments || []), newComment]
      });
      
      setComment('');
      setSubmitting(false);
    }, 500);
  };
  
  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const handleCloseImage = () => {
    setSelectedImage(null);
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Header 
          title="Report Details" 
          showBack 
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#ccc' : '#666' }}>Loading report details...</Text>
        </View>
      </View>
    );
  }
  
  if (!report) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Header 
          title="Report Details" 
          showBack 
        />
        <View style={styles.centerContainer}>
          <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>Report not found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Header 
        title="Report Details" 
        showBack 
      />
      
      {selectedImage ? (
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleCloseImage}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.fullImage} 
            resizeMode="contain" 
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Card 
            style={[
              styles.detailsCard, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]}
          >
            <Card.Content>
              <View style={styles.titleContainer}>
                <Text 
                  variant="headlineSmall" 
                  style={[styles.title, { color: isDarkMode ? 'white' : '#333' }]}
                >
                  {report.title}
                </Text>
                <Chip 
                  style={{ backgroundColor: getStatusColor(report.status) + '20' }}
                  textStyle={{ color: getStatusColor(report.status), fontWeight: '500' }}
                >
                  {report.status === 'in-progress' ? 'In Progress' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Chip>
              </View>
              
              <Text 
                style={[styles.description, { color: isDarkMode ? '#ddd' : '#555' }]}
              >
                {report.description}
              </Text>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <AlertCircle size={20} color={getPriorityColor(report.priority)} style={styles.infoIcon} />
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                    Priority: <Text style={{ color: getPriorityColor(report.priority), fontWeight: '500' }}>
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </Text>
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Building size={20} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                    Location: <Text style={{ fontWeight: '500' }}>{report.location}</Text>
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Calendar size={20} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                    Reported: <Text style={{ fontWeight: '500' }}>{format(new Date(report.date), 'MMM d, yyyy')}</Text>
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <User size={20} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                    Reported by: <Text style={{ fontWeight: '500' }}>{report.submitter}</Text>
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Clipboard size={20} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                    Assigned to: <Text style={{ fontWeight: '500' }}>{report.assignedTo}</Text>
                  </Text>
                </View>
                
                {report.estimatedCost && (
                  <View style={styles.infoRow}>
                    <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                      Estimated cost: <Text style={{ fontWeight: '500' }}>{report.estimatedCost}</Text>
                    </Text>
                  </View>
                )}
                
                {report.serviceAppointment && (
                  <View style={styles.infoRow}>
                    <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                      Service appointment: <Text style={{ fontWeight: '500' }}>
                        {format(new Date(report.serviceAppointment), 'MMM d, yyyy')}
                      </Text>
                    </Text>
                  </View>
                )}
                
                {report.resolvedDate && (
                  <View style={styles.infoRow}>
                    <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                      Resolved on: <Text style={{ fontWeight: '500' }}>
                        {format(new Date(report.resolvedDate), 'MMM d, yyyy')}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
              
              {report.images && report.images.length > 0 && (
                <>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.imagesSection}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>
                      Images
                    </Text>
                    
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.imagesScrollView}
                    >
                      {report.images.map((image, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.imageContainer}
                          onPress={() => handleViewImage(image)}
                        >
                          <Image 
                            source={{ uri: image }} 
                            style={styles.image} 
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>
          
          <Card 
            style={[
              styles.actionsCard, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]}
          >
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>
                Status Update
              </Text>
              
              <View style={styles.statusButtons}>
                <Button 
                  mode={report.status === 'open' ? 'contained' : 'outlined'}
                  onPress={() => handleStatusChange('open')}
                  style={styles.statusButton}
                  buttonColor={report.status === 'open' ? theme.colors.error : undefined}
                >
                  Open
                </Button>
                
                <Button 
                  mode={report.status === 'in-progress' ? 'contained' : 'outlined'}
                  onPress={() => handleStatusChange('in-progress')}
                  style={styles.statusButton}
                  buttonColor={report.status === 'in-progress' ? theme.colors.primary : undefined}
                >
                  In Progress
                </Button>
                
                <Button 
                  mode={report.status === 'resolved' ? 'contained' : 'outlined'}
                  onPress={() => handleStatusChange('resolved')}
                  style={styles.statusButton}
                  buttonColor={report.status === 'resolved' ? '#4CAF50' : undefined}
                >
                  Resolved
                </Button>
              </View>
            </Card.Content>
          </Card>
          
          <Card 
            style={[
              styles.commentsCard, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]}
          >
            <Card.Content>
              <View style={styles.commentsHeader}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>
                  Comments
                </Text>
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                  {report.comments?.length || 0} {report.comments?.length === 1 ? 'comment' : 'comments'}
                </Text>
              </View>
              
              {report.comments && report.comments.length > 0 ? (
                report.comments.map((comment, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.commentItem,
                      index === report.comments!.length - 1 ? styles.lastCommentItem : null
                    ]}
                  >
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAuthor}>
                        <Avatar.Text 
                          size={32} 
                          label={comment.author.split(' ').map(n => n[0]).join('')} 
                          style={styles.commentAvatar} 
                        />
                        <View>
                          <Text style={[styles.authorName, { color: isDarkMode ? 'white' : '#333' }]}>
                            {comment.author}
                          </Text>
                          <Text style={{ fontSize: 12, color: isDarkMode ? '#aaa' : '#666' }}>
                            {format(new Date(comment.timestamp), 'MMM d, yyyy h:mm a')}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <Text style={[styles.commentText, { color: isDarkMode ? '#ddd' : '#555' }]}>
                      {comment.text}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: isDarkMode ? '#999' : '#999', fontStyle: 'italic', marginTop: 8 }}>
                  No comments yet
                </Text>
              )}
              
              <Divider style={styles.divider} />
              
              <View style={styles.addCommentSection}>
                <TextInput
                  mode="outlined"
                  placeholder="Add a comment..."
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  style={[
                    styles.commentInput,
                    { backgroundColor: isDarkMode ? '#333' : 'white' }
                  ]}
                  outlineColor={isDarkMode ? '#444' : '#ddd'}
                  activeOutlineColor={theme.colors.primary}
                  textColor={isDarkMode ? 'white' : 'black'}
                />
                
                <Button
                  mode="contained"
                  onPress={handleSubmitComment}
                  style={styles.commentButton}
                  disabled={!comment.trim() || submitting}
                  loading={submitting}
                >
                  Comment
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  actionsCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  commentsCard: {
    marginBottom: 24,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  description: {
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  imagesSection: {
    marginBottom: 8,
  },
  imagesScrollView: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentItem: {
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastCommentItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAvatar: {
    marginRight: 12,
  },
  authorName: {
    fontWeight: '500',
  },
  commentText: {
    marginLeft: 44,
    lineHeight: 20,
  },
  addCommentSection: {
    marginTop: 8,
  },
  commentInput: {
    marginBottom: 12,
  },
  commentButton: {
    alignSelf: 'flex-end',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});