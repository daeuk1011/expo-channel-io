// Reexport the native module. On web, it will be resolved to ExpoChannelIoModule.web.ts
// and on native platforms to ExpoChannelIoModule.ts
export { default } from './ExpoChannelIoModule';
export { default as ExpoChannelIoView } from './ExpoChannelIoView';
export * from  './ExpoChannelIo.types';
