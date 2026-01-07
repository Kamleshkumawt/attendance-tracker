import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const UpdateMyTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const { id } = useLocalSearchParams();

  const [stickyNotes, setStickyNotes] = useState([]);

  const getStickyNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("todoNotes");
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
      setTitle(data.find((item) => item.id.toString() === id.toString()).plan);
      setDescription(
        data.find((item) => item.id.toString() === id.toString()).note
      );
      setDate(
        new Date(data.find((item) => item.id.toString() === id.toString()).date)
      );
      setTime(
        new Date(data.find((item) => item.id.toString() === id.toString()).time)
      );
      // console.log("Loaded Sticky Notes:", data);
    };

    loadStickyNotes();
  }, []);

  const formatDate = (dateString) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const d = new Date(dateString);

    return `${weekdays[d.getDay()]}, ${
      months[d.getMonth()]
    } ${d.getDate()}, ${d.getFullYear()}`;
  };
  const handleSubmitData = async () => {
    const updateStickyNotes = stickyNotes.map((item) =>
     item.id.toString() === id.toString()
        ? {
            ...item,
            plan: title,
            note: description,
            date: formatDate(date),
            time: time.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            lastUpdate: new Date().toISOString(),
          }
        : item
    );
    setStickyNotes(updateStickyNotes);
    await AsyncStorage.setItem("todoNotes", JSON.stringify(updateStickyNotes));
    router.push("/(tabs)/toDo");
  };

  const deleteNotes = async (id) => {
    try {
      const updatedNotes = stickyNotes.filter(
        (note) => note.id.toString() !== id.toString()
      );

      setStickyNotes(updatedNotes);
      await AsyncStorage.setItem("todoNotes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.log("Error deleting sticky note:", error);
    }
    router.push("/(tabs)/toDo");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.labelText}>{"What's your plan?"}</Text>
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="airplane-landing"
            size={24}
            color="white"
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Plan"
            placeholderTextColor={"#a0a0a0"}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <Text style={styles.labelText}>Provide a brief description</Text>
        <View style={styles.inputBox}>
          <Feather name="bookmark" size={24} color="white" />
          <TextInput
            multiline
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Add note"
            placeholderTextColor={"#a0a0a0"}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <Text style={styles.labelText}>Set time for the task</Text>
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="clock-time-nine-outline"
            size={24}
            color="white"
          />
          <View style={[styles.input, { justifyContent: "center" }]}>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
              {time.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              borderRadius: 6,
              backgroundColor: "#414040ff",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
              Time
            </Text>
          </View>
        </View>
        <Text style={styles.labelText}>Set date for the task</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="date-range" size={24} color="white" />
          <View style={[styles.input, { justifyContent: "center" }]}>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
              {formatDate(date)}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              borderRadius: 6,
              backgroundColor: "#414040ff",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
              Date
            </Text>
          </View>
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
            onPress={() => deleteNotes(id)}
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

export default UpdateMyTask;

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
