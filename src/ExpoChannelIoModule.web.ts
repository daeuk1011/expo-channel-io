import { registerWebModule, NativeModule } from 'expo';

import { ExpoChannelIoModuleEvents } from './ExpoChannelIo.types';

class ExpoChannelIoModule extends NativeModule<ExpoChannelIoModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoChannelIoModule);
