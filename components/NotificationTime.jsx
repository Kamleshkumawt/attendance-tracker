import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const timeOptions = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "1 hour",
  "2 hours",
];

export default function NotificationTime() {
  const [visible, setVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState("1 hour");

  return (
    <>
      {/* MAIN CARD */}
      <Pressable style={styles.box1} onPress={() => setVisible(true)}>
        <View style={styles.box2}>
          <Text style={styles.boxText}>Notification Time Before Class</Text>
          <Text style={styles.boxText2}>{selectedTime} before class</Text>
        </View>

        <View style={styles.iconWrap}>
          <MaterialIcons name="notifications" size={24} color="#88c24a" />
        </View>
      </Pressable>

      {/* BOTTOM POPUP */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        />

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Notify Me Before</Text>

          {timeOptions.map((item) => (
            <Pressable
              key={item}
              style={styles.option}
              onPress={() => {
                setSelectedTime(item);
                setVisible(false);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>

              {selectedTime === item && (
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#88c24a"
                />
              )}
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    padding: 14,
    borderRadius: 12,
  },
  box2: {
    gap: 4,
  },
  boxText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  boxText2: {
    color: "#a0a0a0",
    fontSize: 13,
  },
  iconWrap: {
    backgroundColor: "#313d23",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#111",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});

