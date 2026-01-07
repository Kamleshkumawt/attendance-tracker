import {
  FlatList,
  LayoutAnimation,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Slider from "@react-native-community/slider";
import AddIcon from "@expo/vector-icons/Ionicons";
import RemoveIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle } from "react-native-svg";
import Foundation from "@expo/vector-icons/Foundation";
import { Swipeable } from "react-native-gesture-handler";
import { router } from "expo-router";

function AttendanceCircle({ percentage }) {
  const size = 75;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage * circumference) / 100;

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size}>
        {/* 🔴 Red full circle (background border) */}
        <Circle
          stroke="red"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* 🔵 Blue progress border */}
        <Circle
          stroke="#1F92F1"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Percentage inside */}
      <Text style={{ position: "absolute", color: "white", fontWeight: "700" }}>
        {percentage}%
      </Text>
    </View>
  );
}

const App = () => {
  const [isSelected, setIsSelected] = useState(0);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [value, setValue] = useState(80);
  const [deleteId, setDeleteId] = useState(null);
  const [allowShowAtt, setAllowShowAtt] = useState(0);
  const pagerRef = useRef(null);

  const [attendances, setAttendances] = useState([]);

  const newItem = {
    id: 1,
    subject: "Maths",
    theory: false,
    Attended: 7,
    Absent: 3,
    req: 75, // or dynamic value
    lastUpdate: new Date().toISOString(), // store ISO string
  };

  const getAttendances = async () => {
    try {
      const OverallAttendance = await AsyncStorage.getItem("OverallAttendance");
      setValue(Number(OverallAttendance));
      // console.log("Overall Attendance:", OverallAttendance);
      const AttShow = await AsyncStorage.getItem("AttShowAllow");
      setAllowShowAtt(Number(AttShow));
      // console.log("AttShowAllow:", AttShow);
      const jsonValue = await AsyncStorage.getItem("attendances");
      // console.log("jsonValue", jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.log("Error getting attendances:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadAttendances = async () => {
      const data = await getAttendances();
      setAttendances(data);
      // console.log("Loaded Attendances:", data);
    };

    loadAttendances();
  }, []);

  const addOrUpdateItem = async (item) => {
    // Set last update
    // console.log("Adding or updating item:", item);
    const updatedItem = { ...item, lastUpdate: new Date().toISOString() };

    // Check if item exists
    const index = attendances.findIndex((i) => i.id === item.id);
    let newList = [];
    if (index > -1) {
      // Update
      newList = [...attendances];
      newList[index] = updatedItem;
    } else {
      // Add
      newList = [...attendances, updatedItem];
    }

    setAttendances(newList);
    await AsyncStorage.setItem("attendances", JSON.stringify(newList));
  };

  const incrementAttended = (item) => {
    addOrUpdateItem({ ...item, Attended: item.Attended + 1 });
  };

  const decrementAttended = (item) => {
    addOrUpdateItem({ ...item, Attended: Math.max(item.Attended - 1, 0) });
  };

  const decrementMissed = (item) => {
    addOrUpdateItem({ ...item, Absent: Math.max(item.Absent - 1, 0) });
  };

  const incrementMissed = (item) => {
    addOrUpdateItem({ ...item, Absent: item.Absent + 1 });
  };

  const increaseRequired = (item) => {
    addOrUpdateItem({ ...item, req: item.req + 1 });
  };

  const decreaseRequired = (item) => {
    addOrUpdateItem({ ...item, req: Math.max(item.req - 1, 0) });
  };

  const pages = [
    {
      key: "theory",
      data: attendances.filter((item) => item.theory === true),
    },
    {
      key: "lab",
      data: attendances.filter((item) => item.theory === false),
    },
  ];

  // const Theory = rowData.filter((item) => item.theory);
  // const Lab = rowData.filter((item) => !item.theory);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

  const today = new Date();

  const dateText = `${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}`;
  const dayText = days[today.getDay()];

  const toggleItem = (id) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  function formatDate(isoString) {
    const date = new Date(isoString);

    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${time}, ${month} ${day}, ${year}`;
  }

  const calculatePercentage = (attended, absent) => {
    const total = attended + absent;
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
  };

  const renderDeleteAction = (Id) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setDeleteId(Id);
        }}
        style={{
          backgroundColor: "#7A1E1E",
          justifyContent: "center",
          alignItems: "center",
          width: 90,
          borderRadius: 16,
          marginVertical: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>
          <Foundation name="trash" size={24} color="white" />
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSaveData = async () => {
    try {
      await AsyncStorage.setItem("OverallAttendance", String(value));
      setShowAttendanceModal(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const calculateOverallAttendance = (data) => {
    let totalAttended = 0;
    let totalAbsent = 0;

    data.forEach((item) => {
      totalAttended += item.Attended;
      totalAbsent += item.Absent;
    });

    const totalClasses = totalAttended + totalAbsent;

    if (totalClasses === 0) return 0; // avoid divide by zero

    return ((totalAttended / totalClasses) * 100).toFixed(1); // 1 decimal
  };

  const overall = calculateOverallAttendance(attendances);

  const safeOverall = overall ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.TopDateAndDay}>
        <Text style={styles.TopDateText}>{dateText}</Text>
        <Text style={styles.TopDayText}>{dayText}</Text>
      </View>
      {allowShowAtt === 1 ? (
        <View
          style={[
            styles.line,
            safeOverall < value
              ? { backgroundColor: "#e5bb0043" } // red (below req)
              : { backgroundColor: "#8db85b0f" }, // green (above req)
            safeOverall < value
              ? { borderColor: "#e5bb00ee" } // red (below req)
              : { borderColor: "#8CB85B" }, // green (above req)
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <Text style={styles.OverallText}>Overall Attendance %</Text>
            <Pressable onPress={() => setShowAttendanceModal(true)}>
              <Ionicons name="settings-outline" size={20} color="white" />
            </Pressable>
          </View>

          {/* <View style={[styles.line2, { width: `${safeOverall}%` }, safeOverall < value ? {backgroundColor: "#7A1E1E"} : {backgroundColor: "#8CB85B"}]}/> */}
          <View style={styles.lineContainer}>
            <View
              style={[
                styles.lineFill,
                { width: `${safeOverall}%` },
                safeOverall < value
                  ? { backgroundColor: "#e5bb00ee" }
                  : { backgroundColor: "#8CB85B" },
              ]}
            />
          </View>
          <Text
            style={[
              styles.percentageText,
              safeOverall < value
                ? { color: "#e5bb00ee" }
                : { color: "#8CB85B" },
            ]}
          >
            {safeOverall}%
          </Text>
        </View>
      ) : null}

      <View style={styles.box}>
        <Text
          onPress={() => {
            setIsSelected(0);
            pagerRef.current.scrollToIndex({ index: 0 });
          }}
          style={[
            styles.firstText,
            { backgroundColor: isSelected === 0 ? "#3b3b3b" : "#222222" },
          ]}
        >
          Theory
        </Text>
        <Text
          onPress={() => {
            setIsSelected(1);
            pagerRef.current.scrollToIndex({ index: 1 });
          }}
          style={[
            styles.secondText,
            { backgroundColor: isSelected === 1 ? "#3b3b3b" : "#222222" },
          ]}
        >
          Lab
        </Text>
      </View>
      <FlatList
        data={pages}
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width
          );
          setIsSelected(index);
        }}
        renderItem={({ item: page }) => (
          <FlatList
            data={page.data}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => renderDeleteAction(item.id)}
                onSwipeableOpen={() => {
                  setDeleteId(item.id);
                }}
              >
                <Pressable
                  style={[
                    styles.attBox,
                    { height: expandedItemId === item.id ? 175 : 105 },
                  ]}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    toggleItem(item.id);
                  }}
                >
                  <View style={styles.attSubBox}>
                    {/* <View style={styles.attBoxCircle}>
                    <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                      {calculatePercentage(item.Attended, item.Absent)}%
                    </Text>
                  </View> */}
                    <View style={styles.attBoxCircle}>
                      <AttendanceCircle
                        percentage={calculatePercentage(
                          item.Attended,
                          item.Absent
                        )}
                      />
                    </View>
                    <View style={styles.attBoxText}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingRight: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ color: "#ffffff", fontWeight: "500" }}>
                          {item.subject}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 20 }}>
                          <Pressable
                            onPress={() => router.push("/stickyNotes")}
                          >
                            <MaterialIcons
                              name="note-add"
                              size={20}
                              color="white"
                            />
                          </Pressable>
                          <Pressable
                            onPress={() =>
                              router.push({
                                pathname: "/updateAttendance",
                                params: { id: item.id },
                              })
                            }
                          >
                            <FontAwesome
                              name="sticky-note"
                              size={20}
                              color="white"
                            />
                          </Pressable>
                        </View>
                      </View>
                      <View style={{ flexDirection: "column", gap: 5 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            color: "#ffffff",
                          }}
                        >
                          <Text
                            style={[styles.attBoxText2, { color: "#3492DE" }]}
                          >
                            Attended:{item.Attended}
                          </Text>
                          <Text
                            style={[
                              styles.attBoxText2,
                              {
                                color: "#EE504B",
                              },
                            ]}
                          >
                            Missed:{item.Absent}
                          </Text>
                          <Text
                            style={[
                              styles.attBoxText2,
                              {
                                color: "#687088ff",
                              },
                            ]}
                          >
                            Req.:{item.req}%
                          </Text>
                        </View>
                        <Text style={{ color: calculatePercentage(item.Attended, item.Absent) >= 90 ? "#8CB85B" : "#EE504B", fontWeight: "500" }}>
                          {calculatePercentage(item.Attended, item.Absent) >= 90
                            ? "Can miss 1 class"
                            : "Can't miss any class"}
                        </Text>
                        {expandedItemId === item.id && (
                          <Text
                            style={{
                              color: "#5079ff",
                              fontWeight: "500",
                              marginTop: -7,
                            }}
                          >
                            Last updated:
                            <Text style={{ color: "#a0a0a0" }}>
                              {/* 10:30 AM, Dec 10, 2024 */}
                              {formatDate(item.lastUpdate)}
                            </Text>
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {expandedItemId === item.id && (
                    <View
                      style={{ marginTop: 10, flexDirection: "row", gap: 40 }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Pressable onPress={() => decrementAttended(item)}>
                            <RemoveIcons
                              name="remove-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 16,
                            }}
                          >
                            {item.Attended}
                          </Text>
                          <Pressable onPress={() => incrementAttended(item)}>
                            <AddIcon
                              name="add-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#a0a0a0",
                              fontWeight: "700",
                              fontSize: 14,
                            }}
                          >
                            Attendance
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.inputBox,
                          {
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 5,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Pressable onPress={() => decrementMissed(item)}>
                            <RemoveIcons
                              name="remove-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 16,
                            }}
                          >
                            {item.Absent}
                          </Text>

                          <Pressable onPress={() => incrementMissed(item)}>
                            <AddIcon
                              name="add-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#d37c7b",
                              fontWeight: "700",
                              fontSize: 14,
                            }}
                          >
                            Missed
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.inputBox,
                          {
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 5,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Pressable onPress={() => decreaseRequired(item)}>
                            <RemoveIcons
                              name="remove-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "600",
                              fontSize: 14,
                            }}
                          >
                            {item.req} %
                          </Text>
                          <Pressable onPress={() => increaseRequired(item)}>
                            <AddIcon
                              name="add-circle-outline"
                              size={24}
                              color="#39ad00"
                            />
                          </Pressable>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#a0a0a0",
                              fontWeight: "700",
                              fontSize: 14,
                            }}
                          >
                            Required
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </Pressable>
              </Swipeable>
            )}
          />
        )}
        style={{ paddingBottom: 20 }}
      />

      {/* {isSelected === 2 && (
        <FlatList
          data={pages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setIsSelected(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.attBox}>
              <View style={styles.attBoxCircle}>
                <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                  100%
                </Text>
              </View>
              <View style={styles.attBoxText}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "500" }}>
                    {item.subject}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <MaterialIcons name="note-add" size={20} color="white" />
                    <FontAwesome name="sticky-note" size={20} color="white" />
                  </View>
                </View>
                <View style={{ flexDirection: "column", gap: 5 }}>
                  <View
                    style={{ flexDirection: "row", gap: 10, color: "#ffffff" }}
                  >
                    <Text style={[styles.attBoxText2, { color: "#3492DE" }]}>
                      Attended:{item.Attended}
                    </Text>
                    <Text
                      style={[
                        styles.attBoxText2,
                        {
                          color: "#EE504B",
                        },
                      ]}
                    >
                      Missed:{item.Absent}
                    </Text>
                    <Text
                      style={[
                        styles.attBoxText2,
                        {
                          color: "#687088ff",
                        },
                      ]}
                    >
                      Req.:{item.req}%
                    </Text>
                  </View>
                  <Text style={{ color: "#39ad00", fontWeight: "500" }}>
                    Can miss 1 class
                  </Text>
                </View>
              </View>
            </View>
          )}
          style={{ marginVertical: 10 }}
        />
      )} */}

      {/* {isSelected === 3 && (
        <FlatList
          data={Lab}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setIsSelected(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.attBox}>
              <View style={styles.attBoxCircle}>
                <Text style={{ color: "#ffffff" }}>100%</Text>
              </View>
              <View style={styles.attBoxText}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "500" }}>
                    {item.subject}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <MaterialIcons name="note-add" size={20} color="white" />
                    <FontAwesome name="sticky-note" size={20} color="white" />
                  </View>
                </View>
                <View style={{ flexDirection: "column", gap: 5 }}>
                  <View
                    style={{ flexDirection: "row", gap: 10, color: "#ffffff" }}
                  >
                    <Text style={[styles.attBoxText2, { color: "#5079ff" }]}>
                      Attended:{item.Attended}
                    </Text>
                    <Text
                      style={[
                        styles.attBoxText2,
                        {
                          color: "red",
                        },
                      ]}
                    >
                      Missed:{item.Absent}
                    </Text>
                    <Text
                      style={[
                        styles.attBoxText2,
                        {
                          color: "#687088ff",
                        },
                      ]}
                    >
                      Req.:{item.req}%
                    </Text>
                  </View>
                  <Text style={{ color: "#39ad00", fontWeight: "500" }}>
                    Can miss 1 class
                  </Text>
                </View>
              </View>
            </View>
          )}
          style={{ marginVertical: 10 }}
        />
      )} */}

      <Modal
        visible={showAttendanceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttendanceModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowAttendanceModal(false)}
        />

        <View
          style={{
            backgroundColor: "#1C1C1E",
            padding: 16,
            paddingTop: 8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            gap: 4,
            alignItems: "center",
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
              onPress={() => setShowAttendanceModal(false)}
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
              Set Target Attendance %
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              padding: 40,
            }}
          >
            <Slider
              style={{ width: "100%", height: 20 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={value}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1a9274"
              onValueChange={(val) => setValue(val)}
            />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {value}
              {" %"}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: "#3492DE",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              flexDirection: "row",
              gap: 5,
            }}
            onPress={() => handleSaveData()}
          >
            <Ionicons name="save-sharp" size={18} color="white" />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
              Save
            </Text>
          </Pressable>
        </View>
      </Modal>

      <Modal visible={deleteId !== null} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#131315ff",
              padding: 30,
              borderRadius: 30,
              width: "80%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: "300",
                marginBottom: 20,
              }}
            >
              Are you sure?
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "400",
                marginBottom: 40,
              }}
            >
              Do you want to delete this?
            </Text>
            <View style={{ flexDirection: "row", gap: 20, marginBottom: 10 }}>
              <Pressable
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={async () => {
                  const newList = attendances.filter(
                    (item) => item.id !== deleteId
                  );
                  setAttendances(newList);
                  await AsyncStorage.setItem(
                    "attendances",
                    JSON.stringify(newList)
                  );
                  setDeleteId(null);
                }}
              >
                <Text style={{ color: "red", fontSize: 16, fontWeight: "500" }}>
                  Yes
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={() => setDeleteId(null)}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "500" }}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  TopDateAndDay: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  TopDateText: {
    fontSize: 16,
    backgroundColor: "#222222",
    padding: 5,
    paddingHorizontal: 10,
    fontWeight: "500",
    borderRadius: 5,
    color: "#5079ff",
  },
  TopDayText: {
    fontSize: 16,
    backgroundColor: "#222222",
    padding: 5,
    fontWeight: "500",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#5079ff",
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#222222",
    padding: 3,
    borderRadius: 5,
  },
  firstText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#ffffff",
    textAlign: "center",
    padding: 3,
    borderRadius: 5,
  },
  secondText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#ffffff",
    textAlign: "center",
    padding: 3,
    borderRadius: 5,
  },
  line: {
    height: 90,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 3,
  },
  OverallText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  line2: {
    height: 10,
    backgroundColor: "#c92a2aff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
  },
  lineContainer: {
    height: 10,
    backgroundColor: "#000000", // default black
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  lineFill: {
    height: "100%",
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },
  attBox: {
    flexDirection: "column",
    alignItems: "center",
    width: 370,
    height: 175,
    backgroundColor: "#8db85b18",
    marginHorizontal: 7,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 3,
    borderColor: "#8CB85B",
  },
  attSubBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 370,
    height: 100,
    gap: 3,
  },
  attBoxCircle: {
    marginTop: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  attBoxText: {
    marginLeft: 10,
    marginTop: 10,
  },
  attBoxText2: {
    backgroundColor: "#222222",
    padding: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
    fontWeight: "600",
  },
});
