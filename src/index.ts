import { EventEmitter } from "expo-modules-core";

import Connect from "./Connect";
import { ConnectConfiguration } from "./Connect.types";

const emitter = new EventEmitter(Connect);

const addListenerWithCleanup = (eventName: string, listener: Function) => {
  const listenerSubscription = emitter.addListener(
    eventName,
    (args: unknown) => {
      listener(args);
      if (listenerSubscription) {
        listenerSubscription.remove();
        if (eventName === "onExit") {
          emitter.removeAllListeners("onSuccess");
        }
      }
    }
  );
};

export async function presentInstitutionSelectionFlow({
  onSuccess,
  onExit,
  onEvent,
  linkSessionToken,
}: ConnectConfiguration) {
  addListenerWithCleanup("onSuccess", onSuccess);
  addListenerWithCleanup("onExit", onExit);
  if (onEvent) addListenerWithCleanup("onEvent", onEvent);

  return await Connect.presentInstitutionSelectionFlow({ linkSessionToken });
}

export async function presentLinkFlow({
  onSuccess,
  onExit,
  onEvent,
  linkSessionToken,
}: ConnectConfiguration) {
  addListenerWithCleanup("onSuccess", onSuccess);
  addListenerWithCleanup("onExit", onExit);
  if (onEvent) addListenerWithCleanup("onEvent", onEvent);

  return await Connect.presentLinkFlow({ linkSessionToken });
}

export { ConnectConfiguration } from "./Connect.types";
