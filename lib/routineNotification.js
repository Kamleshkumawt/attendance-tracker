import * as Notifications from "expo-notifications";

async function routineNotification(day, time) {
  if (!time) return;

  const date = new Date(time);
  
  // subtract notifyBefore minutes
  date.setMinutes(date.getMinutes());

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Routine Reminder`,
      body: `${day} routine in ${time} minutes.`,
    },
    trigger: {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true, // daily (or weekly if you want)
    },
  });
}

export default routineNotification;