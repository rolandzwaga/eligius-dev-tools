import type {
  IDiagnosticsAgent,
  TDevToolsEventSubscriber,
  TDevToolsMessage,
  TDiagnosticType,
  TWindowWithDevtools
} from "eligius";

function sendMessageFromAgentToDevtools(name: string, data: any = {}) {
  const message = {
    source: "eligius-inspect-agent",
    name: name,
    data: data ?? {}
  };
  window.postMessage(message, "*");
}

class Agent implements IDiagnosticsAgent {
  _handlers: Record<string, Function>;

  constructor() {
    console.info("agent created");

    this.initDevtoolsMessageListener();
    const self = this;
    this._handlers = {
      // Handshake broadcast when the dev tools are opened
      connect: function () {
        sendMessageFromAgentToDevtools("agent-connected");
      },
      event: function (message: TDevToolsMessage) {
        self.subscribers.forEach((x) => x(message.data));
      }
    };
  }

  subscribers: TDevToolsEventSubscriber[] = [];

  initDevtoolsMessageListener() {
    const self = this;
    window.addEventListener("message", function (event: MessageEvent<any>) {
      // Only accept messages from same frame
      if (event.source !== window) {
        return;
      }

      const message = event.data;

      // Only accept messages of correct format (our messages)
      if (message?.source !== "eligius-inspect-devtools") {
        return;
      }

      self.handleMessage(message);
    });
  }

  /**
   * Handle messages received from the devtools panel
   * @param {*} message
   *
   */
  handleMessage(message: TDevToolsMessage) {
    const handler = this._handlers[message.name];
    if (!handler) {
      console.warn(`No handler found for event ${message.name}`);
      return;
    }

    handler.call(this, message.data);
  }

  // Sends message from the webpage to the dev tools
  postMessage(name: TDiagnosticType, data: any) {
    sendMessageFromAgentToDevtools(name, data);
  }

  subscribe(subscriber: TDevToolsEventSubscriber): () => void {
    this.subscribers.push(subscriber);
    return () => {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }
}

let agent: Agent | undefined;

(window as unknown as TWindowWithDevtools)["__ELIGIUS_DEV_TOOLS__"] = {
  get agent() {
    if (!agent) {
      agent = new Agent();
    }
    return agent;
  }
};
