import {Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Games from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Header from "@/components/Header";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Attendance",
            header: () => (
              <Header
                title="Attendance Tracker"
                show={{ show1: true }}
                onReload={() => {}}
                onSettings={() => {}}
              />
            ),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="bar-chart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="routine"
          options={{
            title: "Routine",
            header: ({ route }) => {
              const { openSettings, deleteRoutineEntries } = (route.params || {}) as any;

              return (
                <Header
                  title="Routine"
                  show={{ show2: true }}
                  onReload={deleteRoutineEntries}
                  onSettings={openSettings}
                />
              );
            },
            tabBarIcon: ({ color }) => (
              <Entypo name="calendar" size={24} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="project"
          options={{
            title: "Project",
            header: () => (
              <Header
                title="Project Tracker"
                show={{ show3: true }}
                onReload={() => {}}
                onSettings={() => {}}
              />
            ),
            tabBarIcon: ({ color }) => (
              <MaterialIconsCreate name="create" size={24} color={color} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="toDo"
          options={{
            title: "To-Do",
            header: () => (
              <Header
                title="My Tasks"
                show={{ show4: true }}
                onReload={() => {}}
                onSettings={() => {}}
              />
            ),
            tabBarIcon: ({ color }) => (
              <AntDesign name="bars" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="miniGames"
          options={{
            title: "Mini-Games",
            header: () => (
              <Header
                title="Mini-Games"
                show={{ show5: true }}
                onReload={() => {}}
                onSettings={() => {}}
              />
            ),
            tabBarIcon: ({ color }) => (
              <Games size={28} name="game-controller" color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          header: () => <Header title="Mini-Games" show={{show5: true}} />,
        }}
      /> */}
      </Tabs>
    </GestureHandlerRootView>
  );
}
