# Migration Guide: Expo to Bare React Native

This document outlines the changes made to convert the MoneyKit React Native SDK from Expo Modules to bare React Native.

## Overview

The SDK has been completely refactored to remove the Expo dependency, making it compatible with any bare React Native application (0.60+).

## Breaking Changes

### For Library Maintainers

**Version Recommendation:** Bump to 3.0.0 due to breaking changes.

### For Existing Users (Migrating from 2.x)

If you were using this library in an Expo app, you have two options:

1. **Option A: Install Expo modules** in your app (if you're using Expo):
   - The new version works with Expo apps that have `expo` installed
   - Expo's autolinking will handle the native modules

2. **Option B: Use bare React Native** (if you ejected or are using bare RN):
   - No changes needed - the library now works natively!

### API Changes

✅ **No JavaScript API changes** - all public APIs remain the same:
- `presentLinkFlow(config)`
- `continueFlow(url)`
- `ConnectConfiguration` type

The only change is the internal implementation - users don't need to modify their code!

## What Changed

### JavaScript Layer
- Replaced `expo-modules-core` with React Native's `NativeModules` and `NativeEventEmitter`
- No public API changes

### iOS Native Layer
- Converted from Expo Module DSL to `RCTEventEmitter`
- Added Objective-C bridge file (`Connect.m`)
- Updated podspec: `ExpoModulesCore` → `React-Core`
- All MoneyKit SDK functionality preserved

### Android Native Layer
- Converted from Expo Module to `ReactContextBaseJavaModule`
- Added `ConnectPackage.kt` for React Native registration
- Updated build.gradle for standard React Native setup
- All MoneyKit SDK functionality preserved

### Build System
- Removed `expo-module-scripts` from package.json
- Standard TypeScript compilation with `tsc`
- Removed `expo-module.config.json`

## Installation Changes

### Before (v2.x with Expo)
```bash
npx expo install @moneykit/connect-react-native
```

### After (v3.x bare React Native)
```bash
npm install @moneykit/connect-react-native

# iOS
cd ios && pod install && cd ..

# Android - auto-linked (RN 0.60+)
```

## Testing the Migration

### For Library Development

1. **Build the library:**
   ```bash
   npm run build
   ```

2. **Test in example app:**
   ```bash
   cd example
   npm install

   # Android
   npm run android

   # iOS (after generating iOS project)
   npx @react-native-community/cli init-platform ios
   cd ios && pod install && cd ..
   npm run ios
   ```

## Example App Changes

The example app has been converted from Expo to bare React Native:

- Removed all Expo dependencies
- Updated to use React Native's `Linking` API
- Standard React Native project structure
- Works with standard React Native CLI commands

## Native Module Setup

### iOS
The module is now auto-discoverable through CocoaPods:
```ruby
# In your app's Podfile, this happens automatically via autolinking
pod 'Connect', :path => '../node_modules/@moneykit/connect-react-native'
```

### Android
The module is auto-discoverable through React Native autolinking (0.60+).

For React Native < 0.60, manual linking is required:
```java
import expo.modules.moneykitconnectreactnative.ConnectPackage;

// In MainApplication.java
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new ConnectPackage()
  );
}
```

## Verification Checklist

- [x] JavaScript API unchanged
- [x] iOS native implementation working
- [x] Android native implementation working
- [x] TypeScript types working
- [x] Build system working
- [x] Example app converted
- [x] Documentation updated
- [ ] iOS example project generated and tested
- [ ] Android example tested
- [ ] Published to npm

## Support

For issues or questions:
- GitHub Issues: https://github.com/moneykit/moneykit-react-native/issues
- MoneyKit Docs: https://docs.moneykit.com
