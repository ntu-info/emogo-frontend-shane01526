import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDataSummary } from '../csvexport';
import { sendTestNotification } from '../notifications';

export default function HomeScreen() {
  const router = useRouter();
  const [dataSummary, setDataSummary] = useState({
    questionnaires: 0,
    locations: 0,
    vlogs: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadDataSummary();
    }, [])
  );

  const loadDataSummary = async () => {
    const summary = await getDataSummary();
    setDataSummary(summary);
  };

  const handleQuickAction = (screen) => {
    router.push(screen);
  };

  const quickActions = [
    {
      title: 'Sentiment',
      subtitle: 'Complete questionnaire',
      icon: 'heart',
      color: '#FF3B30',
      screen: '/questionnaire',
    },
    {
      title: 'Vlog',
      subtitle: 'Record 1-second video',
      icon: 'video',
      color: '#FF9500',
      screen: '/vlog',
    },
    {
      title: 'Location',
      subtitle: 'Capture GPS coordinates',
      icon: 'map-marker',
      color: '#34C759',
      screen: '/location',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to EmoGo</Text>
        <Text style={styles.subtitle}>Data Collection App</Text>
      </View>

      {/* Data Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Data Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { borderLeftColor: '#FF3B30' }]}>
            <MaterialCommunityIcons name="heart" size={28} color="#FF3B30" />
            <Text style={styles.summaryCount}>{dataSummary.questionnaires}</Text>
            <Text style={styles.summaryLabel}>Sentiments</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#FF9500' }]}>
            <MaterialCommunityIcons name="video" size={28} color="#FF9500" />
            <Text style={styles.summaryCount}>{dataSummary.vlogs}</Text>
            <Text style={styles.summaryLabel}>Vlogs</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#34C759' }]}>
            <MaterialCommunityIcons name="map-marker" size={28} color="#34C759" />
            <Text style={styles.summaryCount}>{dataSummary.locations}</Text>
            <Text style={styles.summaryLabel}>Locations</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.screen}
            style={styles.actionButton}
            onPress={() => handleQuickAction(action.screen)}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <MaterialCommunityIcons
                name={action.icon}
                size={24}
                color="#fff"
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Test Actions */}
      <View style={styles.testContainer}>
        <Text style={styles.sectionTitle}>Testing</Text>
        <TouchableOpacity
          style={[styles.testButton, styles.testNotification]}
          onPress={sendTestNotification}
        >
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionText}>
          • Complete the sentiment questionnaire 3 times a day at scheduled times
        </Text>
        <Text style={styles.instructionText}>
          • Record a 1-second vlog whenever you want to share your experience
        </Text>
        <Text style={styles.instructionText}>
          • Capture your location to build a spatial map of your activities
        </Text>
        <Text style={styles.instructionText}>
          • Use the Dashboard tab to export your data as CSV files
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  testContainer: {
    padding: 16,
    paddingTop: 0,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  testNotification: {
    backgroundColor: '#5AC8FA',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
});
