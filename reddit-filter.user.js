// ==UserScript==
// @name        Reddit Filter
// @namespace   https://github.com/Poorchop/userscripts
// @description Allows for filtering/hiding of posts
// @include     https://www.reddit.com/*
// @version     0.4.0
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @resource    bootstrap https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css
// @require     https://code.jquery.com/jquery-1.11.3.min.js
// @require     https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js
// ==/UserScript==

/* jshint browser: true, esnext: true, jquery: true, multistr: true */
/* global GM_addStyle */
/* global GM_listValues */
/* global GM_setValue */
/* global GM_getValue */
/* global GM_deleteValue */

// Bootstrap CSS restyles the entire page so only pull in styles where necessary
GM_addStyle(
  "body { \
    padding-right: 0px !important; } \
  #filter-modal { \
    box-sizing: border-box; \
    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; \
    font-size: 14px; \
    line-height: 1.42857; \
    color: #333; } \
  #filter-modal strong { \
    font-weight: 700; } \
  #filter-modal small { \
    font-size: 85%; } \
  #filter-modal .text-warning { \
    color: #8A6D3B; } \
  #filter-modal .alert { \
    padding: 15px; \
    margin-bottom: 20px; \
    border: 1px solid transparent; \
    border-radius: 4px; } \
  #filter-modal .alert-warning { \
    color: #8A6D3B; \
    background-color: #FCF8E3; \
    border-color: #FAEBCC;} \
  #filter-modal button { \
    text-transform: none; \
    overflow: visible; \
    margin: 0px; \
    font: inherit; } \
  #filter-modal .modal-content { \
    background-color: #FFF !important; \
    border-radius: 6px !important; } \
  #filter-modal .modal-header { \
    min-height: 16.43px !important; \
    padding: 15px !important; \
    color: inherit; \
    border-bottom: 1px solid #E5E5E5 !important; \
    position: unset; top: unset; right: unset; } \
  #filter-modal .close { \
    float: right; font-size: 21px; \
    font-weight: 700; \
    line-height: 1; \
    color: #000; \
    text-shadow: 0px 1px 0px #FFF; opacity: 0.2; } \
  #filter-modal .close:hover { \
    color: #000; \
    text-decoration: none; \
    cursor: pointer; \
    opacity: 0.5; } \
  #filter-modal .modal-header .close { \
    margin-top: -2px; } \
  #filter-modal button.close { \
    padding: 0px; \
    cursor: pointer; \
    background: transparent none repeat scroll 0px 0px; \
    border: 0px none; } \
  #filter-modal .modal-title { \
    margin: 0px !important; \
    line-height: 1.42857 !important; } \
  #filter-modal h4.modal-title { \
    font-size: 18px !important; \
    font-weight: 500 !important; \
    text-transform: none !important; } \
  #filter-modal .modal-body { \
    position: relative !important; \
    padding: 15px !important; \
    font-size: 14px !important; } \
  #filter-modal .modal-footer { \
    background: none !important; \
    text-align: right; \
    padding: 15px !important; \
    border-top: 1px solid #E5E5E5 !important; } \
  #filter-modal .btn { \
    display: inline-block; \
    padding: 6px 12px; \
    margin-bottom: 0px; \
    font-size: 14px; \
    font-weight: 400; \
    line-height: 1.42857; \
    text-align: center; \
    white-space: nowrap; \
    vertical-align: middle; \
    cursor: pointer; \
    -moz-user-select: none; \
    border: 1px solid transparent; \
    border-radius: 4px; } \
  #filter-modal .btn-default { \
    text-shadow: 0px 1px 0px #FFF; \
    background-image: linear-gradient(to bottom, #FFF 0px, #E0E0E0 100%); \
    background-repeat: repeat-x; \
    border-color: #CCC; \
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.15) inset, 0px 1px 1px rgba(0, 0, 0, 0.075); \
    color: #333; \
    background-color: #FFF; } \
  #filter-modal .modal-footer .btn + .btn { \
    margin-bottom: 0px; \
    margin-left: 5px; } \
  #filter-modal .btn-primary { \
    background-image: linear-gradient(to bottom, #337AB7 0px, #265A88 100%); \
    background-repeat: repeat-x; \
    border-color: #245580; \
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.2); \
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.15) inset, 0px 1px 1px rgba(0, 0, 0, 0.075); \
    color: #FFF; \
    background-color: #337AB7; } \
  #filter-modal .btn:hover { \
    text-decoration: none; } \
  #filter-modal .btn-default:hover { \
    background-color: #E0E0E0; \
    background-position: 0px -15px; \
    color: #333; \
    border-color: #ADADAD; } \
  #filter-modal .btn-primary:hover { \
    background-color: #265A88; \
    background-position: 0px -15px; \
    color: #FFF; \
    border-color: #204D74; } \
  #filter-modal .btn-sm { \
    padding: 5px 10px; \
    font-size: 12px; \
    line-height: 1.5; \
    border-radius: 3px; } \
  #filter-modal .btn-xs { \
    padding: 1px 5px; \
    font-size: 12px; \
    line-height: 1.5; \
    border-radius: 3px; } \
  #filter-modal table { \
    margin-bottom: 10px; } \
  #filter-modal th, #filter-modal td { \
    padding: 2px; } \
  #filter-modal input { \
    padding: 2px; } \
  #filter-modal #save-confirm { \
    color: #666; \
    font-size: 12px; \
    display: inline; \
    margin-right: 400px; \
    opacity: 0; } \
  #filter-modal #save-confirm:hover { \
    cursor: default; } \
  #filter-modal .modal-body > p { \
    margin-bottom: 10px; } \
  #filter-modal th { \
    font-weight: 700; } \
  #filter-modal .delete-btn { \
    color: #8B0000; \
    width: 100%; } \
  #filter-modal .delete-btn:hover { \
    color: #8B0000; } \
  #hide-toggle-btn { \
    margin: 10px 5px 0px 0px; }"
);

