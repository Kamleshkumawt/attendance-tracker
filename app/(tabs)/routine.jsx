import routineNotification from "@/lib/routineNotification";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Routine = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSetTimeModal, setShowSetTimeModal] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [routineEntries, setRoutineEntries] = useState([]);

  const [startTime, setStartTime] = useState("8 AM");
  const [endTime, setEndTime] = useState("4 PM");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const days = ["Time", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const to24Hour = (time) => {
    const [hourStr, suffix] = time.split(" ");
    let hour = parseInt(hourStr);

    if (suffix === "PM" && hour !== 12) hour += 12;
    if (suffix === "AM" && hour === 12) hour = 0;

    return hour;
  };

  const to12Hour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${suffix}`;
  };

  const generateTimeSlots = (startTime, endTime) => {
    let start = to24Hour(startTime);
    let end = to24Hour(endTime);

    let times = [];

    // If end < start → goes to next day
    if (end < start) {
      end += 24;
    }

    for (let h = start; h <= end; h++) {
      times.push(to12Hour(h % 24));
    }

    return times;
  };

  const timeSlots = generateTimeSlots(startTime, endTime);

  const handleSubmitData = async () => {
    // Check if an entry already exists
    const existingIndex = routineEntries.findIndex(
      (item) => item.day === selectedDay && item.time === selectedTime
    );

    let updatedEntries = [];

    if (existingIndex !== -1) {
      // UPDATE existing entry
      updatedEntries = [...routineEntries];
      updatedEntries[existingIndex].title = title; // update title
      updatedEntries[existingIndex].updateTime = new Date().toISOString();
    } else {
      // ADD new entry
      const newEntry = {
        id: Date.now(),
        day: selectedDay,
        time: selectedTime,
        title: title,
        updateTime: new Date().toISOString(),
      };
      updatedEntries = [...routineEntries, newEntry];
    }

    // Save to state + AsyncStorage
    setRoutineEntries(updatedEntries);
    await AsyncStorage.setItem(
      "routineEntries",
      JSON.stringify(updatedEntries)
    );

    // Close modal & reset input
    setTitle("");
    setShowModal(false);

    // console.log("Routine Entries:", updatedEntries);
  };

  const deleteRoutineEntries = async () => {
    await AsyncStorage.removeItem("routineEntries");
    setRoutineEntries([]);
  };

  const handleSubmitTime = async () => {
    // Check if an entry already exists
    await AsyncStorage.setItem("startTime", startTime);
    await AsyncStorage.setItem("endTime", endTime);

    setShowSetTimeModal(false);
  };

  const generateTimes = () => {
    let list = [];
    for (let hour = 6; hour <= 20; hour++) {
      const suffix = hour >= 12 ? "PM" : "AM";
      const formatted = `${hour === 12 ? 12 : hour % 12} ${suffix}`;
      list.push(formatted);
    }
    return list;
  };

  const timeList = generateTimes();

  // Load from AsyncStorage on app start
useEffect(() => {
  const loadTimes = async () => {
    const storedStart = await AsyncStorage.getItem("startTime");
    const storedEnd = await AsyncStorage.getItem("endTime");
    // console.log("Times Loaded:", storedStart, storedEnd);
    if (storedStart) setStartTime(storedStart);
    if (storedEnd) setEndTime(storedEnd);
  };

  loadTimes();
}, []);

  const openSettings = () => {
    setShowSetTimeModal(true);
  };

  useEffect(() => {
    router.setParams({
      openSettings,
      deleteRoutineEntries,
    });
  }, [routineEntries]);


  const updateDayTime = (day, selectedTime) => {
    // console.log("Updating day time:", day, selectedTime);
  routineNotification(day, selectedTime);
};


  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <ScrollView>
          <View style={{ padding: 12 }}>
            <View style={{ flexDirection: "row" }}>
              {days.map((day, index) => (
                <View key={index} style={styles.box}>
                  <Text style={styles.text}>{day}</Text>
                </View>
              ))}
            </View>

            {timeSlots.map((time, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row" }}>
                <View style={styles.box}>
                  <Text style={styles.text}>{time}</Text>
                </View>
                {days.slice(1).map((day, colIndex) => {
                  const cellData = routineEntries.find(
                    (item) => item.day === day && item.time === time
                  );

                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={styles.box}
                      onPress={() => {
                        setSelectedDay(day);
                        setSelectedTime(time);
                        setShowModal(true);
                        setTitle(cellData ? cellData.title : "");
                        updateDayTime(day, time);
                      }}
                    >
                      <Text style={styles.text}>
                        {cellData ? cellData.title.substring(0, 5) : "+"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowModal(false)}
        />

        <View
          style={{
            backgroundColor: "#1C1C1E",
            padding: 16,
            paddingTop: 8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            gap: 4,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Octicons
              onPress={() => setShowModal(false)}
              name="dash"
              size={28}
              color="#c8c8c8ff"
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 8,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Add Subject for {selectedDay}, {selectedTime}
            </Text>
          </View>

          <View style={styles.inputBox}>
            <MaterialIcons name="text-fields" size={24} color="white" />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Add subject"
              placeholderTextColor={"#a0a0a0"}
              value={title}
              onChangeText={(text) => setTitle(text)}
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
                backgroundColor: "#1F92F1",
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => handleSubmitData()}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSetTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSetTimeModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowSetTimeModal(false)}
        />

        <View
          style={{
            backgroundColor: "#1C1C1E",
            padding: 16,
            paddingTop: 8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            gap: 4,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Octicons
              onPress={() => setShowSetTimeModal(false)}
              name="dash"
              size={28}
              color="#c8c8c8ff"
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 8,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Select Routine Time Range
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Start Time
            </Text>
            <TouchableOpacity onPress={() => setOpenStart(true)}>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{startTime}</Text>
                <FontAwesome name="sort-down" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              End Time
            </Text>
            <TouchableOpacity onPress={() => setOpenEnd(true)}>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{endTime}</Text>
                <FontAwesome name="sort-down" size={20} color="white" />
              </View>
            </TouchableOpacity>
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
                backgroundColor: "#1F92F1",
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => handleSubmitTime()}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={openEnd}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenEnd(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setOpenEnd(false)}
        />
        <View style={styles.modalOverlay}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeList.map((t, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeOption}
                onPress={() => {
                  setEndTime(t);
                  setOpenEnd(false);
                }}
              >
                <Text style={styles.timeOptionText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={openStart}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenStart(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setOpenStart(false)}
        />
        <View style={styles.modalOverlay}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeList.map((t, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeOption}
                onPress={() => {
                  setStartTime(t);
                  setOpenStart(false);
                }}
              >
                <Text style={styles.timeOptionText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default Routine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  containerBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
  },
  box: {
    width: 80, // column width
    height: 50, // row height
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
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
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  timeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500", // semibold equivalent
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderColor: "white",
    marginRight: 6, // spacing between text & icon
  },
  modalOverlay: {
    flex: 1,
    width: "25%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.91)",
    position: "absolute",
    right: 0,
    paddingVertical: 80,
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#1F1F1F",
    padding: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  timeOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  timeOptionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
