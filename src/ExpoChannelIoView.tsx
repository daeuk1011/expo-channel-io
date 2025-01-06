import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoChannelIoViewProps } from './ExpoChannelIo.types';

const NativeView: React.ComponentType<ExpoChannelIoViewProps> =
  requireNativeView('ExpoChannelIo');

export default function ExpoChannelIoView(props: ExpoChannelIoViewProps) {
  return <NativeView {...props} />;
}
