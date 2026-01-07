import { Pressable, StyleSheet, Text, View,ScrollView,TextInput } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const navigation = useNavigation();

  const faqSettingsData = [
    {
      id: 1,
      q: "Where can I add floating '+' button?",
      a: "You can enable it in 'Settings'.",
    },
    {
      id: 2,
      q: "How can I change 'Notify Me Before' time?",
      a: "You can change it in 'Settings'.",
    }
  ];

  const faqAttendanceData = [
    {
      id: 3,
      q: "How can I delete Attendance & To-Do tasks?",
      a: "Swipe the cards LEFT <- RIGHT to delete.",
    },
    {
      id: 4,
      q: "Where can I set notification?",
      a: "You can set notifications by tapping on the 'Edit'icon beside 'Sticky Notes' in Attendance Screen.",
    },
    {
      id: 5,
      q: "How can I update attendance?",
      a: "Attendance can be updated by tapping on the cards.",
    },
    {
      id: 6,
      q: "Where can I find sticky notes?",
      a: "Sticky notes are visible when you add an attendance subject.",
    },
    {
      id: 7,
      q: "How can i enable overall attendance percentage(%)?",
      a: "You can change them in 'Settings'.",
    },
  ];

  const faqRoutineData = [
    {
      id: 8,
      q: "How can I delete all routines from routine table?",
      a: "Click on the RESET button present in the appbar of 'Routine'.",
    },
    {
      id: 9,
      q: "Can I change Start time & End time of routine table?",
      a: "Yes, click on 'Settings Button' inside the 'Routine' screen.",
    }
  ];

  const faqOthersData = [
    {
      id: 10,
      q: "How can I report bugs / issues, suggest ideas or request a feature?",
      a: "Go to 'Dashboard' -> 'Suggestions / Bug reports'.",
    },
    {
      id: 11,
      q: "How can I contribute to this project?",
      a: "You can contribute by visiting my GitHub via 'Developer' section in 'Dashboard'",
    }
  ];

  useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: showSearch
      ? () => (
          <TextInput
            autoFocus
            placeholder="Search FAQs..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: "#1c1c1e",
              color: "#fff",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
              width: "90%",
            }}
          />
        )
      : "FAQs",

    headerRight: () =>
      showSearch ? (
        <MaterialIcons
          name="close"
          size={24}
          color="#fff"
          style={{ marginRight: 12 }}
          onPress={() => {
            setShowSearch(false);
            setQuery("");
          }}
        />
      ) : (
        <MaterialIcons
          name="search"
          size={24}
          color="#fff"
          style={{ marginRight: 12 }}
          onPress={() => setShowSearch(true)}
        />
      ),
  });
}, [navigation, showSearch, query]);


const filterData = (data) =>
  data.filter((item) =>
    item.q.toLowerCase().includes(query.toLowerCase())
  );


  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.labelText}>Settings</Text>
      {filterData(faqSettingsData).map((item, i) => (
        <View key={i} style={styles.box}>
          <Pressable style={[styles.box1,{borderStartEndRadius:openIndex === item.id && 0, borderEndEndRadius:openIndex === item.id && 0}]} onPress={() => toggle(item.id)}>
            <Text style={styles.boxText}>{item.q}</Text>
            <MaterialIcons
              name={
                openIndex === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#a0a0a0"
            />
          </Pressable>

          {openIndex === item.id && (
            <View style={[styles.box2,{borderEndStartRadius:0, borderStartStartRadius:0}]}>
              <Text style={styles.boxText2}>{item.a}</Text>
            </View>
          )}
        </View>
      ))}

      <Text style={styles.labelText}>Attendance</Text>

       {filterData(faqAttendanceData).map((item, i) => (
        <View key={i} style={styles.box}>
          <Pressable style={[styles.box1,{borderStartEndRadius:openIndex === item.id && 0, borderEndEndRadius:openIndex === item.id && 0}]} onPress={() => toggle(item.id)}>
            <Text style={styles.boxText}>{item.q}</Text>
            <MaterialIcons
              name={
                openIndex === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#a0a0a0"
            />
          </Pressable>

          {openIndex === item.id && (
            <View style={[styles.box2,{borderEndStartRadius:0, borderStartStartRadius:0}]}>
              <Text style={styles.boxText2}>{item.a}</Text>
            </View>
          )}
        </View>
      ))}
       <Text style={styles.labelText}>Routine</Text>
       {filterData(faqRoutineData).map((item, i) => (
        <View key={i} style={styles.box}>
          <Pressable style={[styles.box1,{borderStartEndRadius:openIndex === item.id && 0, borderEndEndRadius:openIndex === item.id && 0}]} onPress={() => toggle(item.id)}>
            <Text style={styles.boxText}>{item.q}</Text>
            <MaterialIcons
              name={
                openIndex === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#a0a0a0"
            />
          </Pressable>

          {openIndex === item.id && (
            <View style={[styles.box2,{borderEndStartRadius:0, borderStartStartRadius:0}]}>
              <Text style={styles.boxText2}>{item.a}</Text>
            </View>
          )}
        </View>
      ))}

       <Text style={styles.labelText}>Others</Text>
       {filterData(faqOthersData).map((item, i) => (
        <View key={i} style={styles.box}>
          <Pressable style={[styles.box1,{borderStartEndRadius:openIndex === item.id && 0, borderEndEndRadius:openIndex === item.id && 0}]} onPress={() => toggle(item.id)}>
            <Text style={styles.boxText}>{item.q}</Text>
            <MaterialIcons
              name={
                openIndex === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#a0a0a0"
            />
          </Pressable>

          {openIndex === item.id && (
            <View style={[styles.box2,{borderEndStartRadius:0, borderStartStartRadius:0}]}>
              <Text style={styles.boxText2}>{item.a}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default Faqs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 10,
    gap: 6,
    marginBottom: 10,
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  box: {
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  boxText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    width: 300,
  },
  boxText2: {
    color: "#a0a0a0",
    fontSize: 14,
    fontWeight: "400",
    width: 350,
  },
  box1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1c1c1e",
    padding: 12,
    color: "#fff",
    borderRadius: 10,
  },
  box2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
