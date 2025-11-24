import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { saveLocation, getLocations, initDatabase } from './db';
import { useFocusEffect } from 'expo-router';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      initDatabase();
      loadLocations();
      requestLocationPermission();
    }, [])
  );

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = currentLocation.coords;
      setLocation({ latitude, longitude, accuracy });

      // Try to get address
      try {
        const addressResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (addressResult.length > 0) {
          const addr = addressResult[0];
          setAddress(`${addr.city}, ${addr.region}`);
        }
      } catch (error) {
        console.log('Could not reverse geocode');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Please get location first');
      return;
    }

    try {
      await saveLocation(location.latitude, location.longitude, location.accuracy);
      Alert.alert('Success', 'Location saved to database');
      loadLocations();
      setLocation(null);
      setAddress(null);
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  const loadLocations = async () => {
    try {
      const locations = await getLocations();
      setSavedLocations(locations || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>GPS Location Tracker</Text>
      <Text style={styles.subtitle}>Collect and save GPS coordinates</Text>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Getting Location...' : 'Get Current Location'}
          </Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.label}>Current Location</Text>
            <Text style={styles.coordinateText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinateText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinateText}>
              Accuracy: {location.accuracy?.toFixed(2) || 'N/A'} m
            </Text>
            {address && <Text style={styles.addressText}>{address}</Text>}

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveCurrentLocation}
            >
              <Text style={styles.buttonText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {savedLocations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Saved Locations ({savedLocations.length})</Text>
          {savedLocations.map((loc) => (
            <View key={loc.id} style={styles.locationItem}>
              <Text style={styles.itemDate}>{formatDate(loc.timestamp)}</Text>
              <Text style={styles.itemCoord}>
                {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
              </Text>
              <Text style={styles.itemAccuracy}>Accuracy: {loc.accuracy?.toFixed(2) || 'N/A'} m</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#34C759',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  coordinateText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  locationItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemCoord: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  itemAccuracy: {
    fontSize: 12,
    color: '#999',
  },
});
