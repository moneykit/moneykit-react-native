import {
  ConnectConfiguration,
  presentInstitutionSelectionFlow,
} from "moneykit-connect-react-native-source";
import { StyleSheet, View } from "react-native";

import Button from "./Button";

const config: ConnectConfiguration = {
  linkSessionToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IlB3Y2VfUGFfUV9jSWhkLTFWWlNGMjlzS3E4aWNfQmJYZTJJcG93Q3JaUDQiLCJlbnYiOiJzYW5kYm94IiwibW9kZSI6InNhbmRib3giLCJsaW5rX2lkIjpudWxsLCJpbnN0aXR1dGlvbl9pZCI6bnVsbCwiaW5zdGl0dXRpb25fY29sb3IiOm51bGwsImluc3RpdHV0aW9uX25hbWUiOm51bGwsImluc3RpdHV0aW9uX2F2YXRhciI6bnVsbCwiYXBwX25hbWUiOiJNb25leUtpdCBXZWIgRGVtbyIsInJlZGlyZWN0X3VyaSI6Imh0dHBzOi8vZGVtby5zdGFnZS51ZTIubW9uZXlraXQuY29tL3JlZGlyZWN0In0.eyJzdWIiOiJzYW5kYm94XzFhMTQxNWM0LTg3NDItNDM0Zi1hOWVlLTA3YTRhNWExOTk4NyIsImF1ZCI6WyJodHRwczovL2FwaS5zdGFnZS51ZTIubW9uZXlraXQuY29tL2xpbmstc2Vzc2lvbiJdLCJjdXN0b21lcl9hcHBfaWQiOiIxM2Q1ZmNiZS03NGI3LTQ4OTktYThjMi1mYmZkYTJkMjk4OGMiLCJpc3MiOiJodHRwczovL2FwaS5zdGFnZS51ZTIubW9uZXlraXQuY29tIiwiZXhwIjoxNjk5Mzc3NzQxLCJpYXQiOjE2OTkzNzU5NDF9.iwAdKRkddHWWgizWzF5ZSLrNFHBQX7ke5YzseeLb_3s",
  onSuccess(payload) {
    console.log("Success payload: ", payload);
  },
  onExit() {
    console.log("Exited");
  },
};

const presentConnectInstitutionSelectionFlow = () => {
  presentInstitutionSelectionFlow(config);
};

export default function App() {
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
