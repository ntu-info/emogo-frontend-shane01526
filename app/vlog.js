import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { saveVlog, initDatabase } from './db';
import { useFocusEffect } from 'expo-router';

export default function VlogScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      initDatabase();
      if (!permission) {
        requestPermission();
      }
    }, [permission])
  );

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Need camera permission</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setRecordingTime(0);
      setIsRecording(true);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 1, // 1 second
        quality: CameraView.Constants.VideoQuality['720'],
      });

      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingTime(0);

      // Save video with timestamp
      const timestamp = new Date().toISOString();
      const filename = `vlog_${timestamp.replace(/[:.]/g, '-')}.mp4`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: video.uri,
        to: fileUri,
      });

      await saveVlog(filename, fileUri, 1);

      Alert.alert('Success', 'Vlog recorded and saved (1 second)');
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to record vlog');
      setIsRecording(false);
      setRecordingTime(0);
      clearInterval(timerRef.current);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />

      <View style={styles.controls}>
        <Text style={styles.title}>1-Second Vlog Recorder</Text>
        {isRecording && (
          <Text style={styles.recordingIndicator}>REC {recordingTime.toFixed(1)}s</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.recordButton, isRecording && styles.buttonDisabled]}
            onPress={startRecording}
            disabled={isRecording}
          >
            <Text style={styles.buttonText}>
              {isRecording ? 'Recording...' : 'Start Recording'}
            </Text>
          </TouchableOpacity>

          {isRecording && (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopRecording}
            >
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.info}>
          Records for 1 second automatically and saves to database
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  recordingIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#FF3B30',
  },
  stopButton: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
