import {
  ConnectConfiguration,
  presentInstitutionSelectionFlow,
  continueFlow,
} from "moneykit-connect-react-native";
import { StyleSheet, View } from "react-native";

import * as Linking from 'expo-linking';

import Button from "./Button";
import { useEffect } from 'react';

const config: ConnectConfiguration = {
  linkSessionToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IlB3Y2VfUGFfUV9jSWhkLTFWWlNGMjlzS3E4aWNfQmJYZTJJcG93Q3JaUDQiLCJlbnYiOiJwcm9kdWN0aW9uIiwibW9kZSI6ImxpdmUiLCJsaW5rX2lkIjpudWxsLCJpbnN0aXR1dGlvbl9pZCI6bnVsbCwiaW5zdGl0dXRpb25fY29sb3IiOm51bGwsImluc3RpdHV0aW9uX25hbWUiOm51bGwsImluc3RpdHV0aW9uX2F2YXRhciI6bnVsbCwiYXBwX25hbWUiOiJpT1MgTW9uZXlMaW5rIEV4YW1wbGUiLCJyZWRpcmVjdF91cmkiOiJtb25leWtpdGV4YW1wbGU6Ly9vYXV0aCIsImNvbm5lY3RfdGhlbWVfbGV2ZWwiOiJmdWxsX2N1c3RvbSJ9.eyJzdWIiOiJsaXZlXzcxMmM2YzM3LWI2NGQtNGRiYS04ZmY4LThjNTE4MTVlZGRiZSIsImF1ZCI6WyJodHRwczovL2FwaS5zdGFnZS51ZTIubW9uZXlraXQuY29tL2xpbmstc2Vzc2lvbiJdLCJjb25uZWN0X2ZlYXR1cmVzIjp7Imlzc3VlX3JlcG9ydGVyIjp0cnVlLCJlbmFibGVfbW9uZXlfaWQiOnRydWUsImJ1Z19yZXBvcnRlciI6dHJ1ZX0sImN1c3RvbWVyX2FwcF9pZCI6ImU3YTJkNzQ2LWNjMjktNGRhMy05MWE3LTNhMjVmOWVjMzE4MyIsIm1vbmV5bGlua19mZWF0dXJlcyI6eyJpc3N1ZV9yZXBvcnRlciI6dHJ1ZSwiZW5hYmxlX21vbmV5X2lkIjp0cnVlLCJidWdfcmVwb3J0ZXIiOnRydWV9LCJpc3MiOiJodHRwczovL2FwaS5zdGFnZS51ZTIubW9uZXlraXQuY29tIiwiZXhwIjoxNzAwNTYwMDk5LCJpYXQiOjE3MDA1NTgyOTl9.hLXpl_zQDuoGcwmvXsT8Fj6E0fNQfmlmDR_dvpj4gCw",
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
    continueFlow(url)
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
