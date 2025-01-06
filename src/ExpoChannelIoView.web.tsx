import * as React from 'react';

import { ExpoChannelIoViewProps } from './ExpoChannelIo.types';

export default function ExpoChannelIoView(props: ExpoChannelIoViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
