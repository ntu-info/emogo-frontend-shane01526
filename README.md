[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1M59WghA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21796357&assignment_repo_type=AssignmentRepo)

# EmoGo - Data Collection App

📱 **[Access the app on Expo](https://expo.dev/accounts/shane5658/projects/emogo1124)**

## 📱 Access the App

### ✅ Expo Go (Recommended - Easiest & Free)
**[Open in Expo Go](https://expo.dev/accounts/shane5658/projects/emogo1124)**

This is the quickest way to test the app. Install [Expo Go](https://expo.dev/client), scan the QR code, and the app launches immediately.

**Steps:**
1. Download Expo Go from App Store or Google Play Store
2. Visit https://expo.dev/accounts/shane5658/projects/emogo1124
3. Scan the QR code or tap "Open with Expo Go"
4. App opens instantly with full functionality

### APK Build (Android Installation)
**Status**: Android preview APK builds require a paid EAS subscription (free tier limit reached). The app is fully functional via Expo Go, which provides the same functionality without installation.

**Expo credentials**: All required permissions for camera, location, and storage are properly configured and working in the published version.


## Overview

EmoGo is a React Native mobile application built with Expo that collects three types of data three times a day:

1. **Sentiment Questionnaire** - Structured active/foreground data
2. **1-Second Vlog Recorder** - Unstructured active/foreground data
3. **GPS Location Tracking** - Structured passive/background data

All data is stored locally using SQLite and can be exported to CSV format for analysis and backup.

## Features

### Data Collection
- **Sentiment Questionnaire**: Collect user sentiment (5-point scale), mood (6 options), and energy levels (1-10)
- **Vlog Recorder**: Record 1-second videos with automatic saving to device storage
- **Location Tracker**: Capture GPS coordinates with accuracy information
- **Push Notifications**: Scheduled notifications at 8:00 AM, 1:00 PM, and 6:00 PM

### Data Management
- **Local SQLite Database**: Secure local storage for all data with three tables
- **CSV Export**: Export all collected data in CSV format for analysis
- **Dashboard**: View collection statistics and manage data
- **Data Summary**: Real-time counts of all collected data types

## Required Packages

- **expo-notifications** (~0.28.0): Schedule and trigger notifications
- **expo-sqlite** (~14.0.1): Local database storage
- **expo-camera** (~15.0.14): Video recording functionality
- **expo-file-system** (~17.0.1): File storage and management
- **expo-sharing** (~12.0.1): Share and export data
- **expo-location** (~17.0.1): GPS coordinate collection

## Project Structure

```
app/
├── _layout.js                 # Root layout with app initialization
├── db.js                      # SQLite database utilities
├── notifications.js           # Notification scheduling
├── csvexport.js              # CSV export functionality
├── questionnaire.js          # Sentiment questionnaire screen
├── vlog.js                   # Vlog recorder screen
├── location.js               # Location tracker screen
├── details.js                # Details screen
├── (tabs)/
│   ├── _layout.js            # Tab navigator
│   ├── index.js              # Home screen with quick actions
│   └── settings.js           # Dashboard with data export
data/
├── questionnaire_samples.csv  # 6 sample questionnaire records
├── location_samples.csv       # 6 sample location records
└── vlog_samples.csv          # 6 sample vlog metadata records
```

## Data Schema

### Questionnaire Table
```sql
CREATE TABLE questionnaire (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sentiment TEXT NOT NULL,
  mood TEXT NOT NULL,
  energy INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Sample sentiments: "Very Negative", "Negative", "Neutral", "Positive", "Very Positive"
Sample moods: "Stressed", "Anxious", "Sad", "Neutral", "Happy", "Excited"
Energy range: 1-10

### Location Table
```sql
CREATE TABLE location (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  accuracy REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Vlog Table
```sql
CREATE TABLE vlog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  uri TEXT NOT NULL,
  duration REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd emogo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start --tunnel
   ```

4. Open the app on a device or emulator using the Expo dev tools.

## Usage

### Home Screen
- View collected data statistics (Sentiments, Vlogs, Locations)
- Quick access to all data collection screens
- Send test notifications
- View usage instructions

### Data Collection

#### Sentiment Questionnaire
1. Navigate to "Sentiment" from home screen
2. Select overall sentiment (5-point scale)
3. Choose mood (6 options)
4. Set energy level (1-10 slider)
5. Submit questionnaire - data saves to SQLite

#### Vlog Recording
1. Navigate to "Vlog" from home screen
2. Camera view is displayed
3. Tap "Start Recording" to begin recording
4. Recording stops automatically after 1 second
5. Video file is saved with timestamp

#### Location Tracking
1. Navigate to "Location" from home screen
2. Tap "Get Current Location"
3. View current GPS coordinates and accuracy
4. Tap "Save Location" to store in database
5. View all saved locations in scrollable history

### Dashboard (Settings Tab)
- **Collection Statistics**: View counts for each data type
- **Export Data**: Export all data to CSV files
- **Clear Data**: Permanently delete all collected data
- **App Info**: View app version and features

## CSV Export Format

Exported files are named with timestamps: `{type}_{timestamp}.csv`

### questionnaire_*.csv
```
ID,Sentiment,Mood,Energy,Timestamp
1,"Positive","Happy",8,"2025-11-23T08:15:00"
```

### location_*.csv
```
ID,Latitude,Longitude,Accuracy,Timestamp
1,25.044476,121.509897,8.5,"2025-11-23T08:20:00"
```

### vlog_*.csv
```
ID,Filename,URI,Duration,Timestamp
1,"vlog_2025-11-23T08-25-00.mp4","file://...",1.0,"2025-11-23T08:25:00"
```

## Sample Data

Sample data files are included in the `/data` folder with 6+ records for each data type:

- **questionnaire_samples.csv**: 6 sentiment records spanning 28 hours
  - Records at 8:00 AM, 1:00 PM, and 6:00 PM on two consecutive days
  - Mix of sentiment levels: Positive, Very Positive, Neutral, Negative
  - Energy levels ranging 4-9

- **location_samples.csv**: 6 location records spanning 28 hours
  - GPS coordinates in Taipei area (Taiwan)
  - Accuracy values ranging 7.6-12.1 meters
  - Same time distribution as questionnaires

- **vlog_samples.csv**: 6 vlog metadata records spanning 28 hours
  - All records show 1-second duration
  - Filename format: `vlog_YYYY-MM-DDTHH-MM-SS.mp4`
  - Same time distribution for consistency

All sample data demonstrates:
- **3 times per day collection**: 8:00 AM, 1:00 PM, 6:00 PM
- **Multi-day span**: 28+ hours (Nov 23 08:15 - Nov 24 19:10)
- **Realistic data**: Varying sentiments, locations, and energy levels

## Permissions

### Android
- CAMERA - Record video vlogs
- RECORD_AUDIO - Audio for vlog recording
- ACCESS_FINE_LOCATION - GPS coordinates
- ACCESS_COARSE_LOCATION - Network-based location
- READ_EXTERNAL_STORAGE - Access recorded files
- WRITE_EXTERNAL_STORAGE - Save exported data

### iOS
- Camera access (NSCameraUsageDescription)
- Location access when in use (NSLocationWhenInUseUsageDescription)
- Location always and when in use (NSLocationAlwaysAndWhenInUseUsageDescription)

## Notification Schedule

The app schedules notifications for three times daily:
- **8:00 AM** - Morning check-in
- **1:00 PM** - Afternoon check-in
- **6:00 PM** - Evening check-in

Notifications trigger the app and prompt users to collect data.

## Publishing to Expo

The app has been successfully published to Expo!

### Current Deployment
- **Project URL**: https://expo.dev/accounts/shane5658/projects/emogo1124
- **Update Group ID**: a8c91484-adc1-44ad-af44-a58f714399b1
- **Runtime Version**: 1.0.0

### Open in Expo Go
1. Download [Expo Go](https://expo.dev/client) on your mobile device
2. Visit https://expo.dev/accounts/shane5658/projects/emogo1124
3. Scan the QR code or tap "Open with Expo Go"
4. App will open and you can start using EmoGo immediately

### Build Native Apps
To create standalone native apps:
```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## AI Interaction History

This implementation was developed through collaborative AI-assisted coding. Key development stages included:

### 1. **Project Initialization & Setup**
   - Set up React Native project with Expo Router for navigation
   - Configured app.json with proper permissions (camera, location, storage)
   - Added EAS (Expo Application Services) configuration for publishing
   - Installed all required packages: expo-notifications, expo-sqlite, expo-camera, expo-file-system, expo-sharing, expo-location

### 2. **Database Architecture (db.js)**
   - Implemented SQLite database with three tables:
     - `questionnaire`: sentiment, mood, energy, timestamp
     - `location`: latitude, longitude, accuracy, timestamp
     - `vlog`: filename, uri, duration, timestamp
   - Created utility functions: saveQuestionnaire, saveLocation, saveVlog
   - Added retrieval functions: getQuestionnaires, getLocations, getVlogs
   - Implemented clearAllData for data management

### 3. **Notification System (notifications.js)**
   - Set up daily push notifications at 8:00 AM, 1:00 PM, and 6:00 PM
   - Configured notification permissions and handlers
   - Implemented test notification feature for development

### 4. **Data Collection Screens**
   - **Questionnaire Screen (questionnaire.js)**:
     - 5-point sentiment scale (Very Negative to Very Positive)
     - 6 mood options (Stressed, Anxious, Sad, Neutral, Happy, Excited)
     - 1-10 energy level slider
     - Real-time form validation and submission
   
   - **Vlog Recorder (vlog.js)**:
     - 1-second auto-stop recording functionality
     - Camera permission handling
     - Automatic file naming with timestamps
     - Visual recording indicator
   
   - **Location Tracker (location.js)**:
     - High-accuracy GPS coordinate collection
     - Reverse geocoding for address lookup
     - Location history view with scrollable list
     - Accuracy metrics display

### 5. **CSV Export System (csvexport.js)**
   - Multi-format CSV export (questionnaire, location, vlog)
   - Automatic timestamp-based filename generation
   - Integration with device sharing capabilities
   - Real-time data summary counting

### 6. **Navigation & UI (App Layout)**
   - Root layout with automatic app initialization
   - Bottom tab navigation (Home & Dashboard)
   - Modal-style data collection screens
   - Integration of MaterialCommunityIcons for visual design

### 7. **Home Screen (index.js)**
   - Data summary cards with counts
   - Quick-action buttons for each data type
   - Test notification button for development
   - Usage instructions

### 8. **Dashboard Screen (settings.js)**
   - Data statistics visualization
   - Export to CSV functionality
   - Clear data with confirmation dialog
   - App information section

### 9. **Sample Data Creation**
   - Generated 6+ records for each data type
   - Spanning 36 hours (Nov 23 08:15 - Nov 24 20:15)
   - Realistic coordinates (Taipei area)
   - Varied sentiments and mood selections
   - Stored in `/data` folder as CSV files

### 10. **Publishing & Deployment**
   - Configured EAS Update for Expo publishing
   - Deployed to Expo server (November 25, 2025)
   - Published update group ID: a8c91484-adc1-44ad-af44-a58f714399b1
   - App runtime version: 1.0.0

### Key Design Decisions
1. **Modular Code Structure**: Separated concerns (db, notifications, export) for maintainability
2. **Local-First Data Storage**: SQLite ensures user privacy and offline functionality
3. **Push Notifications**: Scheduled reminders improve user compliance
4. **CSV Export Format**: Standard format for data analysis and backup
5. **Permission Handling**: Graceful degradation if permissions not granted
6. **User Feedback**: Alerts and visual indicators for all operations

All screens include proper error handling and user feedback through alerts and visual indicators.

## Database

The app uses Expo SQLite for local data storage. The database (`emogo.db`) is created automatically on first run and persists across app sessions.

## How to Use

### Option 1: Use the Published App (Recommended)
The app is already published on Expo! Follow the instructions in the "Access the App" section above to use it immediately without any setup.

### Option 2: Run Locally for Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npx expo start --tunnel
   ```

3. Open the app on a device or emulator using the Expo dev tools.
