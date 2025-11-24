import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { saveQuestionnaire, initDatabase } from './db';

export default function QuestionnaireScreen() {
  const [sentiment, setSentiment] = useState(null);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(5);

  useFocusEffect(
    React.useCallback(() => {
      initDatabase();
    }, [])
  );

  const handleSubmit = async () => {
    if (!sentiment || !mood) {
      Alert.alert('Error', 'Please select both sentiment and mood');
      return;
    }

    await saveQuestionnaire(sentiment, mood, energy);
    Alert.alert('Success', 'Questionnaire saved successfully');
    setSentiment(null);
    setMood(null);
    setEnergy(5);
  };

  const sentiments = ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'];
  const moods = ['Stressed', 'Anxious', 'Sad', 'Neutral', 'Happy', 'Excited'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sentiment Questionnaire</Text>
      <Text style={styles.subtitle}>How are you feeling today?</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Overall Sentiment</Text>
        <View style={styles.optionContainer}>
          {sentiments.map((s, index) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.optionButton,
                sentiment === s && styles.optionButtonActive,
              ]}
              onPress={() => setSentiment(s)}
            >
              <Text style={[
                styles.optionText,
                sentiment === s && styles.optionTextActive,
              ]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mood</Text>
        <View style={styles.optionContainer}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.optionButton,
                mood === m && styles.optionButtonActive,
              ]}
              onPress={() => setMood(m)}
            >
              <Text style={[
                styles.optionText,
                mood === m && styles.optionTextActive,
              ]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Energy Level: {energy}</Text>
        <View style={styles.sliderContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.sliderButton,
                energy === num && styles.sliderButtonActive,
              ]}
              onPress={() => setEnergy(num)}
            >
              <Text style={[
                styles.sliderText,
                energy === num && styles.sliderTextActive,
              ]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Questionnaire</Text>
      </TouchableOpacity>
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
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  sliderButtonActive: {
    borderColor: '#34C759',
    backgroundColor: '#34C759',
  },
  sliderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  sliderTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
