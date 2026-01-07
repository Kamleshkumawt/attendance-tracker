import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddIcon from "@expo/vector-icons/Ionicons";
import RemoveIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import scheduleRoutineNotification from "@/lib/scheduleRoutineNotification";

export const unstable_settings = {
  headerShown: true, // show header
};

const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Attendance = () => {
  const [subject, setSubject] = useState("");
  const [selected, setSelected] = useState(0);
  const [attended, setAttended] = useState(0);
  const [missed, setMissed] = useState(0);
  const [required, setRequired] = useState(75);
  const [alarmIsOn, setAlarmIsOn] = useState(false);
  const [notifyTime, setNotifyTime] = useState("");
  const { id } = useLocalSearchParams();
  const [attendances, setAttendances] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dayTimes, setDayTimes] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });
  
  const [activeDay, setActiveDay] = useState(null);

  // const handleSubmitData = () => {
  //   if (!subject) {
  //     alert("Please enter a subject");
  //     return;
  //   }
  //   console.log(subject, selected, attended, missed, required);
  // };

  const getAttendances = async () => {
    try {
      const NotifyMeTime = await AsyncStorage.getItem("NTBC");
      setNotifyTime(NotifyMeTime);
      const jsonValue = await AsyncStorage.getItem("attendances");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.log("Error getting attendances:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadAttendances = async () => {
      const dataList = await getAttendances();
      // get one item
      // console.log("Loaded Attendances:", dataList);
      // console.log("Received id:", id);
      const item = dataList.find((i) => i.id.toString() === id.toString());
      setAttended(item ? item.Attended : 0);
      setMissed(item ? item.Absent : 0);
      setRequired(item ? item.req : 75);
      setSubject(item ? item.subject : "");
      setSelected(item ? (item.theory ? 0 : 1) : 0);
      setDayTimes(item ? item.dayTimes : {});
      // console.log("DayTimes:", dayTimes);
      // console.log("Found Item:", item);
      setAttendances(dataList);
    };

    loadAttendances();
  }, []);

  const handleSubmitData = async () => {
    const updatedAttendances = attendances.map((item) =>
      item.id.toString() === id.toString()
        ? {
            ...item,
            subject,
            theory: selected === 0,
            Attended: attended,
            Absent: missed,
            req: required,
            lastUpdate: new Date().toISOString(),
          }
        : item
    );
    // console.log("Updated Attendances:", updatedAttendances);
    setAttendances(updatedAttendances);
    await AsyncStorage.setItem(
      "attendances",
      JSON.stringify(updatedAttendances)
    );

    router.push("/(tabs)/");
  };

