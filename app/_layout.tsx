import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AddIonicons from "@expo/vector-icons/Ionicons";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,

    // NEW required fields (Expo SDK 51+)
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
        <Stack.Screen
          name="attendance"
          options={{
            title: "Add Attendance",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="updateAttendance"
          options={{
            title: "Update Attendance",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="faqs"
          options={{
            title: "FAQs",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="bugReports"
          options={{
            title: "Bug Reports",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="stickyNotes"
          options={{
            title: "Sticky Notes",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
            headerRight: () => (
              <Pressable onPress={() => router.push("/addStickyNotes")} style={{ marginRight: 15 }}>
                <AddIonicons name="add-circle-outline" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="addMyTask"
          options={{
            title: "Add Task",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="updateMyTask"
          options={{
            title: "Update Task",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
