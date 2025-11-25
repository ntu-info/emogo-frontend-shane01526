import { Stack } from "expo-router";
import { initDatabase } from "./db";
import { initNotifications, scheduleDailyNotifications } from "./notifications";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Initialize database and notifications on app start
    const setup = async () => {
      try {
        await initDatabase();
        await initNotifications();
        await scheduleDailyNotifications();
        console.log("App initialization complete");
      } catch (error) {
        console.error("App initialization error:", error);
      }
    };
    setup();
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
        {/* Data collection screens pushed on top of tabs */}
        <Stack.Screen
          name="questionnaire"
          options={{ title: "Sentiment Questionnaire" }}
        />
        <Stack.Screen
          name="vlog"
          options={{ title: "Vlog Recorder" }}
        />
        <Stack.Screen
          name="location"
          options={{ title: "Location Tracker" }}
        />
        {/* This screen is pushed on top of tabs when you navigate to /details */}
        <Stack.Screen
          name="details"
          options={{ title: "Details" }}
        />
      </Stack>
    </>
  );
}
