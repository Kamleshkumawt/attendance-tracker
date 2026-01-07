import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const ToDo = () => {
  const [stickyNotes, setStickyNotes] = useState([]);

  const [selected, setSelected] = useState([]);

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

  const deleteNotes = async (id) => {
    try {
      const updatedNotes = stickyNotes.filter((note) => note.id !== id);
      setStickyNotes(updatedNotes);
      await AsyncStorage.setItem("todoNotes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.log("Error deleting sticky note:", error);
    }
  };

  const taskCompleted = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const Radio = ({ value }) => (
    <TouchableOpacity
      onPress={() => taskCompleted(value)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#1F92F1",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected.includes(value) && (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#1F92F1",
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

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
  if (!d) return ""; // handle undefined or null

  const date = new Date(d); // convert string → Date object

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};


  return (
    <View style={styles.container}>
      <FlatList
        data={stickyNotes}
        renderItem={({ item }) => (
          <View
            style={{
              flex: stickyNotes.length === 0 ? 1 : 0,
              flexDirection: "column",
              gap: 8,
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 6,
            }}
          >
            <View style={styles.stickyBox}>
              <View style={{ padding: 4 }}>
                <Radio value={item.id} />
              </View>
              <Pressable
                onPress={() => router.push(`/updateMyTask?id=${item.id}`)}
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Text
                  style={[
                    styles.HeaderText,
                    {
                      textDecorationLine: selected.includes(item.id)
                        ? "line-through"
                        : "none",
                    },
                  ]}
                >
                  {item.plan}{" "}
                </Text>
                <Text
                  style={[
                    styles.SubText,
                    {
                      textDecorationLine: selected.includes(item.id)
                        ? "line-through"
                        : "none",
                    },
                  ]}
                  numberOfLines={4}
                  ellipsizeMode="tail"
                >
                  {item.note}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      color: "white",
                      fontSize: 20,
                      justifyContent: "center",
                      alignItems: "end",
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={[
                        styles.dateTimeText,
                        {
                          color: selected.includes(item.id)
                            ? "#ffffff"
                            : "#1F92F1",
                        },
                      ]}
                    >
                      {formatDate(item.date)}
                    </Text>
                    <Text
                      style={[
                        styles.dateTimeText,
                        {
                          color: selected.includes(item.id)
                            ? "#ffffff"
                            : "#1F92F1",
                        },
                      ]}
                    >
                      {formatTime(item.time)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      {stickyNotes.length === 0 && (
        <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
          <Text style={styles.Toptext}>
            Plan your work, And work your plan!
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.push("/addMyTask")}
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

export default ToDo;

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
    fontSize: 18,
    fontWeight: "bold",
  },
  SubText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  stickyBox: {
    flexDirection: "row",
    borderWidth: 2,
    width: 370,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    gap: 6,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
