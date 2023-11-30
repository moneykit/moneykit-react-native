import { EventEmitter, Subscription } from "expo-modules-core";

import Connect from "./Connect";
import { ConnectConfiguration } from "./Connect.types";

export { ConnectConfiguration } from "./Connect.types";

type EventName = "onSuccess" | "onExit" | "onEvent";

/**
 * Holds on to any existing event subscriptions even between link attempts so that
 * we may ensure they are cleaned up as needed, even in the unexpected case of
 * a missing exit signal from the native Connect module.
 *
 * Not ensuring this can lead to duplicate event processing or even Expo crashing
 * if it encounters an unexpected number of registered subscriptions in its own
 * cleanup functions.
 *
 * These subscriptions should all be `remove()`'d and the array itself emptied
 * prior to beginning any new link.
 */
let subscriptions: Subscription[] = [];

const addListenerWithCleanup = (
  emitter: EventEmitter,
  eventName: EventName,
  listener: Function
) => {
  subscriptions.push(
    emitter.addListener(eventName, (...args: unknown[]) => {
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
  const emitter = new EventEmitter(Connect);
  clearSubscriptions();

  addListenerWithCleanup(emitter, "onSuccess", onSuccess);
  addListenerWithCleanup(emitter, "onExit", onExit);
  if (onEvent) addListenerWithCleanup(emitter, "onEvent", onEvent);

  return await Connect.presentLinkFlow({ linkSessionToken });
}

export async function continueFlow(url: string) {
  return await Connect.continueFlow(url);
}

function clearSubscriptions() {
  subscriptions.forEach((subscription) => subscription.remove());
  subscriptions = [];
}
