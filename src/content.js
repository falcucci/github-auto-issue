import React from "dom-chef";
import domLoaded from "dom-loaded";
import elementReady from "element-ready";
import { observe } from "selector-observer";
import select from "select-dom";
const port = chrome.runtime.connect({ name: "main-port" });

const sucessBtnPath =
  "html body.logged-in.env-production.page-responsive div.logged-in.env-production.page-responsive div.application-main div main#js-repo-pjax-container turbo-frame#repo-content-turbo-frame div#repo-content-pjax-container.repository-content div.clearfix.new-discussion-timeline.js-check-all-container.container-xl.px-3.px-md-4.px-lg-5.mt-4 form#new_issue.new_issue div div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end.Layout--sidebar-narrow div.Layout-main div.timeline-comment-wrapper.timeline-new-comment.composer.composer-responsive div.timeline-comment.color-bg-default.hx_comment-box--tip div.js-slash-command-surface div.flex-items-center.flex-justify-end.d-none.d-md-flex.mx-2.mb-2.px-0 div.d-flex.flex-items-center.flex-auto";

const button = () => {
  return (
    <span
      id="summarize"
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
  const buttonReady = select("#summarize");
  const anchor = select(sucessBtnPath);
  if (!buttonReady && anchor) {
    anchor.append(button());
  }

  const handleClick = async () => {
    await elementReady("#issue_title");
    const titleElement = select("#issue_title");
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
  };

  observe("#summarize", {
    add: element => {
      element.addEventListener("click", handleClick);
    },
  });

  ///////////////////////////////////////////////
  //  this is how we manipulate the component  //
  ///////////////////////////////////////////////

  port.onMessage.addListener(async function (message) {
    const { key, value } = message;
    observe("#issue_body", {
      add: element => {
        if (key === "CHATGPT_OUTPUT") {
          element.value = element.value + value.text;
        }
      },
    });
  });
};

init();
