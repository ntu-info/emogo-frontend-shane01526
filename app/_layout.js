import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "./db";
import { initNotifications, scheduleDailyNotifications } from "./notifications";

export default function RootLayout() {
  useEffect(() => {
    // Initialize database and notifications on app start
    const initializeApp = async () => {
      await initDatabase();
      await initNotifications();
      await scheduleDailyNotifications();
    };
    initializeApp();
  }, []);

  return (
    <>
      {/* Root stack controls screen transitions for the whole app */}
      <Stack>
        {/* The (tabs) group is one Stack screen with its own tab navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        {/* This screen is pushed on top of tabs when you navigate to /details */}
        <Stack.Screen
          name="details"
          options={{ title: "Details" }}
        />
        {/* Data collection screens */}
        <Stack.Screen
          name="questionnaire"
          options={{ title: "Questionnaire", presentation: "modal" }}
        />
        <Stack.Screen
          name="vlog"
          options={{ title: "Vlog Recorder", presentation: "modal" }}
        />
        <Stack.Screen
          name="location"
          options={{ title: "Location Tracker", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
