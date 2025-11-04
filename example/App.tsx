import React, { useEffect, useState } from "react";
import {
  ConnectConfiguration,
  presentLinkFlow,
  continueFlow,
} from "@moneykit/connect-react-native";
import { StyleSheet, View, Linking } from "react-native";

import Button from "./Button";

const config: ConnectConfiguration = {
  linkSessionToken: "<replace-with-your-link-session-token>",
  onSuccess(payload) {
    console.log("Success payload: ", payload);
  },
  onExit(error) {
    error && console.log("Exit: ", error);
  },
  onEvent(event) {
    console.log("Event: ", event);
  },
};

const presentMoneyKit = () => {
  presentLinkFlow(config);
};

export default function App() {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  useEffect(() => {
    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        setInitialUrl(url);
        continueFlow(url);
      }
    });

    // Handle deep links while app is running
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (url) {
        continueFlow(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Connect a bank" onPress={presentMoneyKit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "normal",
    letterSpacing: 0.25,
    color: "black",
  },
});
