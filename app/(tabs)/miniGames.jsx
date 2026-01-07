import { StyleSheet, Text, View } from "react-native";
import React from "react";

const miniGames = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Text style={styles.boxText}>Flip Cards</Text>
      </View>
      <View style={styles.box2}>
        <Text style={styles.boxText}>Minesweeper</Text>
      </View>
      <View style={styles.box3}>
        <Text style={styles.boxText}>Cricket</Text>
      </View>
    </View>
  );
};

export default miniGames;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  backgroundColor: "#000",
  justifyContent: "start",
  padding: 12,
},

box1: {
  height: 200,
  width: 160,
  backgroundColor: "#2860faff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  margin: 10,
},
box2: {
  height: 200,
  width: 160,
  backgroundColor: "#d7b002ff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  margin: 10,
},
box3: {
  height: 200,
  width: 160,
  backgroundColor: "#0e9913b9",
  borderRadius: 10,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  margin: 10,
},
  boxText: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 18,
  }
});
