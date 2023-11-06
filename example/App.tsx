import { StyleSheet, Text, View } from 'react-native';

import * as Connect from 'moneykit-connect-react-native-source';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{Connect.hello()}</Text>
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
});
