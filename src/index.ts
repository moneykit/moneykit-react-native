import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Connect.web.ts
// and on native platforms to Connect.ts
import ConnectModule from './ConnectModule';
import ConnectView from './ConnectView';
import { ChangeEventPayload, ConnectViewProps } from './Connect.types';

// Get the native constant value.
export const PI = ConnectModule.PI;

export function hello(): string {
  return ConnectModule.hello();
}

export async function setValueAsync(value: string) {
  return await ConnectModule.setValueAsync(value);
}

const emitter = new EventEmitter(ConnectModule ?? NativeModulesProxy.Connect);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ConnectView, ConnectViewProps, ChangeEventPayload };
