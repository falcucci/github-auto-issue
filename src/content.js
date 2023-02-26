import React from "dom-chef";
import domLoaded from "dom-loaded";
import elementReady from "element-ready";
import { observe } from "selector-observer";
import optionsStorage from "./options-storage.js";
import select from "select-dom";
const port = chrome.runtime.connect({ name: "main-port" });

const button = () => {
  return (
    <span
      class="rounded-3 color-bg-emphasis color-fg-on-emphasis f6 text-uppercase v-align-middle px-2 py-1 ml-3"
      style={{
        cursor: "pointer",
        background:
          "linear-gradient(135deg, rgba(191,57,137,1) 0%, rgba(9,107,222,1) 100%)",
      }}>
      summarize
    </span>
  );
};

const init = async () => {
  await domLoaded;
  const options = await optionsStorage.getAll();

  //////////////////////////////////////////
  //  adding the button to interact with  //
  //////////////////////////////////////////

  await elementReady(
    "html body.logged-in.env-production.page-responsive div.logged-in.env-production.page-responsive div.application-main div main#js-repo-pjax-container turbo-frame#repo-content-turbo-frame div#repo-content-pjax-container.repository-content div.clearfix.new-discussion-timeline.js-check-all-container.container-xl.px-3.px-md-4.px-lg-5.mt-4 form#new_issue.new_issue div div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end.Layout--sidebar-narrow div.Layout-main div.timeline-comment-wrapper.timeline-new-comment.composer.composer-responsive div.timeline-comment.color-bg-default.hx_comment-box--tip div.js-slash-command-surface div.flex-items-center.flex-justify-end.d-none.d-md-flex.mx-2.mb-2.px-0 div.d-flex.flex-items-center.flex-auto"
  );

  const issueDiv2 = select(
    "html body.logged-in.env-production.page-responsive div.logged-in.env-production.page-responsive div.application-main div main#js-repo-pjax-container turbo-frame#repo-content-turbo-frame div#repo-content-pjax-container.repository-content div.clearfix.new-discussion-timeline.js-check-all-container.container-xl.px-3.px-md-4.px-lg-5.mt-4 form#new_issue.new_issue div div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end.Layout--sidebar-narrow div.Layout-main div.timeline-comment-wrapper.timeline-new-comment.composer.composer-responsive div.timeline-comment.color-bg-default.hx_comment-box--tip div.js-slash-command-surface div.flex-items-center.flex-justify-end.d-none.d-md-flex.mx-2.mb-2.px-0 div.d-flex.flex-items-center.flex-auto"
  );

  console.log("issueDiv2: ", issueDiv2);
  issueDiv2.append(button());
  await elementReady("#issue_title");
  const titleElement = select("#issue_title");
  console.log("titleElement: ", titleElement);
  const textContent = titleElement.value;
  await elementReady("#issue_body");
  const issueBodyElement = select("#issue_body");
  issueBodyElement.value = "";
  port.postMessage({
    key: "SCRAPED_ISSUE_TITLE",
    value: {
      text: textContent,
    },
  });
  await elementReady(".edit-comment-hide");

  const table = content => {
    return (
      <table
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
                  The text was updated successfully, but these
                  errors were encountered:
                </p>
                <ol class="mb-0 pl-4 ml-4"></ol>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  ///////////////////////////////////////////////
  //  this is how we manipulate the component  //
  ///////////////////////////////////////////////

  port.onMessage.addListener(async function (message) {
    const { key, value } = message;
    observe("#issue_body", {
      add: element => {
        if (key === "CHATGPT_OUTPUT") {
          // const issueDiv = select(
          //   ".edit-comment-hide .color-fg-muted"
          // );
          // issueDiv.textContent = issueDiv.textContent + value.text;
          element.value = element.value + value.text;
        }
      },
    });
  });

  // const stream = await fetchSSE();
};

init();
