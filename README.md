# Connect React Native

MoneyKit Connect is a quick and secure way to link bank accounts from within your app. The drop-in framework handles connecting to a financial institution in your app (credential validation, multi-factor authentication, error handling, etc.) without passing sensitive information to your server

# Installation in Expo projects

> [!NOTE]
> Make sure you have the [expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/) plugin installed in your project.

```
npx expo install @moneykit/connect-react-native
```

You will also need to specify the deployment target for iOS in your `app.json` or `app.config.js` file:
```json
"plugins": [
  [
    "expo-build-properties",
    {
      "ios": {
        "deploymentTarget": "14.0"
      }
    }
  ]
]
```



> [!IMPORTANT]  
> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.dev/workflow/customizing/).

Rebuild your app as described in the ["Adding custom native code"](https://docs.expo.dev/workflow/customizing/) guide.

```
npx expo prebuild
```

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

### API Example

A simple example of the Connect SDK can be found [here](https://github.com/moneykit/moneykit-react-native/blob/main/example/App.tsx)
