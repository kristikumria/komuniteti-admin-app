import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Divider, Surface } from 'react-native-paper';
import { Home, FileText, Bell, Users, CheckCircle, CreditCard, BarChart3, Calendar, AlertCircle } from 'lucide-react-native';
import { useContextData } from '../../hooks/useContextData';
import { ContextScreenWrapper } from '../../components/ContextScreenWrapper';
import { Grid, Row, Col } from '../../components/Grid';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useThemedStyles } from '../../hooks/useThemedStyles';

export const AdministratorDashboard = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { currentBuilding } = useContextData();
  const { isTablet, breakpoint } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Simulate data loading on refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Number of cards per row based on device size
  const getNumColumns = () => {
    if (breakpoint === 'xl') return 4;
    if (breakpoint === 'lg' || breakpoint === 'md') return 2;
    return 2; // default for sm and xs
  };
  
  // Dashboard statistics cards
  const renderStatCards = () => {
    const statCards = [
      { title: 'Units', value: '48', icon: <Home size={24} color={theme.colors.primary} /> },
      { title: 'Residents', value: '86', icon: <Users size={24} color={theme.colors.primary} /> },
      { title: 'Pending Tasks', value: '3', icon: <FileText size={24} color={theme.colors.primary} /> },
      { title: 'Notifications', value: '12', icon: <Bell size={24} color={theme.colors.primary} /> },
    ];
    
    const numColumns = getNumColumns();
    
    if (isTablet) {
      return (
        <Grid fluid padding={16}>
          <Row>
            {statCards.map((card, index) => (
              <Col key={index} xs={12 / numColumns}>
                <Card style={styles.gridCard}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardIcon}>{card.icon}</View>
                    <Text variant="titleMedium" style={styles.cardTitle}>{card.title}</Text>
                    <Text variant="displayMedium" style={styles.cardValue}>{card.value}</Text>
                  </Card.Content>
                </Card>
              </Col>
            ))}
          </Row>
        </Grid>
      );
    }
    
    // Default mobile layout
    return (
      <View style={styles.cardsContainer}>
        {statCards.map((card, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardIcon}>{card.icon}</View>
              <Text variant="titleMedium" style={styles.cardTitle}>{card.title}</Text>
              <Text variant="displayMedium" style={styles.cardValue}>{card.value}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };
  
  // Dashboard content sections
  const renderDashboardContent = () => {
    if (isTablet) {
      return (
        <Grid fluid padding={16}>
          <Row>
            {/* Left Column */}
            <Col xs={6}>
              {/* Tasks Card */}
              <Card style={styles.gridCard}>
                <Card.Title 
                  title="Pending Tasks" 
                  titleStyle={styles.cardHeaderTitle}
                  left={(props) => <CheckCircle {...props} color={theme.colors.primary} />}
                />
                <Divider />
                <Card.Content style={styles.taskCardContent}>
                  <View style={styles.taskList}>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>
                        Review maintenance request #24501
                      </Text>
                    </View>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>
                        Process payment for Unit 3B
                      </Text>
                    </View>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>
                        Update resident information for Unit 12A
                      </Text>
                    </View>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>
                        Respond to new message from Arben Krasniqi
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
              
              {/* Notifications Card */}
              <Card style={styles.gridCard}>
                <Card.Title 
                  title="Recent Notifications" 
                  titleStyle={styles.cardHeaderTitle}
                  left={(props) => <Bell {...props} color={theme.colors.primary} />}
                />
                <Divider />
                <Card.Content style={styles.notificationCardContent}>
                  <View style={styles.notificationList}>
                    <View style={styles.notificationItem}>
                      <Text style={styles.notificationText}>
                        New maintenance report submitted for Unit 7B
                      </Text>
                    </View>
                    <View style={styles.notificationItem}>
                      <Text style={styles.notificationText}>
                        Payment reminder sent to 5 overdue residents
                      </Text>
                    </View>
                    <View style={styles.notificationItem}>
                      <Text style={styles.notificationText}>
                        New poll created for building amenities
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Col>
            
            {/* Right Column */}
            <Col xs={6}>
              {/* Recent Payments */}
              <Card style={styles.gridCard}>
                <Card.Title 
                  title="Recent Payments" 
                  titleStyle={styles.cardHeaderTitle}
                  left={(props) => <CreditCard {...props} color={theme.colors.primary} />}
                />
                <Divider />
                <Card.Content style={styles.paymentsCardContent}>
                  <View style={styles.paymentList}>
                    <View style={styles.paymentItem}>
                      <Text style={styles.paymentText}>
                        <Text style={styles.boldText}>Unit 3B</Text> - €500 - Rent Payment
                      </Text>
                      <Text style={styles.paymentDate}>Today</Text>
                    </View>
                    <View style={styles.paymentItem}>
                      <Text style={styles.paymentText}>
                        <Text style={styles.boldText}>Unit 8A</Text> - €450 - Rent Payment
                      </Text>
                      <Text style={styles.paymentDate}>Yesterday</Text>
                    </View>
                    <View style={styles.paymentItem}>
                      <Text style={styles.paymentText}>
                        <Text style={styles.boldText}>Unit 5C</Text> - €120 - Utilities
                      </Text>
                      <Text style={styles.paymentDate}>2 days ago</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
              
              {/* Stats Summary */}
              <Card style={styles.gridCard}>
                <Card.Title 
                  title="Building Summary" 
                  titleStyle={styles.cardHeaderTitle}
                  left={(props) => <BarChart3 {...props} color={theme.colors.primary} />}
                />
                <Divider />
                <Card.Content style={styles.statsCardContent}>
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>92%</Text>
                      <Text style={styles.statLabel}>Occupancy</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>€48,500</Text>
                      <Text style={styles.statLabel}>Monthly Income</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>5</Text>
                      <Text style={styles.statLabel}>Overdue Payments</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>8</Text>
                      <Text style={styles.statLabel}>Maintenance Reports</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Col>
          </Row>
        </Grid>
      );
    }
    
    // Default mobile layout
    return (
      <>
        {/* Tasks Card */}
        <Card style={styles.taskCard}>
          <Card.Title 
            title="Pending Tasks" 
            titleStyle={styles.cardHeaderTitle}
            left={(props) => <CheckCircle {...props} color={theme.colors.primary} />}
          />
          <Divider />
          <Card.Content style={styles.taskCardContent}>
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>
                  Review maintenance request #24501
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>
                  Process payment for Unit 3B
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>
                  Update resident information for Unit 12A
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>
                  Respond to new message from Arben Krasniqi
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recent notifications */}
        <Card style={styles.notificationCard}>
          <Card.Title 
            title="Recent Notifications" 
            titleStyle={styles.cardHeaderTitle}
            left={(props) => <Bell {...props} color={theme.colors.primary} />}
          />
          <Divider />
          <Card.Content style={styles.notificationCardContent}>
            <View style={styles.notificationList}>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>
                  New maintenance report submitted for Unit 7B
                </Text>
              </View>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>
                  Payment reminder sent to 5 overdue residents
                </Text>
              </View>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>
                  New poll created for building amenities
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </>
    );
  };
  
  return (
    <ContextScreenWrapper
      title="Dashboard"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      disableScrollView={true}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStatCards()}
        {renderDashboardContent()}
      </ScrollView>
    </ContextScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  // Original mobile cards
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  // Grid system cards
  gridCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: 'bold',
  },
  taskCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  notificationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  taskCardContent: {
    paddingTop: 8,
  },
  notificationCardContent: {
    paddingTop: 8,
  },
  paymentsCardContent: {
    paddingTop: 8,
  },
  statsCardContent: {
    paddingTop: 8,
  },
  taskList: {
    marginTop: 8,
  },
  taskItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  taskText: {
    fontSize: 14,
  },
  notificationList: {
    marginTop: 8,
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  notificationText: {
    fontSize: 14,
  },
  paymentList: {
    marginTop: 8,
  },
  paymentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentText: {
    fontSize: 14,
    flex: 1,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statItem: {
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 