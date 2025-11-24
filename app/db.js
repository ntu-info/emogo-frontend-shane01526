import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('emogo.db');

export const initDatabase = async () => {
  try {
    // Create questionnaire table for sentiment data
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS questionnaire (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sentiment TEXT NOT NULL,
        mood TEXT NOT NULL,
        energy INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create location table for GPS data
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create vlog table for video metadata
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vlog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        uri TEXT NOT NULL,
        duration REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const saveQuestionnaire = async (sentiment, mood, energy) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO questionnaire (sentiment, mood, energy) VALUES (?, ?, ?)',
      [sentiment, mood, energy]
    );
    console.log('Questionnaire saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving questionnaire:', error);
  }
};

export const saveLocation = async (latitude, longitude, accuracy) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO location (latitude, longitude, accuracy) VALUES (?, ?, ?)',
      [latitude, longitude, accuracy]
    );
    console.log('Location saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

export const saveVlog = async (filename, uri, duration) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO vlog (filename, uri, duration) VALUES (?, ?, ?)',
      [filename, uri, duration]
    );
    console.log('Vlog saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving vlog:', error);
  }
};

export const getQuestionnaires = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM questionnaire ORDER BY timestamp DESC');
    return result;
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
  }
};

export const getLocations = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM location ORDER BY timestamp DESC');
    return result;
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
};

export const getVlogs = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM vlog ORDER BY timestamp DESC');
    return result;
  } catch (error) {
    console.error('Error fetching vlogs:', error);
  }
};

export const clearAllData = async () => {
  try {
    await db.execAsync('DELETE FROM questionnaire; DELETE FROM location; DELETE FROM vlog;');
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
