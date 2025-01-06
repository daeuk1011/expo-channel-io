import { NativeModule, requireNativeModule } from 'expo';

import { ExpoChannelIoModuleEvents } from './ExpoChannelIo.types';

declare class ExpoChannelIoModule extends NativeModule<ExpoChannelIoModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoChannelIoModule>('ExpoChannelIo');
