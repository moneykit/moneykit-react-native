import { EventEmitter, Subscription } from "expo-modules-core";

import Connect from "./Connect";
import { ConnectConfiguration } from "./Connect.types";

type EventName = "onSuccess" | "onExit" | "onEvent";

const addListenerWithCleanup = (
  emitter: EventEmitter,
  subscriptions: Record<EventName, Subscription[]>,
  eventName: EventName,
  listener: Function
) => {
  subscriptions[eventName].push(
    emitter.addListener(eventName, (...args: unknown[]) => {
      // Perform callback
      listener(...args);

      // Cleanup registered listeners on completion
      const isExitOrSuccessEvent = ["onExit", "onSuccess"].includes(eventName);
      if (isExitOrSuccessEvent) {
        unsubscribeAll(subscriptions, "onSuccess");
        unsubscribeAll(subscriptions, "onExit");
        unsubscribeAll(subscriptions, "onEvent");
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
  const subscriptions: Record<EventName, Subscription[]> = {
    onSuccess: [],
    onExit: [],
    onEvent: [],
  };

  addListenerWithCleanup(emitter, subscriptions, "onSuccess", onSuccess);
  addListenerWithCleanup(emitter, subscriptions, "onExit", onExit);
  if (onEvent)
    addListenerWithCleanup(emitter, subscriptions, "onEvent", onEvent);

  return await Connect.presentLinkFlow({ linkSessionToken });
}

export async function continueFlow(url: string) {
  return await Connect.continueFlow(url);
}

export { ConnectConfiguration } from "./Connect.types";

function unsubscribeAll(
  subscriptions: Record<EventName, Subscription[]>,
  eventName: EventName
) {
  subscriptions[eventName].forEach((subscription) => subscription.remove());
  subscriptions[eventName] = [];
}
