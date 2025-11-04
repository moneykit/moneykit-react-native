import { ConnectConfiguration } from "./Connect.types";

export default {
    async presentInstitutionSelectionFlow({
        onSuccess,
        onExit,
        onEvent,
        linkSessionToken,
      }: ConnectConfiguration) {
        throw new Error('MoneyKit Connect is not available on web platform');
      },
      async presentLinkFlow({
        onSuccess,
        onExit,
        onEvent,
        linkSessionToken,
      }: ConnectConfiguration) {
        throw new Error('MoneyKit Connect is not available on web platform');
      },
      async continueFlow(url: string) {
        throw new Error('MoneyKit Connect is not available on web platform');
      }
};
