# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

expo-channel-io is an Expo native module that integrates Channel.io's customer messaging platform into React Native applications. It supports iOS (Swift), Android (Kotlin), and Web platforms.

## Build & Development Commands

```bash
# Main module
npm run build          # Build TypeScript to JavaScript
npm run lint           # Run ESLint
npm run test           # Run tests
npm run clean          # Clean build artifacts
npm run open:ios       # Open iOS project in Xcode
npm run open:android   # Open Android project in Android Studio

# Example app (run from example/ directory)
cd example
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run web            # Run on Web
```

## Architecture

### Source Structure

- `src/` - TypeScript source (module interface and web implementation)
- `ios/` - Swift native code using ExpoModulesCore
- `android/` - Kotlin native code using Expo Modules API
- `example/` - Example Expo app for testing
- `build/` - Compiled JavaScript output

### Native Module Pattern

The module uses Expo Modules architecture:
- **iOS**: `ExpoChannelIoModule.swift` implements methods via `Function()` and `AsyncFunction()` macros, with `ExpoChannelIoDelegate.swift` handling app delegate events
- **Android**: `ExpoChannelIoModule.kt` uses Expo's Kotlin DSL (`ModuleDefinition`), with separate lifecycle listeners (`ExpoChannelIoApplicationLifecycleListener.kt`, `ExpoChannelIoReactActivityLifecycleListener.kt`)
- **Web**: `ExpoChannelIoModule.web.ts` dynamically loads Channel.io's web SDK

### Android Button Visibility

Android has special handling for Channel.io button visibility through `ChannelButtonState` singleton. The SDK's `showChannelButton()` only affects Activities shown AFTER the call, so `showChannelButton()` is called in `Application.onCreate()` before any Activity is shown.

### Event System

Both platforms implement Channel.io's listener pattern and emit events to JS:
- `onBadgeChanged`, `onChatCreated`, `onFollowUpChanged`, `onUrlClicked`, `onPopupDataReceived`, `onShowMessenger`, `onHideMessenger`

## CI/CD

Uses Release Please for automated versioning. Push to master with conventional commits triggers:
1. Release Please creates PR with version bump
2. Merging PR publishes to npm via GitHub Actions
