# Connect React Native

MoneyKit Connect is a quick and secure way to link bank accounts from within your app. The drop-in framework handles connecting to a financial institution in your app (credential validation, multi-factor authentication, error handling, etc.) without passing sensitive information to your server.

## Installation

### Prerequisites

- React Native 0.60 or higher
- iOS deployment target: 14.0 or higher
- Android minSdkVersion: 23 or higher

### Add the package

```bash
npm install @moneykit/connect-react-native
```

Or using yarn:

```bash
yarn add @moneykit/connect-react-native
```

### iOS Setup

1. Install pods:

```bash
cd ios && pod install && cd ..
```

2. Ensure your iOS deployment target is set to 14.0 or higher in `ios/Podfile`:

```ruby
platform :ios, '14.0'
```

### Android Setup

1. Ensure your `android/build.gradle` has minimum SDK version 23:

```gradle
buildscript {
  ext {
    minSdkVersion = 23
    targetSdkVersion = 35
    compileSdkVersion = 35
  }
}
```

2. **For React Native < 0.60:** Manually link the package by adding to `android/app/src/main/java/[...]/MainApplication.java`:

```java
import expo.modules.moneykitconnectreactnative.ConnectPackage;

// In the getPackages() method:
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new ConnectPackage()  // Add this line
  );
}
```

**Note:** For React Native 0.60+, the package is auto-linked and no manual linking is required.

## Usage

### Basic Example

```typescript
import {
  ConnectConfiguration,
  presentLinkFlow,
  continueFlow,
} from "@moneykit/connect-react-native";
import { Linking } from "react-native";

const config: ConnectConfiguration = {
  linkSessionToken: "your-link-session-token",
  onSuccess(payload) {
    console.log("Success:", payload);
    // Handle successful connection
  },
  onExit(error) {
    if (error) {
      console.log("Exit with error:", error);
    } else {
      console.log("User exited");
    }
  },
  onEvent(event) {
    console.log("Event:", event);
  },
};

// Present the MoneyKit Connect flow
presentLinkFlow(config);

// Handle OAuth redirects (if needed)
const handleDeepLink = ({ url }) => {
  if (url) {
    continueFlow(url);
  }
};

// Add deep link listener
Linking.addEventListener("url", handleDeepLink);
```

### Deep Linking Setup

To support OAuth redirects, you need to configure deep linking in your app:

**iOS (`ios/[YourApp]/Info.plist`):**

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>your-app-scheme</string>
    </array>
  </dict>
</array>
```

**Android (`android/app/src/main/AndroidManifest.xml`):**

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="your-app-scheme" />
</intent-filter>
```

## API Reference

### `presentLinkFlow(config: ConnectConfiguration)`

Opens the MoneyKit Connect flow.

**Parameters:**
- `linkSessionToken` (string): The session token obtained from your server
- `onSuccess` (function): Called when connection succeeds
- `onExit` (function): Called when user exits or an error occurs
- `onEvent` (function, optional): Called for tracking events

### `continueFlow(url: string)`

Continues the OAuth flow after a redirect.

**Parameters:**
- `url` (string): The deep link URL to continue from

## Example

A complete example app can be found in the [example](https://github.com/moneykit/moneykit-react-native/tree/main/example) directory.

## Troubleshooting

### iOS

- Make sure your deployment target is iOS 14.0+
- Run `pod install` after installation
- Clean build folder: `Cmd + Shift + K` in Xcode

### Android

- Ensure minSdkVersion is 23 or higher
- Clean and rebuild: `cd android && ./gradlew clean && cd ..`

## Support

For issues or questions, please visit our [GitHub Issues](https://github.com/moneykit/moneykit-react-native/issues).
