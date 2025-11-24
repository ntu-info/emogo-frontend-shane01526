import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { exportToCSV, getDataSummary } from '../csvexport';
import { getQuestionnaires, getLocations, getVlogs, clearAllData } from '../db';

export default function DashboardScreen() {
  const [dataSummary, setDataSummary] = useState({
    questionnaires: 0,
    locations: 0,
    vlogs: 0,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportTime, setLastExportTime] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadDataSummary();
    }, [])
  );

  const loadDataSummary = async () => {
    const summary = await getDataSummary();
    setDataSummary(summary);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const result = await exportToCSV();
      setLastExportTime(new Date().toLocaleString());
      Alert.alert(
        'Export Successful',
        `Exported:\n• ${result.questionnaires} sentiment records\n• ${result.locations} location records\n• ${result.vlogs} vlog records`
      );
      loadDataSummary();
    } catch (error) {
      Alert.alert('Export Failed', error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data?',
      'This will permanently delete all collected data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadDataSummary();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const DataCard = ({ title, count, color, icon }) => (
    <View style={[styles.dataCard, { borderTopColor: color }]}>
      <View style={styles.dataCardHeader}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={styles.dataCardTitle}>{title}</Text>
      </View>
      <Text style={[styles.dataCardCount, { color }]}>{count}</Text>
      <Text style={styles.dataCardSubtitle}>records collected</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Monitor your data collection</Text>
      </View>

      {/* Data Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collection Statistics</Text>
        <DataCard
          title="Sentiments"
          count={dataSummary.questionnaires}
          color="#FF3B30"
          icon="heart"
        />
        <DataCard
          title="Vlogs"
          count={dataSummary.vlogs}
          color="#FF9500"
          icon="video"
        />
        <DataCard
          title="Locations"
          count={dataSummary.locations}
          color="#34C759"
          icon="map-marker"
        />
      </View>

      {/* Total Records */}
      <View style={styles.section}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Records</Text>
          <Text style={styles.totalCount}>
            {dataSummary.questionnaires + dataSummary.vlogs + dataSummary.locations}
          </Text>
          {lastExportTime && (
            <Text style={styles.lastExportText}>
              Last export: {lastExportTime}
            </Text>
          )}
        </View>
      </View>

      {/* Export Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Export</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton, isExporting && styles.buttonDisabled]}
          onPress={handleExportData}
          disabled={isExporting}
        >
          <MaterialCommunityIcons name="download" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.exportInfo}>
          Export all collected data as CSV files for analysis and backup
        </Text>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClearData}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        <Text style={styles.deleteInfo}>
          Permanently delete all collected data from the device
        </Text>
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>EmoGo Data Collection</Text>
          <Text style={styles.infoText}>
            Version 1.0.0
          </Text>
          <Text style={styles.infoText}>
            This app collects three types of data 3 times daily:
          </Text>
          <Text style={styles.infoBullet}>• Sentiment questionnaires</Text>
          <Text style={styles.infoBullet}>• 1-second video logs</Text>
          <Text style={styles.infoBullet}>• GPS coordinates</Text>
          <Text style={[styles.infoText, { marginTop: 12 }]}>
            All data is stored locally and can be exported as CSV files.
          </Text>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderTopWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dataCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  dataCardCount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataCardSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  lastExportText: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  exportButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  exportInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  deleteInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoBullet: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
  },
});
