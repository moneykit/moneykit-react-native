import {
  ConnectConfiguration,
  presentInstitutionSelectionFlow,
  continueFlow,
} from "@moneykit/connect-react-native";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import Button from "./Button";

const config: ConnectConfiguration = {
  linkSessionToken: "<replace-with-your-link-session-token>"
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

const presentConnectInstitutionSelectionFlow = () => {
  presentInstitutionSelectionFlow(config);
};

export default function App() {
  const url = Linking.useURL();

  if (url) {
    continueFlow(url);
  }

  return (
    <View style={styles.container}>
      <Button
        title="Connect a bank"
        onPress={presentConnectInstitutionSelectionFlow}
      />
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
