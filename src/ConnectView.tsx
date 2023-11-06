import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ConnectViewProps } from './Connect.types';

const NativeView: React.ComponentType<ConnectViewProps> =
  requireNativeViewManager('Connect');

export default function ConnectView(props: ConnectViewProps) {
  return <NativeView {...props} />;
}
