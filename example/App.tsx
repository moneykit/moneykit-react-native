import { StyleSheet, Text, View } from 'react-native';

import * as Connect from 'moneykit-connect-react-native-source';
import Button from './Button';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Connect a bank"
        onPress={() => {
          Connect.presentInstitutionSelectionFlow({
            "linkSessionToken": ""
          })
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: 'black',
  },
});
