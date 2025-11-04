# MoneyKit Connect React Native Example

This is an example app demonstrating how to use the MoneyKit Connect SDK in a bare React Native application.

## Prerequisites

- Node.js >= 18
- React Native development environment set up for iOS and/or Android
- For iOS: Xcode 14+ and CocoaPods
- For Android: Android Studio and JDK 17+

## Installation

1. Install dependencies:

```bash
npm install
```

2. **Generate iOS project** (first time only):

Since this is a bare React Native app within a monorepo, you need to initialize the iOS project:

```bash
# From the example directory
npx @react-native-community/cli init-platform ios
```

Or manually create the iOS project structure by copying from a fresh React Native init.

3. For iOS, install CocoaPods:

```bash
cd ios && pod install && cd ..
```

## Configuration

Update the `linkSessionToken` in `App.tsx` with your MoneyKit link session token:

```typescript
const config: ConnectConfiguration = {
  linkSessionToken: "your-link-session-token-here",
  // ... rest of the config
};
```

## Running the App

### iOS

```bash
npm run ios
```

Or open `ios/moneykitconnectreactnativeexample.xcworkspace` in Xcode and run from there.

### Android

```bash
npm run android
```

Or open the `android` folder in Android Studio and run from there.

## Features Demonstrated

- Presenting the MoneyKit Connect flow
- Handling successful connections
- Handling user exits and errors
- Event tracking
- Deep link handling for OAuth redirects

## Deep Linking Setup

To test OAuth redirects, configure deep linking in your app:

### iOS

Add to `ios/moneykitconnectreactnativeexample/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>moneykitexample</string>
    </array>
  </dict>
</array>
```

### Android

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="moneykitexample" />
</intent-filter>
```

## Troubleshooting

### Metro Bundler Issues

If you encounter issues with Metro bundler not finding modules, try:

```bash
npm start -- --reset-cache
```

### Build Issues

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Android:**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```
