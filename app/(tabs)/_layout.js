import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
      }}
    >
      {/* First tab uses the index.js screen in this folder */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
