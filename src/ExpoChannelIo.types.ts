export type Language = "en" | "ko" | "ja" | "device";

export type ChannelButtonIcon =
  | "channel"
  | "chatBubbleFilled"
  | "chatProgressFilled"
  | "chatQuestionFilled"
  | "chatLightningFilled"
  | "chatBubbleAltFilled"
  | "smsFilled"
  | "commentFilled"
  | "sendForwardFilled"
  | "helpFilled"
  | "chatProgress"
  | "chatQuestion"
  | "chatBubbleAlt"
  | "sms"
  | "comment"
  | "sendForward"
  | "communication"
  | "headset";

export type BootStatus =
  | "success"
  | "notInitialized"
  | "networkTimeout"
  | "notAvailableVersion"
  | "serviceUnderConstruction"
  | "requirePayment"
  | "accessDenied"
  | "unknown";

export interface ChannelButtonOption {
  icon: ChannelButtonIcon;
  position: "left" | "right";
  xMargin: number;
  yMargin: number;
}

export interface BubbleOption {
  position: "top" | "bottom";
  yMargin: number;
}

export interface Appearance {
  theme: "light" | "dark" | "system";
}

export interface Profile {
  name?: string;
  email?: string;
  mobileNumber?: string;
  avatarUrl?: string;
  [key: string]: any;
}

export interface BootConfig {
  pluginKey: string; // 채널의 플러그인 키
  memberId?: string; // 멤버 유저를 구분하는 id
  memberHash?: string; // memberId의 해시화 된 값
  profile?: Profile; // 유저의 프로필 값
  language?: Language; // 유저가 사용할 언어
  hidePopup?: boolean; // 기본 마케팅 메시지 및 팝업 숨김 여부
  unsubscribeEmail?: boolean; // 이메일 마케팅 메시지 수신 여부
  unsubscribeTexting?: boolean; // 문자 마케팅 메시지 수신 여부
  trackDefaultEvent?: boolean; // 기본 이벤트 전송 여부
  channelButtonOption?: ChannelButtonOption; // 채널 버튼 설정
  bubbleOption?: BubbleOption; // 마케팅 버블 설정
  appearance?: Appearance; // SDK 화면 테마 설정
}
