import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AddIonicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const SimpleHeader = ({ title, show }) => {
  return (
    <View style={styles.container}>
      <Pressable>
        <MaterialCommunityIcons
          name="view-dashboard-outline"
          size={24}
          color="white"
        />
      </Pressable>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "400" }}>
        {title}
      </Text>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "black",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
