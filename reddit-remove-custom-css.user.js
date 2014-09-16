// ==UserScript==
// @name        Disable Custom Subreddit CSS
// @namespace   https://github.com/Poorchop/userscripts
// @description Adds a small checkbox for toggling custom subreddit CSS
// @include     /https?:\/\/[a-z]+\.reddit\.com\//
// @version     0.1
// @grant       none
// ==/UserScript==

var customCSSNode = document.querySelector("[title='applied_subreddit_stylesheet']");
var stylesheetList = [];

function SubredditStylesheet(subreddit, stylesheet) {
    this.subreddit = subreddit;
    this.stylesheet = stylesheet;
}

var getSubredditName = function () {
    var subredditNameNodes = document.getElementsByClassName("redditname");
    return subredditNameNodes[1].firstElementChild.textContent;
};

var initialize = function () {
    /*
     * Grab the stylesheet link before removing the href value
     */
    if (customCSSNode.hasAttribute("href")) {
        var subredditName = getSubredditName();
        var stylesheet = document.querySelector("[title='applied_subreddit_stylesheet']").getAttribute("href");

        var setMatchingStylesheet = new SubredditStylesheet(subredditName, stylesheet);

        if (stylesheetList.length) {
            for (var i = 0; i < stylesheetList.length; i++) {
                if (JSON.stringify(setMatchingStylesheet) !== JSON.stringify(stylesheetList[i])) {
                    stylesheetList.push(setMatchingStylesheet);
                }
            }
        }
        else {
            stylesheetList.push(setMatchingStylesheet);
        }

        customCSSNode.removeAttribute("href");
    }
};

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", addCheckbox, false);
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

    initialize();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("toggle-subreddit-css").addEventListener("click", checkboxHandler);
});

function checkboxHandler() {
    var subredditName = getSubredditName();

    if (document.getElementById("toggle-subreddit-css").value === "off") {
        document.getElementById("toggle-subreddit-css").value = "on";
        for (var i = 0; i < stylesheetList.length; i++) {
            if (subredditName === stylesheetList[i].subreddit) {
                customCSSNode.setAttribute("href", stylesheetList[i].stylesheet);
                stylesheetList.splice(i, 1);
            }
        }
    }
    else {
        initialize();
        document.getElementById("toggle-subreddit-css").value = "off";
        customCSSNode.removeAttribute("href");
    }
}
