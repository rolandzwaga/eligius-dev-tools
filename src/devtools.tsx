import diagnosticsHTML from "url:./panels/diagnostics-view/index.html";

chrome.devtools.panels.create(
  "Eligius Diagnostics",
  null,
  // See: https://github.com/PlasmoHQ/plasmo/issues/106#issuecomment-1188539625
  diagnosticsHTML.split("/").pop()
);

function IndexDevtools() {
  return (
    <h2>
      Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
    </h2>
  );
}

export default IndexDevtools;
