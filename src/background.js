import "webext-dynamic-content-scripts";
import addDomainPermissionToggle from "webext-domain-permission-toggle";
import { fetchSSE } from "./utils";
import domLoaded from "dom-loaded";
import elementReady from "element-ready";
import select from "select-dom";
import { observe } from "selector-observer";

addDomainPermissionToggle();

console.log("background.js loaded");

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "main-port");
  port.onMessage.addListener(async function (message) {
    const { key, value } = message;
    // refractor this to use a function
    if (key === "SCRAPED_ISSUE_TITLE") {
      await fetchSSE({
        body: value.text,
        onMessage: message => {
          if (message === "[DONE]") {
            return;
          }
          port.postMessage({
            key: "CHATGPT_OUTPUT",
            value: {
              text: message,
            },
          });
        },
      });
    }
  });
});
