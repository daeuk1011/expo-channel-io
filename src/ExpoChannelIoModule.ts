import { NativeModule, requireNativeModule } from "expo";

import {
  Appearance,
  BootConfig,
  BootStatus,
  EventProperty,
  Profile,
} from "./ExpoChannelIo.types";

declare class ExpoChannelIoModule extends NativeModule {
  boot(setting: BootConfig): Promise<BootStatus>;
  sleep(): void;
  shutdown(): void;
  showChannelButton(): void;
  hideChannelButton(): void;
  showMessenger(): void;
  hideMessenger(): void;
  openChat(chatId?: string | number, message?: string): void;
  openWorkflow(workflowId?: string): void;
  track(eventName: string, eventProperty?: EventProperty): void;
  setPage(page?: string, profile?: Profile): void;
  resetPage(): void;
  hidePopup(): void;
  updateUser(): void;
  addTags(tags: string[]): void;
  removeTags(tags: string[]): void;
  isBooted(): boolean;
  setDebugMode(isDebugMode: boolean): void;
  setAppearance(appearance: Appearance): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoChannelIoModule>("ExpoChannelIo");
