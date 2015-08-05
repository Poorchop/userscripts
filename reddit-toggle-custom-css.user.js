// ==UserScript==
// @name        Reddit Toggle Custom Subreddit CSS
// @namespace   https://github.com/Poorchop/userscripts
// @description Adds a small checkbox for toggling custom subreddit CSS
// @include     /https?:\/\/[a-z]+\.reddit\.com\//
// @version     1.0
// @grant       none
// ==/UserScript==

/* jshint browser: true, esnext: true */

let subredditCSSManager = {
  stylesheetList: [],

  customCSSNode: document.querySelector("[title='applied_subreddit_stylesheet']"),

  SubredditStylesheet: function (subreddit, stylesheet) {
    this.subreddit = subreddit;
    this.stylesheet = stylesheet;
  },

  getSubredditName: function () {
    let subredditNameNodes = document.getElementsByClassName("redditname");

    return subredditNameNodes[1].firstElementChild.textContent;
  },

  initialize: function () {
    // Grab the stylesheet link before removing the href value
    if (this.customCSSNode.hasAttribute("href")) {
      let subredditName = this.getSubredditName();
      let stylesheet = document.querySelector("[title='applied_subreddit_stylesheet']").getAttribute("href");
      let setMatchingStylesheet = new this.SubredditStylesheet(subredditName, stylesheet);

      if (this.stylesheetList.length) {
        for (let i = 0, j = this.stylesheetList.length; i < j; i++) {
          if (JSON.stringify(setMatchingStylesheet) !== JSON.stringify(this.stylesheetList[i])) {
            this.stylesheetList.push(setMatchingStylesheet);
          }
        }
      } else {
        this.stylesheetList.push(setMatchingStylesheet);
      }

      this.customCSSNode.removeAttribute("href");
    }
  }
};

function checkboxHandler() {
  if (document.getElementById("toggle-subreddit-css").value === "off") {
    let subredditName = subredditCSSManager.getSubredditName();
    document.getElementById("toggle-subreddit-css").value = "on";

    for (let i = 0, j = subredditCSSManager.stylesheetList.length; i < j; i++) {
      if (subredditName === subredditCSSManager.stylesheetList[i].subreddit) {
        subredditCSSManager.customCSSNode.setAttribute("href", subredditCSSManager.stylesheetList[i].stylesheet);
        subredditCSSManager.stylesheetList.splice(i, 1);
      }
    }
  } else {
    subredditCSSManager.initialize();
    document.getElementById("toggle-subreddit-css").value = "off";
    subredditCSSManager.customCSSNode.removeAttribute("href");
  }
}

function addCheckbox() {
  if (!document.getElementById("toggle-subreddit-css")) {
    let newCheckbox = document.createElement("input");
    newCheckbox.setAttribute("type", "checkbox");
    newCheckbox.setAttribute("id", "toggle-subreddit-css");

    let newLabel = document.createElement("label");
    newLabel.setAttribute("for", "toggle-subreddit-css");

    let newContent = document.createTextNode(" Toggle custom subreddit CSS");
    newLabel.appendChild(newContent);

    let target = document.getElementsByClassName("redditname")[1].parentNode;
    target.insertBefore(newCheckbox, target.childNodes[1]);
    target.insertBefore(newLabel, target.childNodes[2]);
    target.insertBefore(document.createElement("br"), target.childNodes[3]);
    target.childNodes[3].style.marginBottom="5px";

    document.getElementById("toggle-subreddit-css").checked = false;
    document.getElementById("toggle-subreddit-css").value = "off";

    subredditCSSManager.initialize();
  }
}

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", addCheckbox, false);
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("toggle-subreddit-css").addEventListener("click", checkboxHandler);
  });
}
