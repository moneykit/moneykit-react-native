import { EventEmitter } from "expo-modules-core";

import Connect from "./Connect";
import { ConnectConfiguration } from "./Connect.types";

const addListenerWithCleanup = (emitter: EventEmitter, eventName: string, listener: Function) => {
  const listenerSubscription = emitter.addListener(
    eventName,
    (args: unknown) => {
      listener(args);
      if (listenerSubscription) {

        console.log(`Count of onSuccess: `,emitter._eventEmitter.listenerCount("onSuccess"))
        console.log(`Count of onExit: `,emitter._eventEmitter.listenerCount("onExit"))
        console.log(`Count of onEvent: `,emitter._eventEmitter.listenerCount("onEvent"))

        if (eventName !== "onEvent") {
          emitter.removeAllListeners(eventName);
        }
  
        if (eventName === "onExit") {
          emitter.removeAllListeners("onSuccess");
        }

        if (["onExit", "onSuccess"].includes(eventName)) {
          emitter.removeAllListeners("onEvent");
        }
      }
    }
  );
};

export async function presentLinkFlow({
  onSuccess,
  onExit,
  onEvent,
  linkSessionToken,
}: ConnectConfiguration) {
  console.log("Present Link Flow")
  const emitter = new EventEmitter(Connect);

  addListenerWithCleanup(emitter, "onSuccess", onSuccess);
  addListenerWithCleanup(emitter, "onExit", onExit);

  if (onEvent) addListenerWithCleanup(emitter, "onEvent", onEvent);

  console.log(`Count of onSuccess: `,emitter._eventEmitter.listenerCount("onSuccess"))
  console.log(`Count of onExit: `,emitter._eventEmitter.listenerCount("onExit"))
  console.log(`Count of onEvent: `,emitter._eventEmitter.listenerCount("onEvent"))
  
  return await Connect.presentLinkFlow({ linkSessionToken });
}

export async function continueFlow(url: string) {
  return await Connect.continueFlow(url)
}

export { ConnectConfiguration } from "./Connect.types";
