// ==UserScript==
// @name        YouTube Better Front Page
// @namespace   https://github.com/Poorchop/userscripts
// @description Hides the nasty bits on the default YouTube front page, leaving only the important bits
// @include     http*://www.youtube.com/*
// @version     1.1
// @grant       none
// ==/UserScript==

/* jshint browser: true, esnext: true */

let observer;

function addCustomCSS() {
  let betterCSS = "#body-container { background: #fff !important; }" +
      "#yt-masthead-container { background: #fff !important; border-bottom: none !important; }" +
      ".yt-masthead-logo-container { float: none !important; margin-top: 250px !important;" +
      "position: unset !important; text-align: center !important; width: unset !important; }" +
      "#yt-masthead-signin, #yt-masthead-user { float: none !important; margin-top: unset !important;" +
      "margin-left: unset !important; position: absolute !important; right: 10px !important; top: 10px !important; }" +
      "#masthead-search { margin: auto !important; }" +
      "#appbar-guide-button-container { display: none !important; }" +
      "#page-container { display: none !important; }" +
      "#footer-container {display: none !important; }" +
      "#masthead-appbar { display: none; }" +
      "#masthead-user-button { margin: 0px 0px 0px 10px }"; // YouTube Center button

  let betterStyle = document.createElement("style");
  betterStyle.type = "text/css";
  betterStyle.id = "better-css";
  betterStyle.appendChild(document.createTextNode(betterCSS));
  document.head.appendChild(betterStyle);
}

function applyStyles() {
  if (window.location.pathname === "/") {
    addCustomCSS();
  } else {
    let styles = document.getElementById("better-css");

    if (styles) {
      styles.parentElement.removeChild(styles);
    }
  }
}

function bodyChange(mutations) {
  for (let mutation of mutations) {
    for (let element of mutation.addedNodes) {
      if (element.id === "progress") {
        applyStyles();
      }
    }
  }
}

function init() {
  /* don't do anything inside iframes */
  if (window.self !== window.top) {
    return;
  }

  observer = new MutationObserver(bodyChange);
  observer.observe(document.body, { childList: true });

  applyStyles();
}

init();
