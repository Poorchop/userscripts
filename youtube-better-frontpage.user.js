// ==UserScript==
// @name        Youtube Better Front Page
// @namespace   https://github.com/Poorchop/userscripts
// @description Hides the nasty bits on the default Youtube front page, leaving only the important bits
// @include     /https?:\/\/www\.youtube\.com\/$/
// @version     0.1
// @grant       none
// ==/UserScript==

/* jshint browser: true, esnext: true */

function removeGarbage() {
  let body = document.getElementById("body");

  // remove the footer
  let footer = document.getElementById("footer-container");
  body.removeChild(footer);

  // unclutter the main container
  let bodyContainer = document.getElementById("body-container");
  bodyContainer.removeChild(document.getElementById("a11y-announcements-container"));
  bodyContainer.removeChild(document.getElementById("masthead-positioner-height-offset"));
  bodyContainer.removeChild(document.getElementById("page-container"));

  // clean up the header and apply/remove styles
  bodyContainer.style.background = "#fff";

  let mastheadContainer = document.getElementById("yt-masthead-container");
  mastheadContainer.removeChild(document.getElementById("a11y-skip-nav"));
  mastheadContainer.style.background = "#fff";
  mastheadContainer.style.borderBottom = "none";

  let mastheadLogoContainer = document.getElementsByClassName("yt-masthead-logo-container")[0];
  mastheadLogoContainer.removeChild(document.getElementById("appbar-guide-button-container"));
  mastheadLogoContainer.style.marginTop = "250px";
  mastheadLogoContainer.style.textAlign = "center";
  mastheadLogoContainer.style.float = "none";
  mastheadLogoContainer.style.position = "unset";
  mastheadLogoContainer.style.width = "unset";

  let mastheadSignin = document.getElementById("yt-masthead-signin");
  if (!mastheadSignin) {
    // case for when user is logged in
    // reuse mastheadSignin assignment to more easily find YouTube Center button
    mastheadSignin = document.getElementById("yt-masthead-user");
  }
  // TODO: nicely display subscriptions when user is logged in - delete the node for now
  document.getElementById("masthead-positioner").removeChild(document.getElementById("masthead-appbar-container"));
  mastheadSignin.style.float = "none";
  mastheadSignin.style.marginLeft = "unset";
  mastheadSignin.style.marginTop = "unset";
  mastheadSignin.style.position = "absolute";
  mastheadSignin.style.right = "10px";
  mastheadSignin.style.top = "10px";

  document.getElementById("masthead-search").style.margin = "auto";

  // set style for YouTube Center button
  let ytCenterBtn = mastheadSignin.children[mastheadSignin.childElementCount - 1];
  if (ytCenterBtn.getAttribute("title") === "Toggle YouTube Center Settings panel") {
    ytCenterBtn.style.margin = "0px 0px 0px 10px";
  }
}

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", removeGarbage);
}
