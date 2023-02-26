import React from "dom-chef";
import domLoaded from "dom-loaded";
import elementReady from "element-ready";
import { observe } from "selector-observer";
import select from "select-dom";
const port = chrome.runtime.connect({ name: "main-port" });

const init = async () => {
  await domLoaded;
  const titleElement = select(".gh-header-title");
  const textContent = titleElement.textContent;
  port.postMessage({
    key: "SCRAPED_ISSUE_TITLE",
    value: {
      text: textContent,
    },
  });
  await elementReady(".edit-comment-hide");
  // const content = (
  //   <em>
  //     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
  //     diam nonumy eirmod tempor invidunt ut labore et dolore magna
  //     aliquyam erat, sed diam voluptua. At vero eos et accusam et
  //     justo duo dolores et ea rebum. Stet clita kasd gubergren, no
  //     sea takimata sanctus est Lorem ipsum dolor sit amet.
  //   </em>
  // );

  const table = content => {

    return <table
      class="d-block user-select-contain"
      data-paste-markdown-skip="">
      <tbody class="d-block">
        <tr class="d-block">
          <td class="d-block comment-body markdown-body  js-comment-body">
            <p class="color-fg-muted">{content}</p>
          </td>
        </tr>
        <tr
          class="d-block pl-3 pr-3 pb-3 js-comment-body-error"
          hidden="">
          <td class="d-block">
            <div class="flash flash-warn" role="alert">
              <p class="mb-1">
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  class="octicon octicon-info">
                  <path
                    fill-rule="evenodd"
                    d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path>
                </svg>
                The text was updated successfully, but these errors
                were encountered:
              </p>
              <ol class="mb-0 pl-4 ml-4"></ol>
            </div>
          </td>
        </tr>
      </tbody>
    </table>;
  };

  ///////////////////////////////////////////////
  //  this is how we manipulate the component  //
  ///////////////////////////////////////////////

  port.onMessage.addListener(async function (message) {
    const { key, value } = message;
    observe(".edit-comment-hide", {
      add: element => {
        if (key === "CHATGPT_OUTPUT") {
          console.log("CHATGPT_OUTPUT: ", value);
          const issueDiv = select(".edit-comment-hide");
          issueDiv.append(table(value.text));
        }
      },
    });
  });

  // const stream = await fetchSSE();
};

init();
