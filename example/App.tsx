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
  linkSessionToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6ImY2MklzemFxZzJ5MTlWUnltRXV2REhMMlNWZk9CcHlJYnpka1NfSmhnbU0iLCJlbnYiOiJzYW5kYm94IiwibW9kZSI6InNhbmRib3giLCJsaW5rX2lkIjpudWxsLCJpbnN0aXR1dGlvbl9pZCI6bnVsbCwiaW5zdGl0dXRpb25fY29sb3IiOm51bGwsImluc3RpdHV0aW9uX25hbWUiOm51bGwsImluc3RpdHV0aW9uX2F2YXRhciI6bnVsbCwiYXBwX25hbWUiOiJNb25leUtpdCBQbGF5Z3JvdW5kIFdlYiIsInJlZGlyZWN0X3VyaSI6Imh0dHBzOi8vZGVtby5tb25leWtpdC5jb20vcmVkaXJlY3QiLCJjb25uZWN0X3RoZW1lX2xldmVsIjoiZnVsbF9jdXN0b20ifQ.eyJzdWIiOiJzYW5kYm94XzM4MGRlYzBiLWE3YzEtNGE1NC1iNTQ3LWZlNDE4YWE3Yzc1NSIsImF1ZCI6WyJodHRwczovL2FwaS5tb25leWtpdC5jb20vbGluay1zZXNzaW9uIl0sImN1c3RvbWVyX2FwcF9pZCI6ImFwcF9KYUtOek1yYlpwZTRKc0M5OHFCQTlBIiwiaXNzIjoiaHR0cHM6Ly9hcGkubW9uZXlraXQuY29tIiwiZXhwIjoxNzAwNjU5NzczLCJpYXQiOjE3MDA2NTc5NzN9.qjiraO2Zeb9uDjaOMf0Xuv8VNi6zCUUJn9oYId-Lxg0",
  onSuccess(payload) {
    console.log("Success payload: ", payload);
  },
  onExit(error) {
    error && console.log("Error: ", error);
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
