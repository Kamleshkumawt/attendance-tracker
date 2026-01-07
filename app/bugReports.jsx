import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const BugReports = () => {
  const [text, setText] = React.useState("");

  const handleSubmit = () => {
    console.log(text);
    setText("");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>
        Please describe your issue or suggestion:
      </Text>
      <TextInput
        placeholder="Write your feedback here..."
        placeholderTextColor={"#a0a0a0"}
        style={styles.textarea}
        multiline
        maxLength={1000}
        value={text}
        onChangeText={setText}
      />

      <Pressable onPress={()=>handleSubmit()} style={styles.button}>
        <Ionicons name="send-sharp" size={22} color="white" />
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}>
          Submit Feedback
        </Text>
      </Pressable>
    </View>
  );
};

export default BugReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 10,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 12,
    width: 350,
    minHeight: 200,
    height: 150,
    borderWidth: 1,
    textAlignVertical: "top",
    borderColor: "#B28DE2",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: 300,
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#7C4DFF",
    marginTop: 30,
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 16,
    marginBottom: 3,
    paddingRight: 40,
  },
});
