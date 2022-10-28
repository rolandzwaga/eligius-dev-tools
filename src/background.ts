export {};

const connections = {};

/*
 * agent -> content-script.js -> **background.js** -> dev tools
 */
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (sender.tab) {
    if (connections.hasOwnProperty(sender.tab.id)) {
      connections[sender.tab.id].postMessage(request);
    } /* else {
      console.warn(`Tab '${tabId}' not found in connection list.`);
    }*/
  } else {
    console.warn("sender.tab not defined.");
  }
  return true;
});

/*
 * agent <- content-script.js <- **background.js** <- dev tools
 */
chrome.runtime.onConnect.addListener(function (port) {
  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(function (request) {
    // Register initial connection
    if (request.name === "init") {
      connections[request.tabId] = port;

      port.onDisconnect.addListener(() => {
        delete connections[request.tabId];
      });

      return;
    }

    console.log("request", request);

    // Otherwise, broadcast to agent
    chrome.tabs.sendMessage(request.tabId, {
      name: request.name,
      data: request.data
    });
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, _tab) {
  if (connections.hasOwnProperty(tabId) && changeInfo.status === "complete") {
    // TODO: reload connection to page somehow...?
    connections[tabId].postMessage({
      name: "reloaded"
    });
  }
});
