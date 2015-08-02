// ==UserScript==
// @name        Reddit Toggle Custom Subreddit CSS
// @namespace   https://github.com/Poorchop/userscripts
// @description Adds a small checkbox for toggling custom subreddit CSS
// @include     /https?:\/\/[a-z]+\.reddit\.com\//
// @version     0.1.1
// @grant       none
// ==/UserScript==

/* jshint browser: true */

var subredditCSSManager = {
  stylesheetList: [],

  customCSSNode: document.querySelector("[title='applied_subreddit_stylesheet']"),

  SubredditStylesheet: function (subreddit, stylesheet) {
    this.subreddit = subreddit;
    this.stylesheet = stylesheet;
  },

  getSubredditName: function () {
    var subredditNameNodes = document.getElementsByClassName("redditname");

    return subredditNameNodes[1].firstElementChild.textContent;
  },

  initialize: function () {
    // Grab the stylesheet link before removing the href value
    if (this.customCSSNode.hasAttribute("href")) {
      var i;
      var subredditName = this.getSubredditName();
      var stylesheet = document.querySelector("[title='applied_subreddit_stylesheet']").getAttribute("href");
      var setMatchingStylesheet = new this.SubredditStylesheet(subredditName, stylesheet);

      if (this.stylesheetList.length) {
        for (i = 0; i < this.stylesheetList.length; i++) {
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
  var subredditName = subredditCSSManager.getSubredditName();

  if (document.getElementById("toggle-subreddit-css").value === "off") {
    var i;
    document.getElementById("toggle-subreddit-css").value = "on";
    for (i = 0; i < subredditCSSManager.stylesheetList.length; i++) {
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
  var newCheckbox = document.createElement("input");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("id", "toggle-subreddit-css");
  var newLabel = document.createElement("label");
  newLabel.setAttribute("for", "toggle-subreddit-css");
  var newContent = document.createTextNode(" Toggle custom subreddit CSS");
  newLabel.appendChild(newContent);

  var target = document.getElementsByClassName("redditname")[1].parentNode;
  target.insertBefore(newCheckbox, target.childNodes[1]);
  target.insertBefore(newLabel, target.childNodes[2]);
  target.insertBefore(document.createElement("br"), target.childNodes[3]);

  document.getElementById("toggle-subreddit-css").checked = false;
  document.getElementById("toggle-subreddit-css").value = "off";

  subredditCSSManager.initialize();
}

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", addCheckbox, false);
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("toggle-subreddit-css").addEventListener("click", checkboxHandler);
  });
}
