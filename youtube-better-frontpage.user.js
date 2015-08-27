// ==UserScript==
// @name        Youtube Better Front Page
// @namespace   https://github.com/Poorchop/userscripts
// @description Hides the nasty bits on the default Youtube front page, leaving only the important bits
// @include     /https?:\/\/www\.youtube\.com\/$/
// @version     1.0
// @grant       none
// ==/UserScript==

/* jshint browser: true, esnext: true */

let observer;

init();

function init() {
  /* don't do anything inside iframes */
  if (window.self !== window.top) {
    return;
  }

  observer = new MutationObserver(body_change);
  observer.observe(document.body, { childList: true });

  apply_styles();
}

function body_change(mutations) {
  for (let mutation of mutations) {
    for (let element of mutation.addedNodes) {
      if (element.id == 'progress') {
        apply_styles();
      }
    }
  }
}

function apply_styles() {
  if (window.location.pathname == '/') {
    addCustomCSS();
  }
  else {
    let styles = document.getElementById('better-css');

    if (styles) {
      styles.parentElement.removeChild(styles);
    }
  }
}

function addCustomCSS() {
  let betterCSS = "#body-container { background: #fff !important; }" +
      "#yt-masthead-container { background: #fff !important; border-bottom: none !important; }" +
      ".yt-masthead-logo-container { float: none !important; margin-top: 250px !important;" +
      "position: unset !important; text-align: center !important; width: unset !important; }" +
      "#yt-masthead-signin { float: none !important; margin-top: unset !important; margin-left: unset !important;" +
      "position: absolute !important; right: 10px !important; top: 10px !important; }" +
      "#masthead-search { margin: auto !important; }" +
      "#appbar-guide-button-container { display: none !important; }" +
      "#page-container { display: none !important; }" +
      "#footer-container {display: none !important; }" +
      "#masthead-appbar { display: none; }";

  let betterStyle = document.createElement("style");
  betterStyle.type = "text/css";
  betterStyle.id = "better-css";
  betterStyle.appendChild(document.createTextNode(betterCSS));
  document.head.appendChild(betterStyle);
}

