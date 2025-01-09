// Reexport the native module. On web, it will be resolved to ExpoChannelIoModule.web.ts
// and on native platforms to ExpoChannelIoModule.ts
export { default } from "./ExpoChannelIoModule";
export * from "./ExpoChannelIo.types";
