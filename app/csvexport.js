import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getQuestionnaires, getLocations, getVlogs } from './db';

const csvHeader = {
  questionnaire: 'ID,Sentiment,Mood,Energy,Timestamp\n',
  location: 'ID,Latitude,Longitude,Accuracy,Timestamp\n',
  vlog: 'ID,Filename,URI,Duration,Timestamp\n',
};

const formatCSVRow = (data, type) => {
  if (type === 'questionnaire') {
    return `${data.id},"${data.sentiment}","${data.mood}",${data.energy},"${data.timestamp}"\n`;
  } else if (type === 'location') {
    return `${data.id},${data.latitude},${data.longitude},${data.accuracy},"${data.timestamp}"\n`;
  } else if (type === 'vlog') {
    return `${data.id},"${data.filename}","${data.uri}",${data.duration},"${data.timestamp}"\n`;
  }
};

export const exportToCSV = async () => {
  try {
    const questionnaires = await getQuestionnaires();
    const locations = await getLocations();
    const vlogs = await getVlogs();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Create questionnaire CSV
    if (questionnaires && questionnaires.length > 0) {
      let csv = csvHeader.questionnaire;
      questionnaires.forEach((q) => {
        csv += formatCSVRow(q, 'questionnaire');
      });

      const qPath = `${FileSystem.documentDirectory}questionnaire_${timestamp}.csv`;
      await FileSystem.writeAsStringAsync(qPath, csv);
      console.log('Questionnaire CSV created:', qPath);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(qPath);
      }
    }

    // Create location CSV
    if (locations && locations.length > 0) {
      let csv = csvHeader.location;
      locations.forEach((l) => {
        csv += formatCSVRow(l, 'location');
      });

      const lPath = `${FileSystem.documentDirectory}location_${timestamp}.csv`;
      await FileSystem.writeAsStringAsync(lPath, csv);
      console.log('Location CSV created:', lPath);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(lPath);
      }
    }

    // Create vlog metadata CSV
    if (vlogs && vlogs.length > 0) {
      let csv = csvHeader.vlog;
      vlogs.forEach((v) => {
        csv += formatCSVRow(v, 'vlog');
      });

      const vPath = `${FileSystem.documentDirectory}vlog_${timestamp}.csv`;
      await FileSystem.writeAsStringAsync(vPath, csv);
      console.log('Vlog CSV created:', vPath);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(vPath);
      }
    }

    return {
      questionnaires: questionnaires?.length || 0,
      locations: locations?.length || 0,
      vlogs: vlogs?.length || 0,
    };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

export const getDataSummary = async () => {
  try {
    const questionnaires = await getQuestionnaires();
    const locations = await getLocations();
    const vlogs = await getVlogs();

    return {
      questionnaires: questionnaires?.length || 0,
      locations: locations?.length || 0,
      vlogs: vlogs?.length || 0,
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    return {
      questionnaires: 0,
      locations: 0,
      vlogs: 0,
    };
  }
};
