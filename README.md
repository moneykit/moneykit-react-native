# Connect React Native

MoneyKit Connect is a quick and secure way to link bank accounts from within your app. The drop-in framework handles connecting to a financial institution in your app (credential validation, multi-factor authentication, error handling, etc.) without passing sensitive information to your server

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install @moneykit/connect-react-native
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.

### Configure for Android

No additional set up necessary.