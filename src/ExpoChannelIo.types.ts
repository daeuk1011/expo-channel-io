// 기본 타입들
export type Appearance = "light" | "dark" | "system";
export type Language = "ko" | "en" | "ja" | "device";
export type BootStatus =
  | "success"
  | "notInitialized"
  | "networkTimeout"
  | "notAvailableVersion"
  | "serviceUnderConstruction"
  | "requirePayment"
  | "accessDenied"
  | "unknown";

export type ButtonPosition = "left" | "right";
export type ButtonIcon =
  | "channel"
  | "chatbubblefilled"
  | "chatprogressfilled"
  | "chatquestionfilled"
  | "chatlightningfilled"
  | "chatbubblealtfilled"
  | "smsfilled"
  | "commentfilled"
  | "sendforwardfilled"
  | "helpfilled"
  | "chatprogress"
  | "chatquestion"
  | "chatbubblealt"
  | "sms"
  | "comment"
  | "sendforward"
  | "communication"
  | "headset";

// Profile 타입
export interface Profile {
  name?: string;
  email?: string;
  mobileNumber?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  [key: string]: string | number | boolean | null | undefined;
}

// 채널 버튼 옵션
export interface ChannelButtonOption {
  icon?: ButtonIcon;
  position?: ButtonPosition;
  xMargin?: number;
  yMargin?: number;
}

// Boot 설정
export interface BootConfig {
  pluginKey: string;
  memberId?: string;
  memberHash?: string;
  profile?: Profile;
  language?: Language;
  appearance?: Appearance;
  channelButtonOption?: ChannelButtonOption;
  hideChannelButtonOnBoot?: boolean;
  hidePopup?: boolean;
  trackDefaultEvent?: boolean;
  trackUtmSource?: boolean;
  unsubscribe?: boolean;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
  zIndex?: number;
}

// User 정보
export interface User {
  memberId: string;
  name?: string;
  avatarUrl?: string;
  unread: number;
  profile?: Profile;
  tags?: string[];
  language?: string;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
}

// Boot 결과
export interface BootResult {
  status: BootStatus;
  user: User | null;
}

// 태그 작업 결과
export interface TagOperationResult {
  user: User | null;
}

// 이벤트 프로퍼티
export interface EventProperty {
  [key: string]: string | number | boolean | null | undefined;
}

// 푸시 알림 결과 (향후 사용)
export interface PushNotificationResult {
  success: boolean;
}

// 이벤트 페이로드
export interface BadgeChangedEvent {
  unread: number;
  alert: number;
}

export interface ChatCreatedEvent {
  chatId: string;
}

export interface UrlClickedEvent {
  url: string;
}

export interface FollowUpProfile {
  name?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
}

// 이벤트 리스너 타입
export type BadgeChangedListener = (event: BadgeChangedEvent) => void;
export type ChatCreatedListener = (event: ChatCreatedEvent) => void;
export type FollowUpChangedListener = (profile: FollowUpProfile) => void;
export type UrlClickedListener = (event: UrlClickedEvent) => void;
export type PopupDataReceivedListener = () => void;
export type ShowMessengerListener = () => void;
export type HideMessengerListener = () => void;
