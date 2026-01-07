import React, { useState } from "react";
import { View, Button, Platform } from "react-native";
import DatePicker from "react-native-date-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MyDatePicker() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false); // IMPORTANT
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ marginTop: 50 }}>
        <Button title="Select Date" onPress={() => setShow(true)} />

        {show && (
          <DatePicker
            value={date}
            mode="date"
            display={Platform.OS === "android" ? "calendar" : "spinner"}
            onChange={onChange}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}