let megaCollection;
let deletedKeys = [];
let numFilters;

function buildNewCollection(expression, filterType, newCollection) {
  // TODO: remove duplicate entries due to different capitalization
  if (!newCollection.hasOwnProperty(expression)) {
    newCollection[expression] = [filterType];
  } else {
    newCollection[expression].push(filterType);
  }
}

function saveFilters() {
  // TODO: only check new additions since initial setup
  let cursorCSS = "#filter-modal, #filter-modal *:hover { cursor: progress; }";
  let cursorStyle = document.createElement("style");
  cursorStyle.type = "text/css";
  cursorStyle.id = "cursor-css";
  cursorStyle.appendChild(document.createTextNode(cursorCSS));
  document.head.appendChild(cursorStyle);

  let tbody = document.getElementById("filter-tbody");
  if (tbody.childElementCount > 0) {
    let newCollection = {};

    for (let item of deletedKeys) {
      GM_deleteValue(item);
    }
    deletedKeys = [];

    for (let node of tbody.children) {
      let expression = node.cells[0].childNodes[0].value;
      if (expression) {
        let optionCell = node.cells[1].childNodes[0];
        let filterType = optionCell.options[optionCell.selectedIndex].value;
        buildNewCollection(expression, filterType, newCollection);
      }
    }

    for (let key in newCollection) {
      let value = newCollection[key].join(" ");
      GM_setValue(key, value);
    }
  } else {
    for (let item of megaCollection) {
      GM_deleteValue(item);
    }
    megaCollection = [];
    deletedKeys = [];
  }

  cursorStyle.parentElement.removeChild(cursorStyle);

  $("#save-confirm").animate({
    opacity: 1
  }, "fast", function () {
    $(this).animate({
      opacity: 0
    }, 3000);
  });
}

function deleteFilter(btn) {
  let goodbye = btn[0].parentElement.parentElement;
  let key = goodbye.firstChild.firstChild.value;
  deletedKeys.push(key);
  goodbye.parentElement.removeChild(goodbye);
}

function addRow(key, value) {
  let row = document.createElement("tr");
  let firstCell = document.createElement("td");
  let secondCell = document.createElement("td");
  let thirdCell = document.createElement("td");
  let dropdown = document.createElement("select");
  let input = document.createElement("input");
  let deleteBtn = document.createElement("button");
  let markup = "<option value='subreddit'>subreddit</option> \
    <option value='title'>title</option> \
    <option value='url'>URL</option> \
    <option value='user'>user</option>";

  input.value = key;

  thirdCell.style = "text-align: center;";

  dropdown.style = "width: 98%";
  dropdown.innerHTML = markup;

  switch (value) {
    case "title":
      dropdown.children[1].setAttribute("selected", "");
      break;
    case "url":
      dropdown.children[2].setAttribute("selected", "");
      break;
    case "user":
      dropdown.children[3].setAttribute("selected", "");
      break;
    default:
      dropdown.children[0].setAttribute("selected", "");
  }

  deleteBtn.className = "close delete-btn";
  deleteBtn.innerHTML = "&times;";

  $(deleteBtn).click(function () {
    deleteFilter($(this));
  });

  firstCell.appendChild(input);
  firstCell.firstChild.style = "width: 98%;";
  secondCell.appendChild(dropdown);
  thirdCell.appendChild(deleteBtn);

  row.appendChild(firstCell);
  row.appendChild(secondCell);
  row.appendChild(thirdCell);

  $("#filter-modal tbody").append(row);
}

