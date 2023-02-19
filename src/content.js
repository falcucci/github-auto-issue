import React from "dom-chef";
import select from 'select-dom';
import elementReady from "element-ready";
import domLoaded from "dom-loaded";

export const safeElementReady = selector => {
  const waiting = elementReady(selector);

  // Don't check ad-infinitum
  domLoaded.then(() =>
    requestAnimationFrame(() => waiting.cancel())
  );

  // If cancelled, return null like a regular select() would
  return waiting.catch(() => null);
};

const init = async () => {
  console.log('hey');
  await safeElementReady("body");
  const a = (
    <div>hello world</div>
  );
  console.log('a: ', a);
  document.body.append(a);
};

init();
