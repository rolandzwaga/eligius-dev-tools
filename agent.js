"use strict";

function sendMessageFromAgentToDevtools(name, data = {}) {
    const message = {
        source: "eligius-inspect-agent",
        name: name,
        data: data ?? {}
    };
    window.postMessage(message, "*");
}
class Agent {
    _handlers;
    constructor() {
        console.info("agent created");
        this.initDevtoolsMessageListener();
        const self = this;
        this._handlers = {
            // Handshake broadcast when the dev tools are opened
            connect: function () {
                sendMessageFromAgentToDevtools("agent-connected");
            },
            event: function (message) {
                self.subscribers.forEach((x) => x(message.data));
            }
        };
    }
    subscribers = [];
    initDevtoolsMessageListener() {
        const self = this;
        window.addEventListener("message", function (event) {
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
    handleMessage(message) {
        const handler = this._handlers[message.name];
        if (!handler) {
            console.warn(`No handler found for event ${message.name}`);
            return;
        }
        handler.call(this, message.data);
    }
    // Sends message from the webpage to the dev tools
    postMessage(name, data) {
        sendMessageFromAgentToDevtools(name, data);
    }
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
        return () => {
            const index = this.subscribers.indexOf(subscriber);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
}
let agent;
window["__ELIGIUS_DEV_TOOLS__"] = {
    get agent() {
        if (!agent) {
            agent = new Agent();
        }
        return agent;
    }
};
