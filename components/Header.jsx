import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AddIonicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const Header = ({ title, show, onReload, onSettings }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/dashboard")}>
        <MaterialCommunityIcons
          name="view-dashboard-outline"
          size={24}
          color="white"
        />
      </Pressable>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "400" }}>
        {title}
      </Text>
      {show.show1 && (
        <Pressable onPress={() => router.push("/attendance")}>
          <AddIonicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
      )}
      {show.show2 && (
        <>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Pressable onPress={() => onReload()}>
                <AntDesign name="reload" size={24} color="white" />
              </Pressable>
              <Pressable onPress={() => onSettings(true)}>
                <SimpleLineIcons name="settings" size={24} color="white" />
              </Pressable>
          </View>
        </>
      )}
      {show.show4 && (
        <>
          <Pressable
            onPress={() => router.push("/addMyTask")}
          >
            <AddIonicons name="add-circle-outline" size={24} color="white" />
          </Pressable>
        </>
      )}
      {!show.show1 && !show.show2 && !show.show4 && <View></View>}
    </View>
  );
};

export default Header;

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