function displayRules() {
  for (let key of megaCollection) {
    let valuesArr = GM_getValue(key).split(" ");
    for (let value of valuesArr) {
      addRow(key, value);
    }
  }
}

function applyFilteredCSS(classList) {
  numFilters = classList.length;
  let selectors = classList.join(", ");
  let hiddenCSS = selectors + " { display: none; }";
  let highlightedCSS = selectors + " { transition: background-color 2.0s ease; background-color: yellow; }";

  let hiddenStyle = document.createElement("style");
  hiddenStyle.type = "text/css";
  hiddenStyle.id = "hidden-css";
  hiddenStyle.appendChild(document.createTextNode(hiddenCSS));

  let highlightedStyle = document.createElement("style");
  highlightedStyle.type = "text/css";
  highlightedStyle.id = "highlighted-css";
  highlightedStyle.appendChild(document.createTextNode(highlightedCSS));

  document.head.appendChild(hiddenStyle);
  document.head.appendChild(highlightedStyle);
}

function findFilteredPosts() {
  let siteTable = document.querySelector("#siteTable");
  let nodeList = siteTable.querySelectorAll(".thing.link");
  let visibleLinks = [];
  let hiddenIndeces = [];
  let classList = [];

  for (let node of nodeList) {
    visibleLinks.push(node);
  }

  for (let item of megaCollection) {
    let values = GM_getValue(item).split(" ");
    for (let value of values) {
      switch (value) {
        case "subreddit":
          for (let i = 0, j = visibleLinks.length; i < j; i++) {
            let target;
            try {
              target = visibleLinks[i].querySelector(".subreddit").innerHTML.substring(2).toLowerCase();
            }
            catch (e) {
              // user is currently on a subreddit page
              //console.log(e);
            }
            if (target && target === item.toLowerCase()) {
              let className = visibleLinks[i].getAttribute("data-fullname");
              className = ".id-" + className;
              if (hiddenIndeces.indexOf(i) === -1) {
                hiddenIndeces.push(i);
                classList.push(className);
              }
            }
          }
          break;
        case "title":
          for (let i = 0, j = visibleLinks.length; i < j; i++) {
            let target = visibleLinks[i].querySelector(".title").innerHTML;
            if (target.indexOf(item) >= 0) {
              let className = visibleLinks[i].getAttribute("data-fullname");
              className = ".id-" + className;
              if (hiddenIndeces.indexOf(i) === -1) {
                hiddenIndeces.push(i);
                classList.push(className);
              }
            }
          }
          break;
        case "url":
          for (let i = 0, j = visibleLinks.length; i < j; i++) {
            let target = visibleLinks[i].querySelector(".domain").childNodes[1].innerHTML.toLowerCase();
            if (target.indexOf(item.toLowerCase()) >= 0) {
              let className = visibleLinks[i].getAttribute("data-fullname");
              className = ".id-" + className;
              if (hiddenIndeces.indexOf(i) === -1) {
                hiddenIndeces.push(i);
                classList.push(className);
              }
            }
          }
          break;
        case "user":
          for (let i = 0, j = visibleLinks.length; i < j; i++) {
            let target = visibleLinks[i].querySelector(".author").innerHTML.toLowerCase();
            if (target === item.toLowerCase()) {
              let className = visibleLinks[i].getAttribute("data-fullname");
              className = ".id-" + className;
              if (hiddenIndeces.indexOf(i) === -1) {
                hiddenIndeces.push(i);
                classList.push(className);
              }
            }
          }
          break;
        default:
          console.log("If you see this message, abandon ship.");
      }
    }
  }

  // NOTE: keeping a list of remaining visible links might be unnecessary
  for (let index of hiddenIndeces) {
    visibleLinks.splice(visibleLinks[index], 1);
  }

  applyFilteredCSS(classList);
}

