import { CodedError } from 'expo-modules-core';

import { ConnectConfiguration } from "./Connect.types";

export default {
      async presentLinkFlow({
        onSuccess,
        onExit,
        onEvent,
        linkSessionToken,
      }: ConnectConfiguration) {
        throw new CodedError('UNAVAILABLE', 'Connect not available');
      },
      async continueFlow(url: string) {
        throw new CodedError('UNAVAILABLE', 'Connect not available');
      }
};
