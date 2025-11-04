import { NativeEventEmitter, EmitterSubscription } from "react-native";

import Connect from "./Connect";
import { ConnectConfiguration } from "./Connect.types";

export type { ConnectConfiguration } from "./Connect.types";

type EventName = "onSuccess" | "onExit" | "onEvent";

/**
 * Holds on to any existing event subscriptions even between link attempts so that
 * we may ensure they are cleaned up as needed, even in the unexpected case of
 * a missing exit signal from the native Connect module.
 *
 * Not ensuring this can lead to duplicate event processing if it encounters an
 * unexpected number of registered subscriptions in its own cleanup functions.
 *
 * These subscriptions should all be `remove()`'d and the array itself emptied
 * prior to beginning any new link.
 */
let subscriptions: EmitterSubscription[] = [];

const connectEmitter = new NativeEventEmitter(Connect);

const addListenerWithCleanup = (
  eventName: EventName,
  listener: Function
) => {
  subscriptions.push(
    connectEmitter.addListener(eventName, (...args: unknown[]) => {
      // Perform callback
      listener(...args);

      // Cleanup registered listeners on completion
      const isExitOrSuccessEvent = ["onExit", "onSuccess"].includes(eventName);
      if (isExitOrSuccessEvent) {
        clearSubscriptions();
      }
    })
  );
};

export async function presentLinkFlow({
  onSuccess,
  onExit,
  onEvent,
  linkSessionToken,
}: ConnectConfiguration) {
  clearSubscriptions();

  addListenerWithCleanup("onSuccess", onSuccess);
  addListenerWithCleanup("onExit", onExit);
  if (onEvent) addListenerWithCleanup("onEvent", onEvent);

  return await Connect.presentLinkFlow({ linkSessionToken });
}

export async function continueFlow(url: string) {
  return await Connect.continueFlow(url);
}

function clearSubscriptions() {
  subscriptions.forEach((subscription) => subscription.remove());
  subscriptions = [];
}
