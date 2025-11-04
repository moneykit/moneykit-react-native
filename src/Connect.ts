import { NativeModules } from 'react-native';

const { Connect } = NativeModules;

if (!Connect) {
  throw new Error('MoneyKit Connect native module is not available. Make sure the library is linked correctly.');
}

export default Connect;

