import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";

const UpdateStickyNotes = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

    const { id } = useLocalSearchParams();

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
      setTitle(data.find((item) => item.id.toString() === id.toString()).title);
      setDescription(data.find((item) => item.id.toString() === id.toString()).description);
      // console.log("Loaded Sticky Notes:", data);
    };

    loadStickyNotes();
  }, []);

  const handleSubmitData = async () => {
    const updateStickyNotes = stickyNotes.map((item) => 
      item.id.toString() === id.toString()
      ? { ...item,
          title: title,
          description : description,
          lastUpdate: new Date().toISOString(),
      } 
      : item
    );
    setStickyNotes(updateStickyNotes);
    await AsyncStorage.setItem("stickyNotes", JSON.stringify(updateStickyNotes));
    router.back();
  };

  const handleDelete = async () => {
    const updatedStickyNotes = stickyNotes.filter(
      (item) => item.id.toString() !== id.toString()
    );
    setStickyNotes(updatedStickyNotes);
    await AsyncStorage.setItem(
      "stickyNotes",
      JSON.stringify(updatedStickyNotes)
    );
    router.back();
  }
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.labelText}>Enter title</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="bar-chart" size={24} color="white" />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Subject"
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
            placeholder="Subject"
            placeholderTextColor={"#a0a0a0"}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Pressable
            style={{
              marginTop: 20,
              width: 85,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#d32f2f",
              padding: 10,
              paddingHorizontal: 18,
              borderRadius: 10,
            }}
            onPress={() => handleDelete(id)}
          >
           <AntDesign name="delete" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Delete
            </Text>
          </Pressable>
          <Pressable
            style={{
              marginTop: 20,
              width: 85,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#2860faff",
              padding: 10,
              paddingHorizontal: 18,
              borderRadius: 10,
            }}
            onPress={() => handleSubmitData()}
          >
           <AntDesign name="reload" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Update
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default UpdateStickyNotes;

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
  }
});