function init() {
  // get all existing rules
  megaCollection = GM_listValues();

  // hide filtered posts; don't apply to pages with these classes present, but still allow modal dialog to be accessible
  let commentarea = document.getElementsByClassName("commentarea").length;
  let profilePage = document.getElementsByClassName("profile-page").length;
  let messagesPage = document.getElementsByClassName("messages-page").length;

  if (megaCollection.length > 0 && !commentarea && !profilePage && !messagesPage) {
    findFilteredPosts();

    // create toggle buttons
    let hiddenCSS = document.getElementById("hidden-css");
    let hideToggleBtn = document.createElement("button");
    hideToggleBtn.id = "hide-toggle-btn";
    hideToggleBtn.innerHTML = "Show hidden posts (" + numFilters.toString() + ")";
    document.getElementById("siteTable").appendChild(hideToggleBtn);

    $(hideToggleBtn).click(function () {
      if (document.getElementById("hidden-css")) {
        hiddenCSS.parentElement.removeChild(hiddenCSS);
        $(this).text("Hide filtered posts");
      } else {
        document.head.appendChild(hiddenCSS);
        $(this).text("Show hidden posts (" + numFilters.toString() + ")");
      }
    });

    let highlightedCSS = document.getElementById("highlighted-css");
    let highlightToggleBtn = document.createElement("button");
    highlightToggleBtn.id = "highlight-toggle-btn";
    highlightToggleBtn.innerHTML = "Remove highlights";
    document.getElementById("siteTable").appendChild(highlightToggleBtn);

    $(highlightToggleBtn).click(function () {
      if (document.getElementById("highlighted-css")) {
        highlightedCSS.parentElement.removeChild(highlightedCSS);
        $(this).text("Apply highlights");
      } else {
        document.head.appendChild(highlightedCSS);
        $(this).text("Remove highlights");
      }
    });
  }

  // initial DOM setup
  let modalBtn = document.createElement("li");
  let separator = document.createElement("span");
  separator.className = "separator";
  separator.appendChild(document.createTextNode("-"));
  modalBtn.appendChild(separator);

  let modalToggle = document.createElement("a");
  modalToggle.href = "#filter-modal";
  modalToggle.setAttribute("data-toggle", "modal");
  modalToggle.appendChild(document.createTextNode("Filter"));
  modalBtn.appendChild(modalToggle);

  // create the modal
  let filterModal = document.createElement("div");
  filterModal.className = "modal fade";
  filterModal.id = "filter-modal";
  filterModal.tabIndex = "-1";
  filterModal.innerHTML =
    "<div class='modal-dialog'> \
      <div class='modal-content'> \
        <div class='modal-header'> \
          <button type='button' class='close' data-dismiss='modal' aria-label='Close'> \
            <span aria-hidden='true'>&times;</span> \
          </button> \
          <h4 class='modal-title' style='color: inherit;'>Reddit Filter</h4> \
        </div> \
        <div class='modal-body'> \
          <p> \
            <strong>Usage:</strong><br> \
            Title filters are case-sensitive and may match all or part of a string. Changes will be applied after \
            refreshing the page or after navigating away. \
          </p> \
          <p class='text-warning'> \
            <small> \
              Note: Remember to save your changes before closing this dialog, otherwise changes will be lost. \
            </small> \
          </p> \
          <table width='100%'> \
            <col span='1' style='width: 60%'> \
            <col span='1' style='width: 35%'> \
            <col span='1' style='width: 5%'> \
            <thead> \
              <tr> \
                <th>Expression:</th> \
                <th>Filter by:</th> \
                <th>Delete</th> \
              </tr> \
            </thead> \
            <tbody id='filter-tbody'></tbody> \
          </table> \
          <button type='button' id='add-filter' class='btn btn-default btn-xs'>Add</button> \
        </div> \
        <div class='modal-footer'> \
          <p id='save-confirm' style='display: inline; margin-right: 400px; opacity: 0;'>Settings saved</p> \
          <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button> \
          <button id='filter-save-btn' type='button' class='btn btn-primary'>Save changes</button> \
        </div> \
      </div> \
    </div>";

  document.getElementsByClassName("flat-list sr-bar hover")[0].appendChild(modalBtn);
  $("body").prepend(filterModal);
  displayRules();

  $("#add-filter").click(function () {
    addRow("", "subreddit");
  });

  $("#filter-save-btn").click(function () {
    saveFilters();
  });
}

init();
