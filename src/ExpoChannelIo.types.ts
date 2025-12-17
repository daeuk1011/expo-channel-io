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

// 버블 위치
export type BubblePosition = "top" | "bottom";

// 버블 옵션
export interface BubbleOption {
  position?: BubblePosition;
  yMargin?: number;
}

// 팝업 데이터
export interface PopupData {
  chatId?: string;
  avatarUrl?: string;
  name?: string;
  message?: string;
  timestamp?: number;
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
  bubbleOption?: BubbleOption;
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
  id?: string;
  memberId: string;
  name?: string;
  avatarUrl?: string;
  unread: number;
  alert: number;
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

// 사용자 업데이트 데이터 (updateUser용)
export interface UserData {
  language?: Language;
  tags?: string[];
  profile?: Profile;
  profileOnce?: Profile;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
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
export type PopupDataReceivedListener = (popupData: PopupData) => void;
export type ShowMessengerListener = () => void;
export type HideMessengerListener = () => void;
export type PushNotificationClickedListener = (chatId: string) => boolean;
