import ExpoChannelIo from "expo-channel-io";
import { useEffect } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

if (Platform.OS === "web") ExpoChannelIo.loadScript();

export default function App() {
  useEffect(() => {
    if (!ExpoChannelIo.isBooted()) {
      console.log("채널톡 부트 🚀 🚀 🚀");

      ExpoChannelIo.boot({
        pluginKey: "6394e760-45e7-4f24-985c-4c26c54a9207",
        memberId: "test1324",
        profile: {
          name: "홍길동",
          nickname: "개발 테스트",
          email: "holgildong@gamil.com",
          mobileNumber: "01012341234",
          회원상태: "normal",
          tier: "Vip",
          provider: "kakao",
          birth: "2000.01.01",
          sex: "male",
          bankAccount: "002 1002959178051",
          deletedAt: "",
          deletedReason: "",
          CumulativeLoginCount: 0,
          CumulativeCampaignHistoryCount: 0,
          CumulativeRefererList: 0,
          CumulativePenaltyCount: 0,
          tierLoginCount: 0,
          tierCampainCount: 0,
          tierInviteCount: 0,
          tierPenaltyCount: 0,
          campaignHistoryCount: 0,
          campaignInProgressCount: 0,
          point: 0,
          cashbackFromReward: 0,
          cashbackFromPoint: 0,
          penalty: 0,
          adminMemo: "",
        },
        appearance: "system",
        channelButtonOption: {
          icon: "channel",
          position: "right",
          xMargin: 20,
          yMargin: 100,
        },
      });

      ExpoChannelIo.showChannelButton();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>

        <Group name="Hello">
          <Text>테스트</Text>
          <Button
            title="Show Messenger"
            onPress={() => ExpoChannelIo.showMessenger()}
          />
        </Group>

        <Group name="Hello">
          <Text>테스트</Text>
          <Button
            title="Show Button"
            onPress={() => ExpoChannelIo.showChannelButton()}
          />
          <Button
            title="Hide Button"
            onPress={() => ExpoChannelIo.hideChannelButton()}
          />
        </Group>

        <Group name="Hello">
          <Text>테스트</Text>
          <Button
            title="다크 테마"
            onPress={() => ExpoChannelIo.setAppearance("dark")}
          />
          <Button
            title="라이트 테마"
            onPress={() => ExpoChannelIo.setAppearance("light")}
          />

          <Button
            title="시스템 테마"
            onPress={() => ExpoChannelIo.setAppearance("system")}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
