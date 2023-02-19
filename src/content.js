import React from "dom-chef";
import domLoaded from "dom-loaded";

const init = async () => {
  await domLoaded;
  const a = (
    <div>hello world</div>
  );
  console.log('a: ', a);
  document.body.append(a);
};

init();
