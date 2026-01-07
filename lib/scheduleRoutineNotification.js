import * as Notifications from "expo-notifications";

async function scheduleRoutineNotification(day, time, notifyBefore) {
  if (!time) return;

  const date = new Date(time);
  
  // subtract notifyBefore minutes
  date.setMinutes(date.getMinutes() - notifyBefore);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Routine Reminder`,
      body: `${day} routine in ${notifyBefore} minutes.`,
    },
    trigger: {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true, // daily (or weekly if you want)
    },
  });
}

export default scheduleRoutineNotification;