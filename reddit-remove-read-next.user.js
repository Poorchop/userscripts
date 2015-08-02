// ==UserScript==
// @name        Reddit Remove Read Next Popup
// @namespace   https://github.com/Poorchop/userscripts
// @description Automatically removes the "read next" popup
// @include     /https?:\/\/[a-z]+\.reddit\.com\//
// @version     0.1
// @grant       none
// ==/UserScript==

/* jshint browser: true */

var rosemaryBaby = document.getElementsByClassName("read-next-container")[0];
var rosemary = rosemaryBaby.parentNode;

// too much effort to toggle active class so just remove the node entirely
rosemary.removeChild(rosemaryBaby);
