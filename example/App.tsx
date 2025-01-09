import ExpoChannelIo from "expo-channel-io";
import { useEffect } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

ExpoChannelIo.loadScript()

export default function App() {
  useEffect(() => {
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
      // language: "korean",
    })
    // }).then(() => ExpoChannelIo.showChannelButton());
  }, []);

  // if (Object.keys(user).length > 0 && Object.keys(channelTalkUser).length > 0 && channleBtnHeight) {
  //   let settings = {
  //     pluginKey: CHANNELTALK_PLUGINKEY,
  //     memberId: channelTalkUser?.ci,
  //     profile: {
  //       name: user?.name,
  //       nickname: user?.nickname ?? '',
  //       email: user?.email,
  //       mobileNumber: user?.phone,
  //       회원상태: u.code.statusToUIText(user?.status),
  //       tier: channelTalkUser?.tier,
  //       provider: u.code.providerToUIText(user?.provider),
  //       birth: helper.dateFormat(user?.birth, 'YYYY.MM.DD'),
  //       sex: user?.sex,
  //       bankAccount:
  //         `[${u.code.codeToBank(channelTalkUser?.bank?.bankCode) ?? ''}] ${
  //           channelTalkUser?.bank?.accountNumber ?? ''
  //         }` ?? '',
  //       deletedAt: `${
  //         channelTalkUser?.status === 'deleted' ? new Date(channelTalkUser?.updatedAt).toLocaleString() : ''
  //       }`,
  //       deletedReason: channelTalkUser?.deleteReason,
  //       CumulativeLoginCount: channelTalkUser?.loginCount ?? 0,
  //       CumulativeCampaignHistoryCount: channelTalkUser?.campaignHistoryCount,
  //       CumulativeRefererList: channelTalkUser?.refererCount ?? 0,
  //       CumulativePenaltyCount: channelTalkUser?.penaltyCount ?? 0,
  //       tierLoginCount: channelTalkUser?.monthlyAttendanceDays ?? 0,
  //       tierCampainCount: channelTalkUser?.monthlyCampaignParticipations ?? 0,
  //       tierInviteCount: channelTalkUser?.monthlyFriendInvitations ?? 0,
  //       tierPenaltyCount: channelTalkUser?.monthlyPenalties ?? 0,
  //       campaignHistoryCount: channelTalkUser?.campaignHistoryCount ?? 0,
  //       campaignInProgressCount: channelTalkUser?.campaignInProgressCount ?? 0,
  //       point: channelTalkUser?.point,
  //       cashbackFromReward: channelTalkUser?.cashbackFromReward ?? 0,
  //       cashbackFromPoint: channelTalkUser?.cashbackFromPoint ?? 0,
  //       penalty: channelTalkUser?.penalty ?? 0,
  //       adminMemo: user?.adminMemo,
  //     },
  //     language: 'ko',
  //     channelButtonOption: {
  //       xMargin: 16,
  //       yMargin: channleBtnHeight + 16,
  //       position: 'right',
  //     },
  //   };

  //   if (!bootVisible && !modalVisible) {
  //     // 부팅 최초 1회
  //     ChannelIO.boot(settings).then(result => {
  //       ChannelIO.showChannelButton();
  //       setBootVisible(true); // 부팅됨
  //     });
  //   }
  // }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>

        <Group name="Hello">
          <Text>테스트</Text>
          <Button title="xptmx" onPress={() => ExpoChannelIo.showMessenger()} />
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
