import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";

const StickyNotes = () => {
  const [stickyNotes, setStickyNotes] = useState([]);

  const getStickyNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("stickyNotes");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.log("Error getting sticky notes:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadStickyNotes = async () => {
      const data = await getStickyNotes();
      setStickyNotes(data);
      // console.log("Loaded Sticky Notes:", data);
    };

    loadStickyNotes();
  }, []);

 const deleteNotes = async (id) => {
  try {
    const updatedNotes = stickyNotes.filter(note => note.id !== id);
    setStickyNotes(updatedNotes);
    await AsyncStorage.setItem(
      "stickyNotes",
      JSON.stringify(updatedNotes)
    );
  } catch (error) {
    console.log("Error deleting sticky note:", error);
  }
};
  return (
    <View style={styles.container}>
      <FlatList
        data={stickyNotes}
        renderItem={({ item }) => (
          <View
            style={{
              flex: stickyNotes.length === 0 ? 1 : 0,
              flexDirection: "row",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "start",
              alignItems: "start",
              padding: 8,
            }}
          >
            <View style={styles.stickyBox}>
              <Pressable
                onPress={() => router.push(`/updateStickyNotes?id=${item.id}`)}
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: 8,
                }}
              >
                <Text style={styles.HeaderText}>{item.title} </Text>
                <Text
                  style={styles.SubText}
                  numberOfLines={4}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Pressable
                  onPress={() => deleteNotes(item.id)}
                  style={{ color: "white", fontSize: 20 }}
                >
                  <Foundation name="trash" size={24} color="red" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* <View
        style={{
          flex: stickyNotes.length === 0 ? 1 : 0,
          flexDirection: "row",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "start",
          alignItems: "start",
          padding: 8,
        }}
      >
        <View style={styles.stickyBox}>
          <Pressable
            onPress={() => router.push("/updateStickyNotes")}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              gap: 8,
            }}
          >
            <Text style={styles.HeaderText}>Your </Text>
            <Text style={styles.SubText} numberOfLines={4} ellipsizeMode="tail">
              kamlesh kumawwt udipur rajasthan india rajasthan udipur..
            </Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Pressable
              onPress={() => deleteNotes()}
              style={{ color: "white", fontSize: 20 }}
            >
              <Foundation name="trash" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      </View> */}
      {stickyNotes.length === 0 && (
        <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
          <Text style={styles.Toptext}>
            Capture your thoughts before they fly away!
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.push("/addStickyNotes")}
          >
            <Text
              style={{ color: "white", fontWeight: "semibold", fontSize: 16 }}
            >
              Get started
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default StickyNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  Toptext: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  btn: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  HeaderText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  SubText: {
    color: "#a0a0a0",
    fontSize: 14,
  },
  stickyBox: {
    borderColor: "#9675ce",
    borderWidth: 2,
    width: 175,
    height: 170,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
