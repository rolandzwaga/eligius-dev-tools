import type { PlasmoContentScript } from "plasmo";

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true
};

/*
 * agent -> **content-script.js** -> background.js -> dev tools
 */
window.addEventListener("message", (event) => {
  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  const message = event.data;

  // Only accept messages of correct format (our messages)
  if (message?.source !== "eligius-inspect-agent") {
    return;
  }

  console.log("message", message);

  chrome.runtime.sendMessage(message);
});

/*
 * agent <- **content-script.js** <- background.js <- dev tools
 */
chrome.runtime.onMessage.addListener(function (message) {
  message.source = "eligius-inspect-devtools";
  window.postMessage(message, "*");
});

var s = document.createElement("script");
s.src = chrome.runtime.getURL("agent.js");
s.onload = function (this: HTMLScriptElement) {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
