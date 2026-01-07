import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const AddMyTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const formatTime = (d) => {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

  const onchangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "android");
    // console.log('currentDate :',currentDate);
    setDate(currentDate);
    setShowDatePicker(false);
  }

  const onchangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "android");
    // console.log('currentTime :',currentTime);
    setTime(currentTime);
    setShowTimePicker(false);
  }

  const handleSubmitData = async () => {
    const newItem = {
      id: Date.now(), // unique id
      plan: title,
      note: description,
      time: time,
      date: date,
      lastUpdate: new Date().toISOString(),
    };
    const newList = [...stickyNotes, newItem];
    setStickyNotes(newList);
    await AsyncStorage.setItem("todoNotes", JSON.stringify(newList));
    setTitle("");
    setDescription("");
    router.push("/(tabs)/toDo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>
        {"Once saved, swipe the card (Left <-- Right) to 'DELETE'"}
      </Text>
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
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Add note"
            placeholderTextColor={"#a0a0a0"}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <Text style={styles.labelText}>Set time for the task</Text>
        <Pressable style={styles.inputBox} onPress={()=> setShowTimePicker(true)}>
          <MaterialCommunityIcons
            name="clock-time-nine-outline"
            size={24}
            color="white"
          />
          <View style={[styles.input, { justifyContent: "center" }]}>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
              {formatTime(time)}
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
        </Pressable>
        <Text style={styles.labelText}>Set date for the task</Text>
        <Pressable style={styles.inputBox} onPress={()=> setShowDatePicker(true)}>
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
        </Pressable>

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
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onchangeDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={onchangeTime}
        />
      )}
    </View>
  );
};

export default AddMyTask;

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
