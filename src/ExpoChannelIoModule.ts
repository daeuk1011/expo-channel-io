import { NativeModule, requireNativeModule } from "expo";

import {
  Appearance,
  BootConfig,
  BootResult,
  EventProperty,
  Profile,
  User,
  PushNotificationResult,
  TagOperationResult,
} from "./ExpoChannelIo.types";

declare class ExpoChannelIoModule extends NativeModule {
  // 비동기 메서드들 (Promise 반환)
  boot(config: BootConfig): Promise<BootResult>;
  updateUser(profile: Profile): Promise<{ success: boolean }>;
  addTags(tags: string[]): Promise<TagOperationResult>;
  removeTags(tags: string[]): Promise<TagOperationResult>;
  receivePushNotification(userInfo: Record<string, any>): Promise<PushNotificationResult>;

  // 동기 메서드들
  sleep(): void;
  shutdown(): void;
  showChannelButton(): void;
  hideChannelButton(): void;
  showMessenger(): void;
  hideMessenger(): void;
  openChat(chatId?: string | null, message?: string | null): void;
  openWorkflow(workflowId?: string | null): void;
  track(eventName: string, eventProperties?: EventProperty | null): void;
  setPage(page?: string | null, profile?: Profile | null): void;
  resetPage(): void;
  hidePopup(): void;

  // 푸시 알림 관련
  initPushToken(deviceToken: string): void;
  isChannelPushNotification(userInfo: Record<string, any>): boolean;
  storePushNotification(userInfo: Record<string, any>): void;
  hasStoredPushNotification(): boolean;
  openStoredPushNotification(): void;

  // 상태 조회
  isBooted(): boolean;
  getCurrentUser(): User | null;
  getBadgeCount(): number;
  getUnreadCount(): number;

  // 설정
  setDebugMode(enabled: boolean): void;
  setAppearance(appearance: Appearance): void;
  clearCallbacks(): void;
  getSDKVersion(): string;
}

export default requireNativeModule<ExpoChannelIoModule>("ExpoChannelIo");
