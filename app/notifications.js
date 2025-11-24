import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const initNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    console.log('Notifications initialized');
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

export const scheduleDailyNotifications = async () => {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule 3 notifications per day: 8:00 AM, 1:00 PM, 6:00 PM
    const times = [
      { hour: 8, minute: 0, label: 'Morning' },
      { hour: 13, minute: 0, label: 'Afternoon' },
      { hour: 18, minute: 0, label: 'Evening' },
    ];

    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to share your experience',
          body: `${time.label} check-in: Share your sentiment, vlog, and location!`,
          sound: 'default',
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
      });
    }

    console.log('Daily notifications scheduled');
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export const sendTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification',
        sound: 'default',
      },
      trigger: {
        seconds: 1,
      },
    });
    console.log('Test notification scheduled');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};
