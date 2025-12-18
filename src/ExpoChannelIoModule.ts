import { NativeModule, requireNativeModule } from "expo";

import {
  Appearance,
  BootConfig,
  BootResult,
  EventProperty,
  Profile,
  User,
  UserData,
  PushNotificationResult,
  TagOperationResult,
} from "./ExpoChannelIo.types";

declare class ExpoChannelIoModule extends NativeModule {
  // 비동기 메서드들 (Promise 반환)
  boot(config: BootConfig): Promise<BootResult>;
  updateUser(userData: UserData): Promise<User | null>;
  addTags(tags: string[]): Promise<TagOperationResult>;
  removeTags(tags: string[]): Promise<TagOperationResult>;

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
  isChannelPushNotification(userInfo: Record<string, any>): Promise<boolean>;
  storePushNotification(userInfo: Record<string, any>): void;
  hasStoredPushNotification(): Promise<boolean>;
  openStoredPushNotification(): void;
  receivePushNotification(userInfo: Record<string, any>): Promise<PushNotificationResult>;

  // 상태 조회
  isBooted(): boolean;

  // 설정
  setDebugMode(enabled: boolean): void;
  setAppearance(appearance: Appearance): void;
  clearCallbacks(): void;
}

export default requireNativeModule<ExpoChannelIoModule>("ExpoChannelIo");
