import devtoolsToAgentConnection from "./devtools-to-agent-connection";

export class AgentHandler {
  constructor(
    private callBack: (data: any) => void,
    private resetCallback: () => void
  ) {
    devtoolsToAgentConnection?.onMessage.addListener((msg) => {
      console.log("message", msg);
      this.handleMessage(msg);
    });
  }

  handlers = {
    connected: () => this.callBack("eligius devtool window connected"),
    eligiusEvent: (eventData: any) => this.callBack(eventData),
    resetData: () => this.resetCallback()
  };

  /**
   * Handle messages received from the webpage agent
   * @param message
   */
  private handleMessage(message: any) {
    console.log("message", message);

    if (message.name === "eligius-diagnostics-event") {
      this.handlers.eligiusEvent(message.data);
    } else if (message.name === "reloaded") {
      this.handlers.resetData();
    }
  }
}
