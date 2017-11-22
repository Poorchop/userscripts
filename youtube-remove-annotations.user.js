// ==UserScript==
// @name        YouTube Remove Annotations
// @namespace   https://github.com/Poorchop/userscripts
// @description Automatically toggles off YouTube annotations
// @include     *youtube.com/watch*
// @version     0.1
// @grant       none
// ==/UserScript==


// For new Material Design layout (2017)

let settingsBtn;
let settingsPanel;
let menuItems;
let annotationNode;
let observer;

function toggleAnnotations(node) {
  node.click();
}

function annotationCheck() {
  // open the settings panel
  settingsBtn = document.getElementsByClassName("ytp-button ytp-settings-button")[0];
  settingsBtn.click();

  // locate the settings panel and menu items
  settingsPanel = document.getElementsByClassName("ytp-panel-menu")[0];
  menuItems = document.getElementsByClassName("ytp-menuitem-label");

  // check to see if the annotation toggler exists
  for (let item of menuItems) {
    if (item.innerHTML === "Annotations") {
      annotationNode = item.parentNode;
      if (annotationNode.getAttribute("aria-checked") === "true") {
        toggleAnnotations(annotationNode);
        break;
      }
    }
  }

  // annotation toggler might appear later
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      annotationNode = mutation.addedNodes[0];
      if (!annotationNode) {
        return;
      }
      nodeLabel = annotationNode.childNodes[0];
      if (nodeLabel.innerHTML === "Annotations" && annotationNode.getAttribute("aria-checked") === "true") {
        toggleAnnotations(annotationNode);
        observer.disconnect();
      }
    });
  });

  observer.observe(settingsPanel, { childList: true });

  // close the settings panel
  settingsBtn.click();

}

function init() {
  window.addEventListener("yt-navigate-finish", function () {
    if (window.location.pathname === "/watch") {
      annotationCheck();
    } else {
      if (observer) {
        observer.disconnect();
      }
    }
  });
}

init();
