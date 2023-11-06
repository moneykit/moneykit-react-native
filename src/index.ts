import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

import Connect from './Connect';

export type Configuration = {
  linkSessionToken: string;
};

export async function presentInstitutionSelectionFlow(value: Configuration) {
  return await Connect.presentInstitutionSelectionFlow(value);
}

export async function presentLinkFlow(value: Configuration) {
  return await Connect.presentLinkFlow(value);
}
