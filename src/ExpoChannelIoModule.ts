import { NativeModule, requireNativeModule } from "expo";

import { BootConfig, BootStatus } from "./ExpoChannelIo.types";

declare class ExpoChannelIoModule extends NativeModule {
  boot(setting: BootConfig): Promise<BootStatus>;
  showChannelButton(): Promise<void>;
  hideChannelButton(): Promise<void>;
  showMessenger(): Promise<void>;
  hideMessenger(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoChannelIoModule>("ExpoChannelIo");