const formatTime = (d) => {
  if (!d) return "Select Time";   // handle null

  const dateObj = new Date(d);    // convert ISO string → Date

  if (isNaN(dateObj.getTime())) return "Invalid"; // handle bad date

  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

  const onchangeTime = (event, selectedTime) => {
    if (selectedTime && activeDay) {
      setDayTimes({
        ...dayTimes,
        [activeDay]: selectedTime, // ⭐ Save time for clicked day
      });
      updateDayTime(activeDay, selectedTime);
    }

    setShowTimePicker(false);
    setActiveDay(null);
  };

  const updateDayTime = (day, selectedTime) => {
  // console.log("Updating day time:", day, selectedTime, notifyTime);
  setDayTimes(prev => ({
    ...prev,
    [day]: selectedTime
  }));

  scheduleRoutineNotification(day, selectedTime, notifyTime);
};

  const handleDelete = async () => {
    const updatedAttendances = attendances.filter(
      (item) => item.id.toString() !== id.toString()
    );
    setAttendances(updatedAttendances);
    await AsyncStorage.setItem(
      "attendances",
      JSON.stringify(updatedAttendances)
    );
    router.push("/(tabs)/");
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.topText}>
        {"Once saved, swipe the card (Left<--- Right) to 'DELETE'"}
      </Text>
      <View>
        <Text style={styles.labelText}>Enter subject</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="bar-chart" size={24} color="white" />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Subject"
            placeholderTextColor={"#a0a0a0"}
            value={subject}
            onChangeText={(text) => setSubject(text)}
          />
        </View>
        <Text style={styles.labelText}>Is this a Lab subject?</Text>
        <View
          style={{
            borderRadius: 10,
            padding: 10,
            borderColor: "#a0a0a0",
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <View style={styles.textContainer}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, color: "#6cba62ff" }}
            >
              Lab subject
            </Text>
            <Text style={{ fontSize: 14, color: "#a0a0a0", fontWeight: "600" }}>
              Turn on if this is a Lab subject
            </Text>
          </View>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setSelected(selected === 0 ? 1 : 0)}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  alignItems: selected === 0 ? "flex-start" : "flex-end",
                  backgroundColor: selected === 0 ? "#000" : "#91ba62",
                  borderColor: selected === 0 ? "#ffffff" : "#91ba62",
                },
              ]}
            >
              <View
                style={[
                  styles.selectedCircle,
                  { backgroundColor: selected === 0 ? "#ffffff" : "#33ff00ff" },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.labelText}>Enter the no. of classes attended</Text>
        <View
          style={[
            styles.inputBox,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={26}
              color="#61b6fa"
            />
            <Text style={{ color: "#61b6fa", fontWeight: "700", fontSize: 16 }}>
              Attended
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => setAttended(attended > 0 ? attended - 1 : 0)}
            >
              <RemoveIcons
                name="remove-circle-outline"
                size={24}
                color="white"
              />
            </Pressable>
            <View
              style={{
                width: 65,
                height: 40,
                backgroundColor: "#4b4b4bff",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {attended}
              </Text>
            </View>
            <Pressable onPress={() => setAttended(attended + 1)}>
              <AddIcon name="add-circle-outline" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.labelText}>Enter the no. of classes missed</Text>

        <View
          style={[
            styles.inputBox,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="close-circle-outline" size={26} color="#d37c7b" />
            <Text style={{ color: "#d37c7b", fontWeight: "700", fontSize: 16 }}>
              Missed
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Pressable onPress={() => setMissed(missed > 0 ? missed - 1 : 0)}>
              <RemoveIcons
                name="remove-circle-outline"
                size={24}
                color="white"
              />
            </Pressable>
            <View
              style={{
                width: 65,
                height: 40,
                backgroundColor: "#4b4b4bff",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {missed}
              </Text>
            </View>
            <Pressable onPress={() => setMissed(missed + 1)}>
              <AddIcon name="add-circle-outline" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.labelText}>Enter the % of classes required</Text>

        <View
          style={[
            styles.inputBox,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={26}
              color="#a0a0a0"
            />
            <Text style={{ color: "#a0a0a0", fontWeight: "700", fontSize: 16 }}>
              Required
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => setRequired(required > 0 ? required - 1 : 0)}
            >
              <RemoveIcons
                name="remove-circle-outline"
                size={24}
                color="white"
              />
            </Pressable>
            <View
              style={{
                width: 65,
                height: 40,
                backgroundColor: "#4b4b4bff",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                {required}%
              </Text>
            </View>
            <Pressable onPress={() => setRequired(required + 1)}>
              <AddIcon name="add-circle-outline" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.labelText}>
          Set weekly schedules for push notifications
        </Text>

        <Pressable
          style={[
            styles.inputBox,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
          onPress={() => setAlarmIsOn(!alarmIsOn)}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="alarm" size={26} color="#fac830" />
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ color: "#fac830", fontWeight: "700", fontSize: 18 }}
              >
                Routine
              </Text>
              <Text
                style={{ color: "#fac830", fontWeight: "600", fontSize: 14 }}
              >
                Notification will be sent {notifyTime} before
              </Text>
            </View>
          </View>
          {alarmIsOn ? (
            <MaterialIcons name="arrow-drop-up" size={24} color="#fac830" />
          ) : (
            <MaterialIcons name="arrow-drop-down" size={24} color="#fac830" />
          )}
        </Pressable>

        {alarmIsOn &&
          Days.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                height: 45,
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                {item}
              </Text>
              <Pressable
                onPress={() => {
                  setActiveDay(item);
                  setShowTimePicker(true);
                }}
              >
                <Text
                  style={{ color: "#a0a0a0", fontSize: 16, fontWeight: "500" }}
                >
                  {dayTimes[item] ? formatTime(dayTimes[item]) : "Select Time"}
                </Text>
              </Pressable>
            </View>
          ))}

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
           <AntDesign name="reload" size={22} color="white" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Update
            </Text>
          </Pressable>
        </View>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={dayTimes[activeDay] || new Date()}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={onchangeTime}
        />
      )}
    </ScrollView>
  );
};

export default Attendance;

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
  textContainer: {
    flexDirection: "column",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  radioCircle: {
    height: 35,
    width: 60,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    padding: 3,
  },

  selectedCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
  },
});
