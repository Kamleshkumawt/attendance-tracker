import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const [selected, setSelected] = useState(0);
  const [selected1, setSelected1] = useState(0);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("1 hour");

  const handleTimeSelection = async (time) => {
    setSelectedTime(time);
    await AsyncStorage.setItem("NTBC", time);
    setShowTimeModal(false);
  };

  const handleAttendance = async (selected) => {
    setSelected(selected);
    await AsyncStorage.setItem("AttShowAllow", String(selected));
    // console.log('AttShowAllow',selected);
  };

   useEffect(() => {
    const loadAttendances = async () => {
      const NotifyMeTime = await AsyncStorage.getItem("NTBC");
      setSelectedTime(NotifyMeTime);
      const AttShow = await AsyncStorage.getItem("AttShowAllow");
      // console.log("Loaded Attendances:", data);
      setSelected(Number(AttShow));
    };

    loadAttendances();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>Native settings</Text>
      <View style={styles.box}>
        <Pressable style={styles.box1}>
          <View style={styles.box2}>
            <Text style={styles.boxText}>Theme</Text>
            <Text style={styles.boxText2}>System (Default)</Text>
          </View>
          <View
            style={{
              backgroundColor: "#313d23",
              width: 40,
              height: 40,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="mobile-phone" size={26} color="#88c24a" />
          </View>
        </Pressable>
      </View>
      <View style={styles.box}>
        <Pressable style={styles.box1} onPress={() => setShowTimeModal(true)}>
          <View style={styles.box2}>
            <Text style={styles.boxText}>Notification Time Before Class</Text>
            <Text style={styles.boxText2}>{selectedTime} before class</Text>
          </View>
          <View
            style={{
              backgroundColor: "#313d23",
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="notifications" size={24} color="#88c24a" />
          </View>
        </Pressable>
      </View>
      <Text style={styles.labelText}>UI settings</Text>
      <View style={styles.box}>
        <Pressable style={styles.box1}>
          <Text style={styles.boxText}>Floating Button</Text>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setSelected1(selected1 === 0 ? 1 : 0)}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  alignItems: selected1 === 0 ? "flex-start" : "flex-end",
                  backgroundColor: selected1 === 0 ? "#000" : "#1f5989",
                  borderColor: selected1 === 0 ? "#ffffff" : "#1f5989",
                },
              ]}
            >
              <View
                style={[
                  styles.selectedCircle,
                  {
                    backgroundColor: selected1 === 0 ? "#ffffff" : "#2196f1",
                    width: selected1 === 0 ? 18 : 23,
                    height: selected1 === 0 ? 18 : 23,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </Pressable>
      </View>
      <View style={styles.box}>
        <Pressable style={styles.box1}>
          <View style={styles.box2}>
            <Text style={styles.boxText}>Overall Attendance %</Text>
            <Text style={[styles.boxText2, { fontSize: 14 }]}>
              Show or hide overall attendance
            </Text>
            <Text style={[styles.boxText2, { fontSize: 14 }]}>
              percentage on home screen.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => handleAttendance(selected === 0 ? 1 : 0)}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  alignItems: selected === 0 ? "flex-start" : "flex-end",
                  backgroundColor: selected === 0 ? "#000" : "#1f5989",
                  borderColor: selected === 0 ? "#ffffff" : "#1f5989",
                },
              ]}
            >
              <View
                style={[
                  styles.selectedCircle,
                  {
                    backgroundColor: selected === 0 ? "#ffffff" : "#2196f1",
                    width: selected === 0 ? 18 : 23,
                    height: selected === 0 ? 18 : 23,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </Pressable>
      </View>
      <View style={styles.box}>
        <Pressable style={styles.box1}>
          <View style={styles.box2}>
            <Text style={styles.boxText}>Graph Style</Text>
            <Text style={[styles.boxText2, { fontSize: 14, width: 270 }]}>
              Tap to switch between Bar Graph and Circular Graph.
            </Text>
          </View>
          <FontAwesome5 name="circle-notch" size={28} color="white" />
        </Pressable>
      </View>
      <View style={styles.box}>
        <Pressable style={styles.box1}>
          <Text style={styles.boxText}>Graph Color</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "blue",
                width: 40,
                height: 40,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
            <View
              style={{
                backgroundColor: "red",
                width: 40,
                height: 40,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
            <MaterialIcons name="arrow-drop-down" size={24} color="white" />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowTimeModal(false)}
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
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Octicons onPress={() => setShowTimeModal(false)} name="dash" size={28} color="#c8c8c8ff" />
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
            Notify Me Before
          </Text>
            </View>

          {["15 minutes", "30 minutes", "45 minutes", "1 hour", "2 hours"].map(
            (item) => (
              <Pressable
                key={item}
                onPress={() => {
                  handleTimeSelection(item);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: "#000000",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>{item}</Text>

                {selectedTime === item && (
                  <Ionicons name="checkmark" size={24} color="#3B8FD3" />
                )}
              </Pressable>
            )
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 10,
    gap: 6,
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  box: {
    backgroundColor: "#212121",
    marginTop: 5,
    justifyContent: "center",
    borderRadius: 14,
    padding: 16,
    color: "#fff",
    gap: 35,
  },
  boxText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "600",
  },
  boxText2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
  box1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  box2: {
    flexDirection: "column",
    gap: 1,
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
    borderWidth: 3,
    justifyContent: "center",
    padding: 3,
  },

  selectedCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
});
