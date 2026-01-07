import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Dashboard = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! 👋 Check out this amazing app 📱\nDownload now: https://yourapp.link",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const openPlayStore = () => {
    const packageName = "com.yourapp.package"; // 👈 your app id

    const url = Platform.select({
      android: `market://details?id=${packageName}`,
      ios: `https://apps.apple.com/app/idYOUR_APP_ID`, // optional
    });

    Linking.openURL(url).catch(() => {
      // fallback if Play Store app not available
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${packageName}`
      );
    });
  };

  const openMoreApps = () => {
    const developerName = "YOUR_DEVELOPER_NAME";

    const url = Platform.select({
      android: `market://search?q=pub:${developerName}`,
      ios: `https://apps.apple.com/developer/${developerName}`, // optional
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://play.google.com/store/search?q=pub:${developerName}`
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#a0a0a0",
          fontSize: 18,
          fontWeight: "400",
          textAlign: "center",
        }}
      >
        Version:1.2.9
      </Text>
      <View style={styles.box}>
        <Pressable style={styles.box1} onPress={() => router.push("/settings")}>
          <View style={styles.box2}>
            <SimpleLineIcons name="settings" size={24} color="white" />
            <Text style={styles.boxText}>Settings</Text>
          </View>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>

        <Pressable style={styles.box1} onPress={() => router.push("/faqs")}>
          <View style={styles.box2}>
            <AntDesign name="question-circle" size={24} color="white" />
            <Text style={styles.boxText}>FAQs</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>
      </View>

      <View style={styles.box}>
        <Pressable
          style={styles.box1}
          onPress={() => router.push("/bugReports")}
        >
          <View style={styles.box2}>
            <MaterialCommunityIcons
              name="text-box-edit-outline"
              size={24}
              color="white"
            />
            <Text style={styles.boxText}>Suggestions / Bug reports</Text>
          </View>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>

        <Pressable style={styles.box1} onPress={onShare}>
          <View style={styles.box2}>
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.boxText}>Share with friends</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>
        <Pressable style={styles.box1} onPress={openPlayStore}>
          <View style={styles.box2}>
            <Ionicons name="star-outline" size={24} color="white" />
            <Text style={styles.boxText}>
              Rate us 5 <AntDesign name="star" size={20} color="yellow" />
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>
        <Pressable style={styles.box1} onPress={openMoreApps}>
          <View style={styles.box2}>
            <MaterialCommunityIcons
              name="square-rounded-badge-outline"
              size={24}
              color="white"
            />
            <Text style={styles.boxText}>More Apps</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>
      </View>

      <View style={styles.box}>
        <Pressable
          style={styles.box1}
          onPress={() => setModalVisible(!isModalVisible)}
        >
          <View style={styles.box2}>
            <AntDesign name="copyright-circle" size={24} color="white" />
            <Text style={styles.boxText}>Developer</Text>
          </View>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={28}
            color="#a0a0a0"
          />
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#9CA3AF", // modern soft gray
              fontSize: 14,
              fontWeight: "500",
              letterSpacing: 0.6,
            }}
          >
            MADE WITH
          </Text>

          <AntDesign
            name="heart"
            size={14}
            color="#EF4444" // modern red
            style={{ marginHorizontal: 6 }}
          />

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              fontWeight: "500",
              letterSpacing: 0.6,
            }}
          >
            BY
          </Text>

          <Text
            style={{
              marginLeft: 6,
              color: "#EF4444",
              fontSize: 14,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            KAMLESH
          </Text>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1 }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 22, fontWeight: 400, color: "#ffffff" }}>
                Kamlesh Kumawat
              </Text>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>
                COMPUTER APPLICATION
              </Text>
              <Text style={{ fontSize: 10, fontWeight: 900, color: "#ffffff" }}>
                MLSU UDAIPUR
              </Text>
            </View>
            <View style={styles.cardSocialMedia}>
              {/* social media */}
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/kamlesh-kumawat-598988330/"
                  )
                }
              >
                <Entypo name="youtube" size={30} color="#F81910" />
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/kamlesh-kumawat-598988330/"
                  )
                }
              >
                <FontAwesome6 name="square-x-twitter" size={28} color="black" />
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://www.instagram.com/kamleshkumawat68")
                }
              >
                <Entypo name="instagram" size={28} color="#BE4751" />
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://github.com/Kamleshkumawt")
                }
              >
                <FontAwesome name="github-square" size={30} color="black" />
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/kamlesh-kumawat-598988330/"
                  )
                }
              >
                <FontAwesome6 name="linkedin" size={28} color="#0076B3" />
              </Pressable>
            </View>
          </View>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 10,
  },
  box: {
    backgroundColor: "#212121",
    marginTop: 20,
    justifyContent: "center",
    borderRadius: 20,
    padding: 16,
    color: "#fff",
    gap: 35,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
  },
  box1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  box2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  card: {
    width: 340,
    backgroundColor: "#90CAF8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    padding: 24,
    color: "#fff",
    gap: 10,
    marginHorizontal: 20,
  },
  cardHeader: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  cardSocialMedia: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
