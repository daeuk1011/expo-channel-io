import { useEffect, useState } from "react";
import ExpoChannelIo from "expo-channel-io";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [pluginKey, setPluginKey] = useState(
    process.env.EXPO_PUBLIC_CHANNEL_PLUGIN_KEY || ""
  );
  const [memberId, setMemberId] = useState("test-user-123");
  const [isBooted, setIsBooted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    setIsBooted(ExpoChannelIo.isBooted());
  }, []);

  // Boot
  const handleBoot = async () => {
    if (!pluginKey) {
      Alert.alert("Error", "Plugin Key is required");
      return;
    }

    try {
      log("Booting...");
      const result = await ExpoChannelIo.boot({
        pluginKey,
        memberId,
        profile: {
          name: "Test User",
          email: "test@example.com",
          mobileNumber: "01012345678",
          customField: "custom value",
        },
        language: "ko",
        appearance: "system",
        channelButtonOption: {
          icon: "channel",
          position: "right",
          xMargin: 16,
          yMargin: 100,
        },
        bubbleOption: {
          position: "bottom",
          yMargin: 20,
        },
        hideChannelButtonOnBoot: false,
        trackDefaultEvent: true,
      });

      log(`Boot result: ${result.status}`);
      if (result.user) {
        log(`User: ${result.user.name || result.user.memberId}`);
        setCurrentUser(result.user);
      }
      setIsBooted(true);
    } catch (error: any) {
      log(`Boot error: ${error.message}`);
    }
  };

  // Sleep & Shutdown
  const handleSleep = () => {
    ExpoChannelIo.sleep();
    log("Sleep called");
  };

  const handleShutdown = () => {
    ExpoChannelIo.shutdown();
    setIsBooted(false);
    setCurrentUser(null);
    log("Shutdown called");
  };

  // Messenger
  const handleShowMessenger = () => {
    ExpoChannelIo.showMessenger();
    log("Show Messenger");
  };

  const handleHideMessenger = () => {
    ExpoChannelIo.hideMessenger();
    log("Hide Messenger");
  };

  // Channel Button
  const handleShowButton = () => {
    ExpoChannelIo.showChannelButton();
    log("Show Channel Button");
  };

  const handleHideButton = () => {
    ExpoChannelIo.hideChannelButton();
    log("Hide Channel Button");
  };

  // Chat & Workflow
  const handleOpenChat = () => {
    ExpoChannelIo.openChat(null, "Hello from example app!");
    log("Open Chat");
  };

  const handleOpenWorkflow = () => {
    ExpoChannelIo.openWorkflow(null);
    log("Open Workflow");
  };

  // Update User
  const handleUpdateUser = async () => {
    try {
      const user = await ExpoChannelIo.updateUser({
        language: "ko",
        profile: {
          name: "Updated User",
          email: "updated@example.com",
        },
        tags: ["vip", "premium"],
      });
      log(`User updated: ${JSON.stringify(user)}`);
      setCurrentUser(user);
    } catch (error: any) {
      log(`Update user error: ${error.message}`);
    }
  };

  // Tags
  const handleAddTags = async () => {
    try {
      const result = await ExpoChannelIo.addTags(["new-tag", "example"]);
      log(`Tags added: ${JSON.stringify(result)}`);
    } catch (error: any) {
      log(`Add tags error: ${error.message}`);
    }
  };

  const handleRemoveTags = async () => {
    try {
      const result = await ExpoChannelIo.removeTags(["new-tag"]);
      log(`Tags removed: ${JSON.stringify(result)}`);
    } catch (error: any) {
      log(`Remove tags error: ${error.message}`);
    }
  };

  // Track
  const handleTrack = () => {
    ExpoChannelIo.track("test_event", {
      buttonName: "Track Button",
      timestamp: Date.now(),
    });
    log("Event tracked: test_event");
  };

  // Page
  const handleSetPage = () => {
    ExpoChannelIo.setPage("example_page", { pageView: "example" });
    log("Page set: example_page");
  };

  const handleResetPage = () => {
    ExpoChannelIo.resetPage();
    log("Page reset");
  };

  // Appearance
  const handleSetAppearance = (appearance: "light" | "dark" | "system") => {
    ExpoChannelIo.setAppearance(appearance);
    log(`Appearance set: ${appearance}`);
  };

  // Debug Mode
  const handleToggleDebug = () => {
    ExpoChannelIo.setDebugMode(true);
    log("Debug mode enabled");
  };


  // Hide Popup
  const handleHidePopup = () => {
    ExpoChannelIo.hidePopup();
    log("Popup hidden");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Expo Channel.io Example</Text>
        <Text style={styles.status}>
          Status: {isBooted ? "Booted" : "Not Booted"}
        </Text>

        {/* Boot Section */}
        <Group title="Boot Configuration">
          <TextInput
            style={styles.input}
            placeholder="Plugin Key"
            value={pluginKey}
            onChangeText={setPluginKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Member ID"
            value={memberId}
            onChangeText={setMemberId}
          />
          <Button title="Boot" onPress={handleBoot} />
          <View style={styles.buttonRow}>
            <Button title="Sleep" onPress={handleSleep} />
            <Button title="Shutdown" onPress={handleShutdown} color="red" />
          </View>
        </Group>

        {/* Messenger */}
        <Group title="Messenger">
          <View style={styles.buttonRow}>
            <Button title="Show" onPress={handleShowMessenger} />
            <Button title="Hide" onPress={handleHideMessenger} />
          </View>
        </Group>

        {/* Channel Button */}
        <Group title="Channel Button">
          <View style={styles.buttonRow}>
            <Button title="Show" onPress={handleShowButton} />
            <Button title="Hide" onPress={handleHideButton} />
          </View>
        </Group>

        {/* Chat & Workflow */}
        <Group title="Chat & Workflow">
          <View style={styles.buttonRow}>
            <Button title="Open Chat" onPress={handleOpenChat} />
            <Button title="Open Workflow" onPress={handleOpenWorkflow} />
          </View>
        </Group>

        {/* User Management */}
        <Group title="User Management">
          <Button title="Update User" onPress={handleUpdateUser} />
          <View style={styles.buttonRow}>
            <Button title="Add Tags" onPress={handleAddTags} />
            <Button title="Remove Tags" onPress={handleRemoveTags} />
          </View>
        </Group>

        {/* Tracking */}
        <Group title="Tracking">
          <Button title="Track Event" onPress={handleTrack} />
          <View style={styles.buttonRow}>
            <Button title="Set Page" onPress={handleSetPage} />
            <Button title="Reset Page" onPress={handleResetPage} />
          </View>
        </Group>

        {/* Appearance */}
        <Group title="Appearance">
          <View style={styles.buttonRow}>
            <Button title="Light" onPress={() => handleSetAppearance("light")} />
            <Button title="Dark" onPress={() => handleSetAppearance("dark")} />
            <Button title="System" onPress={() => handleSetAppearance("system")} />
          </View>
        </Group>

        {/* Settings */}
        <Group title="Settings">
          <View style={styles.buttonRow}>
            <Button title="Debug Mode" onPress={handleToggleDebug} />
            <Button title="Hide Popup" onPress={handleHidePopup} />
          </View>
        </Group>

        {/* Current User Info */}
        {currentUser && (
          <Group title="Current User">
            <Text style={styles.userInfo}>
              {JSON.stringify(currentUser, null, 2)}
            </Text>
          </Group>
        )}

        {/* Logs */}
        <Group title="Logs">
          {logs.map((logItem, index) => (
            <Text key={index} style={styles.logText}>
              {logItem}
            </Text>
          ))}
          {logs.length === 0 && (
            <Text style={styles.logText}>No logs yet</Text>
          )}
        </Group>
      </ScrollView>
    </View>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
  },
  group: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  userInfo: {
    fontFamily: "monospace",
    fontSize: 12,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  logText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
});
