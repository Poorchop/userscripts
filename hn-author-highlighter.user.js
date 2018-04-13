// ==UserScript==
// @name        Hacker News Author Highlighter
// @author      Poorchop
// @namespace   https://github.com/Poorchop/userscripts
// @description Makes the author's replies more visible in the comments
// @include     https://news.ycombinator.com/item?id=*
// @version     0.1.1
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle(
  '.original-poster { \
    background-color: #ff6600; \
    border-radius: 4px; \
    color: #222 !important; \
    padding: 2px 4px; \
  }'
);

function highlightComments(authorComments) {
  for (let comment of authorComments) {
    comment.className = 'original-poster';
  }
}

function findAuthor() {
  const authorName = document.getElementsByClassName('hnuser')[0].innerHTML;
  let authorComments = [...document.querySelectorAll(`[href="user?id=${authorName}"]`)];
  authorComments.shift();   // Delete first item since it's the original post

  if (authorComments.length) {
    highlightComments(authorComments);
  }
}

findAuthor();
