const innerConnection = chrome.runtime?.connect({
  name: "panel"
});

innerConnection?.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId
});

const devtoolsToAgentConnection = {
  postMessage: (message: any) => {
    innerConnection?.postMessage({
      ...message,
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  onMessage: innerConnection.onMessage
};

export default devtoolsToAgentConnection;
