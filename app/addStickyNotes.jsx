import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddStickyNotes = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSubmitData = async () => {
    const newItem = {
      id: Date.now(), // unique id
      title: title,
      description: description,
      lastUpdate: new Date().toISOString(),
    };
    const newList = [...stickyNotes, newItem];
    setStickyNotes(newList);
    await AsyncStorage.setItem("stickyNotes", JSON.stringify(newList));
    setTitle("");
    setDescription("");
    router.push("/stickyNotes");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.labelText}>Enter title</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="bar-chart" size={24} color="white" />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Title"
            placeholderTextColor={"#a0a0a0"}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <Text style={styles.labelText}>Description</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="bar-chart" size={24} color="white" />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Description"
            placeholderTextColor={"#a0a0a0"}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Pressable
            style={{
              marginTop: 20,
              width: 85,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#9675ce",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => handleSubmitData()}
          >
            <MaterialIcons name="list" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Add
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddStickyNotes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    padding: 10,
  },
  topText: {
    color: "white",
    backgroundColor: "#9675ce",
    borderRadius: 10,
    padding: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 3,
  },
  inputBox: {
    borderRadius: 10,
    padding: 10,
    borderColor: "#a0a0a0",
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
  },
  input: {
    flex: 1,
    color: "#a0a0a0",
    fontSize: 18,
    fontWeight: "600",
    borderWidth: 0,
    padding: 5,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
});
