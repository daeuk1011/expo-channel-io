# Changelog

## [0.5.13](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.12...v0.5.13) (2025-12-19)


### Bug Fixes

* call showChannelButton in onResume regardless of boot status ([69fbae7](https://github.com/daeuk1011/expo-channel-io/commit/69fbae790a64499995f93ca4e09d36f5f5945a79))

## [0.5.12](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.11...v0.5.12) (2025-12-19)


### Bug Fixes

* call showChannelButton before Activity is shown ([554dfc5](https://github.com/daeuk1011/expo-channel-io/commit/554dfc5d8c7d6eb828a67b5a74639339b2ecad2c))

## [0.5.11](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.10...v0.5.11) (2025-12-19)


### Bug Fixes

* add boot completion callback for Android channel button visibility ([0ebe40b](https://github.com/daeuk1011/expo-channel-io/commit/0ebe40bd83dbcd3fab67967e0361b2d50404cfb2))

## [0.5.10](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.9...v0.5.10) (2025-12-19)


### Bug Fixes

* find and show channel button view directly in decorView ([2326491](https://github.com/daeuk1011/expo-channel-io/commit/232649187f3c082f74f539121bbcde4c650c6cdd))

## [0.5.9](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.8...v0.5.9) (2025-12-19)


### Bug Fixes

* call showChannelButton on UI thread after boot ([5634003](https://github.com/daeuk1011/expo-channel-io/commit/5634003b847e4e876963a26ab0c18aa1b3a5cf36))

## [0.5.8](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.7...v0.5.8) (2025-12-19)


### Bug Fixes

* use ReactActivityLifecycleListener to show channel button on resume ([9bd5fe2](https://github.com/daeuk1011/expo-channel-io/commit/9bd5fe2c1cc20d571c29839f25559ec672730f9a))

## [0.5.7](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.6...v0.5.7) (2025-12-19)


### Bug Fixes

* call showChannelButton before boot for immediate visibility ([33ba208](https://github.com/daeuk1011/expo-channel-io/commit/33ba2089f0b6251aaf361be1ba45465cd592d987))

## [0.5.6](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.5...v0.5.6) (2025-12-19)


### Bug Fixes

* force show channel button on main thread after boot success ([84a550b](https://github.com/daeuk1011/expo-channel-io/commit/84a550bac61ec57f4bed58f6e19e175cfec3ce16))

## [0.5.5](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.4...v0.5.5) (2025-12-19)


### Bug Fixes

* explicitly set attachView to true for Android channel button visibility ([cb66342](https://github.com/daeuk1011/expo-channel-io/commit/cb66342e176bfd9299dafece3fe868f1e0892cf6))

## [0.5.4](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.3...v0.5.4) (2025-12-18)


### Bug Fixes

* add context parameter to hasStoredPushNotification for SDK v13 ([abcfb3b](https://github.com/daeuk1011/expo-channel-io/commit/abcfb3b78f96c7d01649bda3b633e1bacc3dded7))

## [0.5.3](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.2...v0.5.3) (2025-12-18)


### Bug Fixes

* update Android module for SDK v13 compatibility ([fb22652](https://github.com/daeuk1011/expo-channel-io/commit/fb226528f555c58fc2c71c7ea1e9b48d8578a8e1))

## [0.5.2](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.1...v0.5.2) (2025-12-18)


### Bug Fixes

* remove getCurrentUser (not available in SDK v13) ([15e8567](https://github.com/daeuk1011/expo-channel-io/commit/15e8567775b3f8a5be60a685dd13a9da05c0016b))

## [0.5.1](https://github.com/daeuk1011/expo-channel-io/compare/v0.5.0...v0.5.1) (2025-12-18)


### Bug Fixes

* handle hideChannelButtonOnBoot for iOS/Android SDK v13 ([19e36a6](https://github.com/daeuk1011/expo-channel-io/commit/19e36a67c253cb972d9fd59a9ce6ce38929590ad))

## [0.5.0](https://github.com/daeuk1011/expo-channel-io/compare/v0.4.0...v0.5.0) (2025-12-18)


### Features

* update example app with all SDK features ([09127ff](https://github.com/daeuk1011/expo-channel-io/commit/09127ff5e48606d5a7fa33a1899beff30da7c379))


### Bug Fixes

* combine release-please and npm publish into single workflow ([a984fa0](https://github.com/daeuk1011/expo-channel-io/commit/a984fa0deeb7c24fb59638f7faaa698c23560315))

## [0.4.0](https://github.com/daeuk1011/expo-channel-io/compare/v0.3.1...v0.4.0) (2025-12-18)


### Features

* add release-please for automated changelog and versioning ([5c9df2e](https://github.com/daeuk1011/expo-channel-io/commit/5c9df2e71d0992a1fec648f99e6d974f2ec3dd46))


### Bug Fixes

* resolve TypeScript errors in web module ([ab45ff3](https://github.com/daeuk1011/expo-channel-io/commit/ab45ff3d68f46a348881482c27feb330365acf27))
